require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌  JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

// Connect to MongoDB then start the server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅  Connected to MongoDB');
    const server = app.listen(PORT, () => {
      console.log(`🚀  DealBridge API running on http://localhost:${PORT}`);
      console.log(`📋  Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\n${signal} received. Closing server...`);
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed. Process exiting.');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });
