// server/controllers/userController.js
const { users } = require('../models');

// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const userlist = await users.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt', 'is_active'],
    });
    res.json(userlist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// PUT /api/users/:id/role
exports.updateUserRole = async (req, res) => {

  const userId = req.params.id;
  const { role } = req.body;

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Role must be admin or user' });
  }

  try {
    const user = await users.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = role;
    await user.save();
    res.json({ message: 'User role updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role' });
  }
};

// PUT /api/users/:id/deactive
exports.deactiveUser = async (req, res) => {

  const userId = req.params.id;

  try {
    const user = await users.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.is_active = false;
    await user.save();
    res.json({ message: 'User role updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role' });
  }
}