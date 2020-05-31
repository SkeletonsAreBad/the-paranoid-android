const { MessageEmbed } = require('discord.js');

module.exports.embedArticle = (data) => {
	return new MessageEmbed()
		.setColor(process.env.EMBED_COLOR)
		.setTitle(data.title)
		.setURL(`http://scp-wiki.net/${data.slug}`)
		.setDescription(`${data.breadcrumbs}\n${data.preview}`)
		.setFooter(data.pageInfo)
		.setThumbnail(
			'http://www.scp-wiki.net/local--files/component:theme/logo.png'
		);
};

module.exports.embedInline = (input) => {
	return new MessageEmbed()
		.setColor(process.env.EMBED_COLOR)
		.setDescription(input);
};
