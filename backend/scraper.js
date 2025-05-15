const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Event = require('./models/events.js');

const URL = 'https://whatson.cityofsydney.nsw.gov.au';

async function scrapeEvents() {
  
  const { data: html } = await axios.get(URL);
  const $ = cheerio.load(html);

  const cssImageMap = {};
  $('style').each((_, el) => {
    const cssText = $(el).html();
    const regex = /\.image_background\.([a-zA-Z0-9_-]+)[^{]*{[^}]*background-image:\s*url\((.*?)\)/g;
    let match;
    while ((match = regex.exec(cssText))) {
      const [, className, imgUrl] = match;
      cssImageMap[className] = imgUrl;
    }
  });

  const eventList = [];
  $('section.event_tile').each((_, el) => {
    const section = $(el);

    const title = section.find('h3.event_tile-name').text().trim() || 'N/A';
    const href = section.find('h3.event_tile-name a').attr('href');
    const link = href ? `${URL}${href}` : 'N/A';
    const category = section.find('div.event_tile-category').text().trim() || 'N/A';
    const location = section.find('div.event_card_location').text().trim() || 'N/A';
    const date = section.find('footer.event_tile-footer').text().trim() || 'N/A';

    let image_url = 'N/A';
    const imageDiv = section.find('div.image_background');
    const imageClass = imageDiv.attr('class')?.split(' ').find(c => c.startsWith('jsx-'));
    if (imageClass && cssImageMap[imageClass]) {
      image_url = cssImageMap[imageClass].replace('h_20,w_20', 'h_300,w_300');
    }

    eventList.push({ title, link, category, location, date, image_url });
  });

  // Optional: Clear old data
  await Event.deleteMany({});

  // Save new events
  await Event.insertMany(eventList);

  console.log(`✅ Scraped and saved ${eventList.length} events to MongoDB`);
}

module.exports = scrapeEvents;
