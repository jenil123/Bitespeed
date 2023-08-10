import { Sequelize } from 'sequelize';

import config from '../config';
import Contact from './contact.model';

import SequelizeConnection from '../postgres';

const sequelizeConnection: Sequelize = SequelizeConnection.getInstance(
    config.POSTGRES_DB,
    config.POSTGRES_USERNAME,
    config.POSTGRES_PASSWORD,
    config.POSTGRES_HOST,
    config.POSTGRES_PORT,
);

const isDBToBeAltered = true;
const isDBToBeForced = true;

const initializeDB = async () => {
    try {
        await sequelizeConnection.sync({ alter: isDBToBeAltered, force: isDBToBeForced });
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export { Contact };

export default initializeDB;