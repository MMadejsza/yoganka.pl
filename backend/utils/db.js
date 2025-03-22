import Sequelize from 'sequelize';

const db = new Sequelize('yoganka', 'admin1', 'admin1', {
  dialect: 'mysql',
  host: 'localhost',
});
export default db;
