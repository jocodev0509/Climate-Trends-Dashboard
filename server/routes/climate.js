// server/routes/climate.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const climateController = require('../controllers/climateController');

// Authenticated route - any logged-in user
router.get('/', authenticate, climateController.getAllClimateData);

// Admin-only routes
router.post('/', authenticate, authorizeAdmin, climateController.createClimateData);
router.put('/:id', authenticate, authorizeAdmin, climateController.updateClimateData);
router.delete('/:id', authenticate, authorizeAdmin, climateController.deleteClimateData);

module.exports = router;
