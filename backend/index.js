const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load .env variables

const eventRoutes = require('./routes/events.js');
const subscribe = require('./routes/subscribe.js');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB using env variable
mongoose.connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log(' Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error(' MongoDB connection error:', err);
  });

app.use('/api', eventRoutes);
app.use('/api', subscribe);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
