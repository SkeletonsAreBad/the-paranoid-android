require('dotenv').config();

const {
	DISCORD_TOKEN,
	DEBUG_ENABLE,
	LOG_DIRECTORY,
	COMMAND_PREFIX,
} = process.env;

const { embedInline } = require('./modules/embed');
const findScps = require('./modules/find');
const { scrapeScps } = require('./modules/scrape');

const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const logFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} [${level.toUpperCase()}] ${message}`;
});
if (DEBUG_ENABLE == 'false')
	client.logger = createLogger({
		transports: [
			new transports.Console(),
			new transports.File({
				filename: `${LOG_DIRECTORY}/${Date.now().toString()}.log`,
			}),
		],
		format: combine(timestamp(), logFormat),
	});
else
	client.logger = createLogger({
		transports: [new transports.Console()],
		format: combine(timestamp(), logFormat),
	});

client.commands = new Discord.Collection();

const cooldowns = new Discord.Collection();

const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

client.once('ready', () => {
	client.logger.log('info', `Ready, logged in as "${client.user.tag}"`);

	client.user.setActivity('the SCP Wiki | ./help', {
		type: 'WATCHING',
	});
});

client.on('debug', (m) => client.logger.log('debug', m));
client.on('warn', (m) => client.logger.log('warn', m));
client.on('error', (m) => client.logger.log('error', m));
process.on('uncaughtException', (error) => client.logger.log('error', error));

client.on('guildCreate', (guild) => {
	guild.me.setNickname('Marv', "Hello! It's me Marv!");

	let message = `Hi, I'm ${client.user.username} (prefix \`${COMMAND_PREFIX}\`).\nI'm here to help you with viewing your favourite SCP items, tales and more. To see what I can do try \`${COMMAND_PREFIX}help\`, \`${COMMAND_PREFIX}info\`, or type <@!${client.user.id}>. I'll also keep an eye out for when you mention an SCP and try to link to it, but if you don't like that you can do \`${COMMAND_PREFIX}ignore\`.\nFor more info check https://marv.skel.cc`;
	guild.systemChannel.send(message);

	client.logger.log('info', `Joined Guild ${guild.id}`);
});

client.on('guildDelete', (guild) =>
	client.logger.log('info', `Removed from Guild ${guild.id}`)
);

client.on('message', (message) => {
	if (message.author.bot) return;

	if (!message.content.startsWith(COMMAND_PREFIX)) {
		if (message.content === `<@!${client.user.id}>`)
			return client.commands.get('info').execute(message, []);

		const scps = findScps(message.content);

		if (!scps) return;

		message.channel.startTyping();

		scrapeScps(scps).then((scpList) => {
			message.channel.send({ embed: embedInline(scpList) });
			message.channel.stopTyping();

			if (message.channel.type == 'text') {
				client.logger.log(
					'info',
					`${message.author.id} scraped "${scps.join(', ')}" in ${
						message.guild.id
					}/${message.channel.id}`
				);
			} else {
				client.logger.log(
					'info',
					`${message.author.id} scraped "${scps.join(', ')}" in DM`
				);
			}
			return;
		});
	}

	const args = message.content.slice(COMMAND_PREFIX.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	if (command.guildOnly && message.channel.type !== 'text')
		return message.channel.send(
			`${command.name} can only be used in a guild.`
		);

	if (command.args && !args.length) {
		let reply = `Invalid arguements for ${command.name}.`;

		if (command.usage)
			reply += `\nTry \`${COMMAND_PREIFX}${command.name} ${command.usage}\``;

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name))
		cooldowns.set(command.name, new Discord.Collection());

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 1) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime =
			timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.channel.send(
				`Please wait ${timeLeft.toFixed(1)} seconds before using ${
					command.name
				} again.`
			);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
		if (message.channel.type == 'text') {
			client.logger.log(
				'info',
				`${message.author.id} executed "${COMMAND_PREFIX}${commandName} ${args}" in ${message.guild.id}/${message.channel.id}`
			);
		} else {
			client.logger.log(
				'info',
				`${message.author.id} executed "${COMMAND_PREFIX}${commandName} ${args}" in DM`
			);
		}
	} catch (error) {
		client.logger.log('error', error);
	}
});

client.login(DISCORD_TOKEN);
