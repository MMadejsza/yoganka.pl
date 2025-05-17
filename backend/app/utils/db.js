import dotenv from 'dotenv';
import Sequelize from 'sequelize';
dotenv.config({ path: '../.env' });

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);
export default db;
