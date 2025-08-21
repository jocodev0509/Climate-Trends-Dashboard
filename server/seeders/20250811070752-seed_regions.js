'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Delete all existing rows (reset)
    await queryInterface.bulkDelete('regions', null, {});

    // Insert new regions
    const regions = [
      { name: 'North America', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Europe', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Asia', createdAt: new Date(), updatedAt: new Date() },
      { name: 'South America', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Africa', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Oceania', createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert('regions', regions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('regions', null, {});
  }
};
