import { Sequelize } from 'sequelize';
import {
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
} from "@config/index";


const sequelize = new Sequelize({
    dialect: 'mysql', // or any other supported database dialect
    host: 'localhost',
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    logging: true,

});

export { sequelize };