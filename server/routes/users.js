// server/routes/users.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const userController = require('../controllers/userController');

// GET /api/users
router.get('/', authenticate, authorizeAdmin, userController.getAllUsers);

// PUT /api/users/:id/role
router.put('/:id/role', authenticate, authorizeAdmin, userController.updateUserRole);

// PUT /api/users/:id/deactive
router.put('/:id/deactive', authenticate, authorizeAdmin, userController.deactiveUser);

module.exports = router;