require('dotenv').config();

const { Client, MessageEmbed } = require('discord.js');
const client = new Client();

const findScps = require('./modules/find.js');
const { scps } = require('./modules/scrape.js');

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', (message) => {
	let scps = findScps(message.content);
	if (scps) {
		scps(scps).then((c) => {
			const embed = new MessageEmbed()
				.setColor('#c71f1f')
				.setDescription(c.join('\n'));
			message.channel.send(embed);
		});
	}
});

client.login(process.env.DISCORD_TOKEN);
