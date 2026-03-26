import dotenv from 'dotenv';

dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'YOUR_secret_key',
    mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codecrafters'
};

export default config;
