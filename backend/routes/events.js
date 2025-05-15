const express = require('express');
const router = express.Router();
const Event = require('../models/events.js');
const scrapeEvents = require('../scraper.js');

router.get('/events', async (req, res) => {
    
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/scrape', async (req, res) => {

   
  try {
    await scrapeEvents();
    res.json({ message: 'Scraping done and data saved to MongoDB' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

module.exports = router;
