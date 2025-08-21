'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('climate_data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      year: {
        type: Sequelize.INTEGER
      },
      region_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'regions',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      avg_temp: {
        type: Sequelize.FLOAT
      },
      co2_level: {
        type: Sequelize.FLOAT
      },
      precipitation: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('climate_data');
  }
};