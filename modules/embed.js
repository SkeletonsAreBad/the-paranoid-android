const { COMMAND_PREFIX, EMBED_COLOR } = process.env;

module.exports.embedHelpCommand = (input) => {
	return {
		color: EMBED_COLOR,
		title: `Help: ${input.name}`,
		description: input.description,
		fields: [
			{ name: 'Usage', value: `\`${input.usage}\``, inline: true },
			{ name: 'Cooldown', value: input.cooldown, inline: true },
		],
	};
};

module.exports.embedHelpFull = (input) => {
	return {
		color: EMBED_COLOR,
		title: 'Help',
		description: `Here's a list of commands that the bot can use.\nRun \`${COMMAND_PREFIX}help [command]\` for command usage.\n\n${input.commands}`,
		fields: [
			{
				name: 'Support',
				value: `For bug reports and feature suggestions join the [Support Server](${process.env.SERVER_INVITE})`,
				inline: false,
			},
		],
	};
};

module.exports.embedInfo = async (client) => {
	const owner = await client.users.fetch('100422004812816384');
	const guilds = await client.guilds.cache;
	const djsversion = require('../package.json').dependencies[
		'discord.js'
	].replace('^', 'v');

	return {
		color: EMBED_COLOR,
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

module.exports.embedArticle = (input) => {
	return {
		color: EMBED_COLOR,
		title: input.title,
		url: `http://scp-wiki.net/${input.slug}`,
		description: `${input.breadcrumbs}\n${input.preview}`,
		thumbnail: {
			url:
				'http://www.scp-wiki.net/local--files/component:theme/logo.png',
		},
		footer: {
			text: input.pageInfo,
		},
	};
};

module.exports.embedInline = (input) => {
	return { color: EMBED_COLOR, description: input.join('\n') };
};

module.exports.embed001 = (input) => {
	const half = Math.floor(input.length / 2);

	return [
		{
			color: EMBED_COLOR,
			title:
				'THE FOLLOWING FILES HAVE BEEN CLASSIFIED TOP SECRET BY ORDER OF THE ADMINISTRATOR',
			url: 'http://scp-wiki.net/scp-001',
			description:
				'**GENERAL NOTICE 001-Alpha:** In order to prevent knowledge of SCP-001 from being leaked, several/no false SCP-001 files have been created alongside the true file/files. All files concerning the nature of SCP-001, including the decoy/decoys, are protected by a memetic kill agent designed to immediately cause cardiac arrest in any nonauthorized personnel attempting to access the file. Revealing the true nature/natures of SCP-001 to the general public is cause for execution, except as required under ████-███-██████.\n\n**WARNING:**\nANY NON-AUTHORIZED PERSONNEL ACCESSING THIS FILE WILL BE IMMEDIATELY TERMINATED THROUGH **BERRYMAN-LANGFORD** MEMETIC KILL AGENT. SCROLLING DOWN WITHOUT PROPER MEMETIC INOCULATION WILL RESULT IN IMMEDIATE CARDIAC ARREST FOLLOWED BY DEATH.\n**YOU HAVE BEEN WARNED.**',
			image: {
				url:
					'http://scp-wiki.wdfiles.com/local--resized-images/scp-001/fractal001/medium.jpg',
			},
		},
		{
			color: EMBED_COLOR,
			description: `**MEMETIC KILL AGENT ACTIVATED\nCONTINUED LIFE SIGNS CONFIRMED\nREMOVING SAFETY INTERLOCKS**\nWelcome, authorized personnel. Please select your desired file.\n\n ${input
				.slice(0, half)
				.join('\n')}`,
		},
		{
			color: EMBED_COLOR,
			description: input.slice(half, input.length).join('\n'),
		},
	];
};

module.exports.embedMtfInfo = (input) => {
	return {
		color: EMBED_COLOR,
		title: input.title,
		url: `http://scp-wiki.net/task-forces#${input.url}`,
		description: `**Task Force Mission:** ${input.mission}`,
		thumbnail: {
			url: input.logoUrl,
		},
	};
};

module.exports.embedMtfFull = (input) => {
	const half = Math.floor(input.length / 2);

	return {
		color: EMBED_COLOR,
		title: 'Mobile Task Forces',
		url: 'http://scp-wiki.net/task-forces',
		description:
			'Mobile Task Forces (MTFs) are elite units comprised of personnel drawn from across the Foundation and are mobilized to deal with specific threats or situations that sometimes exceed the operational capacity or expertise of regular field personnel and — as their name suggests — may be relocated between facilities or locations as they are needed. Mobile Task Force personnel represent the "best of the best" of the Foundation.',
		fields: [
			{
				name: 'Task Forces (1/2)',
				value: input.slice(0, half),
				inline: true,
			},
			{
				name: 'Task Forces (2/2)',
				value: input.slice(half, input.length),
				inline: true,
			},
		],
		footer: {
			text: 'For MTF info run: ./mtf [code]',
		},
	};
};

module.exports.embedGoiInfo = (input) => {
	return {
		color: EMBED_COLOR,
		title: input.title,
		url: input.url,
		description: `**Overview:** ${input.overview}`,
		thumbnail: {
			url: input.logoUrl,
		},
	};
};

module.exports.embedGoiFull = (input) => {
	const half = Math.floor(input.length / 2);

	return {
		color: EMBED_COLOR,
		title: 'Groups Of Interest',
		url: 'http://scp-wiki.net/groups-of-interest',
		description:
			'The Foundation is not the only group with an interest and investment in the paranormal and metaphysical. There are many other groups in existence who possess, use, or attempt to create SCP objects, either for their own personal gain or for the protection of mankind. Some are rival organizations, some are splinter groups of the Foundation, and some are trusted associates of the Foundation. In any case, it has been deemed necessary to create and distribute a brief on what agencies the Foundation knows about, and our stance towards them.',
		fields: [
			{
				name: 'Groups (1/2)',
				value: input.slice(0, half),
				inline: true,
			},
			{
				name: 'Groups (2/2)',
				value: input.slice(half, input.length),
				inline: true,
			},
		],
		footer: {
			text: 'For GOI info run: ./goi [name]',
		},
	};
};
