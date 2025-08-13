// server/controllers/climateController.js

const { climate_data } = require('../models');

exports.getAllClimateData = async (req, res) => {
  try {
    const data = await climate_data.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch climate data', error: err.message });
  }
};

exports.createClimateData = async (req, res) => {
  try {
    const newRecord = await climate_data.create(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create climate data', error: err.message });
  }
};

exports.updateClimateData = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await climate_data.update(req.body, { where: { id } });

    if (!updated) return res.status(404).json({ message: 'Climate data not found' });

    const updatedData = await climate_data.findByPk(id);
    res.json(updatedData);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update climate data', error: err.message });
  }
};

exports.deleteClimateData = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await climate_data.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'Climate data not found' });

    res.json({ message: 'Climate data deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete climate data', error: err.message });
  }
};
