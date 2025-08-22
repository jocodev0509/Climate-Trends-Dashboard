require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./models'); // This imports sequelize instance + models

const PORT = process.env.PORT || 5000;

app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const climateRoutes = require('./routes/climate');
const regionRoutes = require('./routes/region');
const userRoutes = require('./routes/users')

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/climate', climateRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/users', userRoutes);

// Basic health check endpoint
app.get('/', (req, res) => {
  res.send('Climate Dashboard API is running');
});

app.get('/test-db', async (req, res) => {
  try {
    const users = await db.users.findAll();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Only listen if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // export Express instance for testing