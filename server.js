// server.js
import bookingRoutes from './api/routes/booking.js';
app.use('/api/booking', bookingRoutes);

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
const bookingRoutes = require('./api/routes/booking');
app.use('/api/booking', bookingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});