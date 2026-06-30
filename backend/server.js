import dotenv from 'dotenv';
import app from './src/app.js';
import connectDatabase from './src/config/database.js';

dotenv.config();

const PORT = process.env.PORT ;

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  try {
    await connectDatabase();
  } catch (error) {
    console.error('Server started, but MongoDB connection failed:', error.message);
  }
};

startServer();
