const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

async function runScraper() {
    try {
        const ftpUrl = 'http://index.circleftp.net/FILE/English%20Movies/';
        // Increased timeout to 30 seconds
        const response = await axios.get(ftpUrl, { timeout: 30000 });
        const $ = cheerio.load(response.data);
        
        let results = [];
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            const title = $(el).text();
            if (href && href.endsWith('.mp4')) {
                results.push({
                    id: 'tt' + Math.floor(1000000 + Math.random() * 9000000),
                    title: title.trim(),
                    url: ftpUrl + href
                });
            }
        });

        if (results.length > 0) {
            const filePath = path.join(__dirname, 'database.json');
            fs.writeFileSync(filePath, JSON.stringify(results.slice(0, 50), null, 2));
            console.log(`Successfully updated database.json with ${results.length} entries.`);
        } else {
            console.log('Page loaded, but no .mp4 links matched.');
        }
    } catch (err) {
        console.error('Scraping failed:', err.message);
    }
}

runScraper();
