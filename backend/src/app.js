const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/rides', require('./routes/rides'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;