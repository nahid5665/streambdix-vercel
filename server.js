const { addonBuilder } = require('stremio-addon-sdk');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const manifest = require('./addon.json');
const builder = new addonBuilder(manifest);

// Load the static database file once on boot
const dbPath = path.join(__dirname, 'database.json');
let database = [];
try {
  if (fs.existsSync(dbPath)) {
    database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }
} catch (e) {
  console.log("Database load error:", e);
}

builder.defineStreamHandler(async ({ type, id }) => {
  if (type === 'movie') {
    const match = database.find(item => item.id === id);
    if (match) {
      return {
        streams: [
          {
            title: `⚡ BDIX High-Speed\n📂 ${match.title}`,
            url: match.url
          }
        ]
      };
    }
  }
  return { streams: [] };
});

module.exports = builder.getInterface();