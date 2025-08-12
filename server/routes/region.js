const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');

// GET /api/regions
router.get('/', regionController.getAllRegions);

// GET /api/regions/:id
router.get('/:id', regionController.getRegionById);

// POST /api/regions
router.post('/', regionController.createRegion);

// PUT /api/regions/:id
router.put('/:id', regionController.updateRegion);

// DELETE /api/regions/:id
router.delete('/:id', regionController.deleteRegion);

module.exports = router;
 