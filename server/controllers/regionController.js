const { regions } = require('../models');

// Get all regions
exports.getAllRegions = async (req, res) => {
  try {
    const regions = await Region.findAll();
    res.status(200).json(regions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get region by ID
exports.getRegionById = async (req, res) => {
  try {
    const region = await Region.findByPk(req.params.id);
    if (!region) return res.status(404).json({ message: 'Region not found' });
    res.status(200).json(region);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new region
exports.createRegion = async (req, res) => {
  try {
    const { name } = req.body;
    const region = await regions.create({ name });
    res.status(201).json(region);
  } catch (error) {
    console.error('Error creating region:', error);
    res.status(500).json({ message: 'Failed to create region' });
  }
};

// Update region
exports.updateRegion = async (req, res) => {
  try {
    const region = await Region.findByPk(req.params.id);
    if (!region) return res.status(404).json({ message: 'Region not found' });

    region.name = req.body.name || region.name;
    await region.save();
    res.status(200).json(region);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete region
exports.deleteRegion = async (req, res) => {
  try {
    const region = await Region.findByPk(req.params.id);
    if (!region) return res.status(404).json({ message: 'Region not found' });

    await region.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
