'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class climate_data extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // climate_data belongs to one region
      climate_data.belongsTo(models.regions, {
        foreignKey: 'region_id',   // The FK column in climate_data table
        as: 'region',              // Alias used when including region
        onDelete: 'CASCADE',       // Optional: what happens on region deletion
      });
    }
  }
  climate_data.init({
    year: DataTypes.INTEGER,
    region_id: {                 // Add the foreign key here
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'regions',
        key: 'id',
      }
    },
    avg_temp: DataTypes.FLOAT,
    co2_level: DataTypes.FLOAT,
    precipitation: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'climate_data',
    tableName: 'climate_data',   // Ensures exact table name mapping
  });
  return climate_data;
};
