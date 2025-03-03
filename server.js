const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from config.env
dotenv.config({ path: './config.env' });

// Check if DATABASE is loaded correctly
if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  console.error('DATABASE_URL or DATABASE_PASSWORD is missing in the .env file!');
  process.exit(1);
}


// Handling uncaught exceptions
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

// Setup MongoDB connection
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch(err => {
    console.log('DB connection failed:', err.message);
    process.exit(1);
  });

// Start the server
const port = process.env.PORT || 3000;
const app = require('./app');  // Ensure that your app module is correctly required
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
