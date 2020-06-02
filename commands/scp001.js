const { embed001 } = require('../modules/embed');
const { scrape001 } = require('../modules/scrape');

module.exports = {
	name: 'scp001',
	description:
		"Get a list of all of the SCP-001 proposals. Don't enter without memetic inoculation.",
	execute(message, args) {
		scrape001().then((res) => {
			const emb = embed001(res);

			message.author
				.send({ embed: emb[0] })
				.then(() => {
					message.author
						.send({ embed: emb[1] })
						.then(() => message.author.send({ embed: emb[2] }));

					if (message.channel.type === 'dm') return;
					message.reply(
						"I've sent you a DM with all the SCP-001 information."
					);
				})
				.catch((err) => {
					message.client.logger.log(
						'error',
						`Could not send an SCP-001 DM to ${message.author.id}`
					);
					message.reply(
						"It looks like I can't DM you. Do you have DMs disabled?"
					);
				});
		});
	},
};
