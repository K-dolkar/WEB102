require('dotenv').config();

const express = require('express');

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

const app = express();

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/', protectedRoutes);

// Port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  console.log('\nAvailable endpoints:');
  console.log('  POST /auth/register');
  console.log('  POST /auth/login');
  console.log('  GET  /profile');
  console.log('  GET  /auth/users');
});