require('dotenv').config();

const findScp = require('./modules/find');
const { scrapeScp } = require('./modules/scrape');

console.log(findScp('Yoooo scp 5000 and scp____420-j is sooo coool bro'));

// scrapeScp('SCP-173');

// const discord = require('discord.js');
// const client = new discord.Client();

// client.once('ready', () => {
// 	console.log('Ready!');
// });

// client.on('message', (message) => {});

// client.login(process.env.DISCORD_TOKEN);
