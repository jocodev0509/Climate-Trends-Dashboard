'use strict';

const REGION_IDS = [1, 2, 3, 4, 5, 6]; // Assuming these region IDs exist

module.exports = {
  async up(queryInterface, Sequelize) {
    const climateData = [];

    const startYear = 2000;
    const endYear = 2024;

    REGION_IDS.forEach(region_id => {
      let temp = 12 + Math.random() * 10; // base temp per region
      let co2 = 360 + Math.random() * 20; // base CO₂ per region
      let precip = 800 + Math.random() * 200; // base precipitation per region

      for (let year = startYear; year <= endYear; year++) {
        // Slight natural variation per year
        temp += (Math.random() - 0.5) * 0.3;
        co2 += (Math.random() - 0.4) * 1.5;
        precip += (Math.random() - 0.5) * 10;

        climateData.push({
          year,
          region_id,
          avg_temp: parseFloat(temp.toFixed(1)),
          co2_level: parseFloat(co2.toFixed(1)),
          precipitation: parseFloat(precip.toFixed(1)),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    await queryInterface.bulkInsert('climate_data', climateData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('climate_data', null, {});
  }
};
