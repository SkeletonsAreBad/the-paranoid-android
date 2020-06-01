const { embedMtfInfo, embedMtfFull } = require('../modules/embed');
const { scrapeMtfInfo, scrapeMtfFull } = require('../modules/scrape');

String.prototype.toProperCase = function () {
	return this.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

module.exports = {
	name: 'mtf',
	description: 'Get information about a Mobile Task Force.',
	usage: '[code]',
	execute(message, args) {
		if (args[0] && args[0].match(/\w+-\d+/gi)) {
			message.channel.startTyping();

			scrapeMtfInfo(args[0].toProperCase()).then((res) => {
				if (res) message.channel.send({ embed: embedMtfInfo(res) });
				else
					message.channel.send(
						`\`${args[0]}\` is not a valid article.`
					);

				message.channel.stopTyping();
			});
		} else {
			scrapeMtfFull().then((res) => {
				message.author
					.send({ embed: embedMtfFull(res) })
					.then(() => {
						if (message.channel.type === 'dm') return;
						message.reply(
							"I've sent you a DM with all the Mobile Task Forces."
						);
					})
					.catch((err) => {
						message.client.logger.log(
							'error',
							`Could not send an MTF DM to ${message.author.tag}.`
						);
						message.reply(
							"It looks like I can't DM you. Do you have DMs disabled?"
						);
					});
			});
		}
	},
};
