const { embedInfo } = require('../modules/embed');

module.exports = {
	name: 'info',
	description: 'Get technical information about the paranoid android.',
	cooldown: 10,
	execute(message, args) {
		embedInfo(message.client).then((infoEmbed) =>
			message.channel.send({ embed: infoEmbed })
		);
	},
};
