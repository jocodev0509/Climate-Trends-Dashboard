'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class regions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // regions has many climate_data entries
      regions.hasMany(models.climate_data, {
        foreignKey: 'region_id',   // FK in climate_data table
        as: 'climateData',         // Alias for reverse relation
        onDelete: 'CASCADE',       // Optional, clean-up on region deletion
      });
    }
  }
  regions.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'regions',
    tableName: 'regions',          // Exact table name
  });
  return regions;
};
