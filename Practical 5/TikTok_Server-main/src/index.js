require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 8000;

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});


