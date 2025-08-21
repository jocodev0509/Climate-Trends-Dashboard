// server/controllers/climateController.js

const { climate_data, regions } = require('../models');

exports.getAllClimateData = async (req, res) => {
  try {
    const results = await climate_data.findAll({
      attributes: ['id', 'year', 'avg_temp', 'co2_level', 'precipitation', 'createdAt', 'updatedAt'],
      include: [{
        model: regions,
        as: 'region',
        attributes: ['name'],  // Only fetch region name
      }],
      order: [['id', 'ASC']], // Sort by id in ascending order
    });

    const formatted = results.map(item => {
      const plain = item.get({ plain: true });
      return {
        ...plain,
        region: plain.region.name,  // Flatten region object
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch climate data', error: err.message });
  }
};


exports.createClimateData = async (req, res) => {
  try {
    const newRecord = await climate_data.create(req.body);

    const include = [
      {
        model: regions,
        as: "region",
        attributes: ["name"], // Only fetch region name
      },
    ];

    const result = await climate_data.findByPk(newRecord.id, { include });

    // Flatten the region object like your findAll example
    const formatted = result
      ? {
        ...result.get({ plain: true }),
        region: result.region?.name, // flatten region
      }
      : null;

    res.status(201).json(formatted);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create climate data', error: err.message });
  }
};

exports.updateClimateData = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(req.body);

    const [updated] = await climate_data.update(req.body, { where: { id } });
    console.log(updated);
    
    if (!updated) return res.status(404).json({ message: 'Climate data not found' });

    const result = await climate_data.findByPk(id, {
      include: [
        {
          model: regions,
          as: "region",
          attributes: ["id", "name"], // include id here
        },
      ],
    });

    const formatted = {
      ...result.get({ plain: true }),
      region_id: result.region.id,
      region: result.region.name,
    };

    res.json(formatted);
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
