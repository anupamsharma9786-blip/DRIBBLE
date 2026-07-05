import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dns from 'dns'
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';
dns.setServers(["1.1.1.1","8.8.8.8"])

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));


app.use("/api/auth",authRouter)
app.use("/api/chats",chatRouter)

export default app;
