import express from 'express';
import { IncomingMessage, ServerResponse } from 'http';

import config from './config';
import routesV1 from './routes';
import initializeDB, { Contact } from './models';


initializeDB();

export class App {
    public app: express.Application;

    public server: any;

    constructor() {
        this.app = express();
        this.app.set("trust proxy", 2);
        this.app.use(
            express.json({
                type: "*/json",
                verify: (req: IncomingMessage, _res: ServerResponse, buf: Buffer) => {
                    try {
                        JSON.parse(buf.toString());
                    } catch (error) {
                        throw new Error("Invalid JSON");
                    }
                }
            })
        );
        this.app.use(express.text());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.set("view engine", "html");
        this.app.use(`${config.BASE_PATH}`, routesV1);
    }

    public start() {
        this.server = this.app.listen(config.PORT, async () => {
            console.log(`Server started on port ${config.PORT}`);
        });
    }
}

process.on("uncaughtException", (_error) => {
    process.exit(1000);
});

process.on("unhandledRejection", (_error) => {
    process.exit(1000);
});

const appInstance = new App();
appInstance.start();
