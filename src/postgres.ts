import { Sequelize } from 'sequelize';


export default class SequelizeConnection {
    private static instance: {
        [dbName: string]: Sequelize;
    };

    private constructor() { }

    init(
        postgresDB: string,
        postgresUsername: string,
        postgresPassword: string,
        postgresHost: string,
        postgresPort: number
    ) {
        const newConnection: Sequelize = new Sequelize(postgresDB, postgresUsername, postgresPassword, {
            host: postgresHost,
            port: postgresPort,
            dialect: 'postgres'
        });
        const { password, ...connectionDetails } = newConnection.config;
        console.log(connectionDetails);
        console.log(`Sequelize connection established with DB ${postgresDB}`);
        return newConnection;
    }

    static getInstance(
        postgresDB: string,
        postgresUsername: string,
        postgresPassword: string,
        postgresHost: string,
        postgresPort: number
    ) {
        if (!SequelizeConnection.instance) {
            SequelizeConnection.instance = {};
        }
        if (!SequelizeConnection.instance?.[postgresDB]) {
            SequelizeConnection.instance[postgresDB] = new SequelizeConnection().init(
                postgresDB,
                postgresUsername,
                postgresPassword,
                postgresHost,
                postgresPort
            )
        }
        return SequelizeConnection.instance[postgresDB]
    }

    async authenticate(postgresDB: string) {
        try {
            await SequelizeConnection.instance?.[postgresDB]?.authenticate();
            console.log("Connection has been established successfully");
        } catch (error) {
            console.log(`Unable to connect to the dataset ${error}`);
        }
    }
}