require('dotenv').config();

const { embedArticle } = require('./modules/embed');
const findScp = require('./modules/find');
const { scrapeArticle } = require('./modules/scrape');

// scrapeArticle('The Executions of Doctor Bright').then((res) => {
// 	console.log(res);
// });

const discord = require('discord.js');
const client = new discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', (message) => {
	if (!message.content.startsWith(process.env.COMMAND_PREFIX)) return;

	let args = message.content.split(' ');
	let command = args
		.shift()
		.replace(process.env.COMMAND_PREFIX, '')
		.toLowerCase();

	if (command === 'article') {
		message.channel.startTyping();

		scrapeArticle(args.join(' ')).then((res) => {
			message.channel.send(embedArticle(res));
			message.channel.stopTyping();
		});
	}
});

client.login(process.env.DISCORD_TOKEN);
