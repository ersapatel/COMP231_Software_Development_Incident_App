import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import config from './config/config.js';
import incidentRoutes from "./server/routes/incidentRoutes.js";
import userRoutes from "./server/routes/userRoutes.js";
import authRoutes from './server/routes/authRoutes.js';


const app = express();
const PORT = config.port || 3000;

// Enable CORS for all origins
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);

// Default Message
app.get('/', (req, res) => {
    res.send({ message: 'Welcome to Code Crafters App'});
});

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB:', config.mongoUri);
  })
  .catch((err) => {
    console.error('Mongo connection error:', err.message);
  });


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
