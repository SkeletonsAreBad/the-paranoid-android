const { embedArticle } = require('../modules/embed');
const { scrapeArticle } = require('../modules/scrape');

module.exports = {
	name: 'article',
	description: 'Get information about an article from the SCP Wiki',
	args: true,
	usage: '[slug]',
	cooldown: 5,
	execute(message, args) {
		message.channel.startTyping();

		const slug = args.join(' ');

		scrapeArticle(slug).then((res) => {
			message.channel.send(embedArticle(res));
			message.channel.stopTyping();
		});
	},
};