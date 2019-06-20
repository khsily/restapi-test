import Sequelize from 'sequelize';
import { dbConfig } from '../config';

const config = dbConfig();

const sequelize = new Sequelize(config.databaseName, config.id, config.password, {
  host: config.host,
  dialect: 'postgres',
});

export default sequelize;