import dotenv from 'dotenv';

dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'YOUR_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codecrafters',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
};

export default config;