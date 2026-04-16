const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(require('./middleware/formatResponse'));

// Routes (to be defined later)
app.use(express.static('public'));
app.get('/api-docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
// app.use('/comments', require('./routes/comments'));
// app.use('/likes', require('./routes/likes'));
// app.use('/followers', require('./routes/followers'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Social Media API' });
});

// Error handler middleware (to be defined later)
app.use(require('./middleware/errorHandler'));
app.use(require('./middleware/formatResponse'));
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in development mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
