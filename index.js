const Discord = require('discord.js');
const client = new Discord.Client();

const findScps = require('./modules/find.js');
const scrapeScps = require('./modules/scrape.js');

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	let scps = findScps(message.content);
	if (scps) {
		scrapeScps(scps).then(c => {
			const embed = new Discord.MessageEmbed()
				.setColor('#c71f1f')
				.setDescription(c.join('\n'));
			message.channel.send(embed);
		});
	}
});

client.login('Njk5MTY3OTA3MjU0NTAxNDU3.XpZRAw.r2dBQxL71svBd-oePIY-5SPynxk');
