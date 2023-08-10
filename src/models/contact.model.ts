import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

import config from '../config';
import SequelizeConnection from '../postgres';

const sequelizeConnection: Sequelize = SequelizeConnection.getInstance(
    config.POSTGRES_DB,
    config.POSTGRES_USERNAME,
    config.POSTGRES_PASSWORD,
    config.POSTGRES_HOST,
    config.POSTGRES_PORT,
);

export enum LinkPrecedence {
    PRIMARY = "primary",
    SECONDARY = "secondary"
}

interface ContactAttributes {
    id?: number;
    phoneNumber: string;
    email: string;
    linkedId: number;
    linkPrecedence: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface ContactInput extends Optional<ContactAttributes, 'email' | 'phoneNumber' | 'linkedId' | 'deletedAt'> { };

class Contact extends Model<ContactAttributes, ContactInput> implements ContactAttributes {
    public id!: number;

    public phoneNumber!: string;

    public email!: string;

    public linkedId!: number;

    public linkPrecedence!: string;

    // timestamps
    public readonly createdAt!: Date;

    public readonly updatedAt!: Date;

    public readonly deletedAt!: Date;
};

Contact.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
            }
        },
        linkedId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        linkPrecedence: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: {
                    args: [Object.values(LinkPrecedence)],
                    msg: "Invalid link preference",
                }
            }
        }
    },
    {
        timestamps: true,
        sequelize: sequelizeConnection,
        paranoid: true,
        tableName: "Contact",
        modelName: "Contact",
        freezeTableName: true,
        defaultScope: {
            paranoid: true,
            attributes: { exclude: ["deletedAt"] },
        },
    },
);

Contact.addScope("withoutDeletedAt", () => ({
    attributes: { exclude: ["deletedAt"] },
}));

export default Contact;