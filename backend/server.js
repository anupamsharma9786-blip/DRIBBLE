import dotenv from 'dotenv';
import app from './src/app.js';
import connectDatabase from './src/config/database.js';
import http from "http"
import { initSocket } from './src/sockets/server.socket.js';

dotenv.config();

const PORT = process.env.PORT;

const httpServer = http.createServer(app)

initSocket(httpServer)

try {
  await connectDatabase();
} catch (error) {
  console.error('Server started, but MongoDB connection failed:', error.message);
}

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

