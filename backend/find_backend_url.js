const axios = require('axios');

async function run() {
    try {
        console.log('Fetching JS bundle...');
        const response = await axios.get('https://axiora-psi.vercel.app/assets/index-DyX4Z33l.js');
        const code = response.data;
        
        console.log('Scanning for all URLs...');
        const regex = /https?:\/\/[a-zA-Z0-9.-]+(?::[0-9]+)?(?:\/[a-zA-Z0-9_.-]+)*/g;
        const matches = code.match(regex);
        if (matches) {
            const uniqueMatches = [...new Set(matches)];
            console.log('Found URLs:', uniqueMatches);
        } else {
            console.log('No URLs found!');
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

run();
