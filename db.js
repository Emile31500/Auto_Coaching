const Sequelize = require('sequelize');
const process = require('process');
const config = require('./config/config.json');

const env = process.env.NODE_ENV;

try {
  const dbConfig = config[env];

  const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
} catch (error) {

  console.log(error.message)
  console.log(error)


}

module.exports = sequelize;
