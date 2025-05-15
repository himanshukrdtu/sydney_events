const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  link: String,
  category: String,
  location: String,
  date: String,
  image_url: String,
});

module.exports = mongoose.model('Event', eventSchema);
