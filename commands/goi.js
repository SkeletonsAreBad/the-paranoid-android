const { embedGoiInfo, embedGoiFull } = require('../modules/embed');
const { scrapeGoiInfo, scrapeGoiFull } = require('../modules/scrape');

String.prototype.toProperCase = function () {
	return this.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

module.exports = {
	name: 'goi',
	description: 'Get information about a Group Of Interest.',
	usage: '[name]',
	execute(message, args) {
		if (args[0]) {
			message.channel.startTyping();

			scrapeGoiInfo(args.join(' ').toProperCase()).then((res) => {
				if (res) message.channel.send({ embed: embedGoiInfo(res) });
				else
					message.channel.send(
						`\`${args[0]}\` is not a valid Group Of Interest.`
					);

				message.channel.stopTyping();
			});
		} else {
			scrapeGoiFull().then((res) => {
				message.author
					.send({ embed: embedGoiFull(res) })
					.then(() => {
						if (message.channel.type === 'dm') return;
						message.reply(
							"I've sent you a DM with all the Groups Of Interest."
						);
					})
					.catch((err) => {
						message.client.logger.log(
							'error',
							`Could not send a GOI DM to ${message.author.id}`
						);
						message.reply(
							"It looks like I can't DM you. Do you have DMs disabled?"
						);
					});
			});
		}
	},
};
