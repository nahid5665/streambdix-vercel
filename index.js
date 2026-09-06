const { addonBuilder, getRouter } = require('stremio-addon-sdk');
const axios = require('axios');
const cheerio = require('cheerio');

const manifest = {
    id: 'org.streambdix.vercel',
    version: '1.0.0',
    name: 'StreamBDIX Dynamic',
    description: 'Dynamic BDIX Stream Addon for Stremio',
    types: ['movie'],
    idPrefixes: ['tt'],
    resources: ['stream']
};

const builder = new addonBuilder(manifest);

async function searchFTP(query) {
    try {
        const ftpUrl = `http://index.circleftp.net/FILE/English%20Movies/`;
        const response = await axios.get(ftpUrl, { timeout: 5000 });
        const $ = cheerio.load(response.data);
        
        let matchUrl = null;
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.toLowerCase().includes(query.toLowerCase())) {
                matchUrl = ftpUrl + href;
                return false;
            }
        });
        return matchUrl;
    } catch (err) {
        console.error("FTP Search Error:", err.message);
        return null;
    }
}

builder.defineStreamHandler(async ({ type, id }) => {
    if (type === 'movie') {
        const sampleQuery = "Pianist";
        const streamUrl = await searchFTP(sampleQuery);

        if (streamUrl) {
            return {
                streams: [
                    {
                        title: `⚡ BDIX High-Speed Stream`,
                        url: streamUrl
                    }
                ]
            };
        }
    }
    return { streams: [] };
});

const router = getRouter(builder.getInterface());

module.exports = function (req, res) {
    router(req, res, function () {
        res.statusCode = 404;
        res.end();
    });
};
