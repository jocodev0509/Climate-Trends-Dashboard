'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];
const db = {};

let sequelize;

const options = {
  ...config,
  logging: process.env.NODE_ENV === 'test' ? false : console.log, // disable SQL logs during tests
};

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], options);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, options);
}

// Import all models
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const modelFunc = require(path.join(__dirname, file));
    // Call the factory function with sequelize and DataTypes
    const model = modelFunc(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Run associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
