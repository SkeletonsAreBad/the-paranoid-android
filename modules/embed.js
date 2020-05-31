module.exports.embedInfo = async (client) => {
	const owner = await client.users.fetch('100422004812816384');
	const guilds = await client.guilds.cache;
	const djsversion = require('../package.json').dependencies[
		'discord.js'
	].replace('^', 'v');

	return {
		color: process.env.EMBED_COLOR,
		title: client.user.username,
		url: 'https://marv.skel.cc',
		author: {
			name: owner.tag,
			icon_url: owner.avatarURL(),
			url: 'https://skel.cc',
		},
		description: process.env.npm_package_description,
		thumbnail: {
			url: client.user.avatarURL(),
		},
		fields: [
			{ name: 'Node Version', value: process.version, inline: true },
			{ name: 'discord.js Version', value: djsversion, inline: true },
			{ name: 'Guilds', value: guilds.size, inline: true },
			{
				name: 'Bot Invite',
				value: `To add the bot to your server [Invite ${client.user.username}](${process.env.BOT_INVITE})`,
				inline: false,
			},
			{
				name: 'Support',
				value: `For bug reports and feature suggestions join the [Support Server](${process.env.SERVER_INVITE})`,
				inline: false,
			},
		],
		footer: {
			text: `${client.user.username} | A bot by ${owner.tag}`,
		},
	};
};

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
