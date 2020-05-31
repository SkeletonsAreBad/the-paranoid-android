require('dotenv').config();

const { DISCORD_TOKEN, LOG_DIRECTORY, COMMAND_PREFIX } = process.env;

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
const logger = createLogger({
	transports: [
		new transports.Console(),
		new transports.File({
			filename: `${LOG_DIRECTORY}/${Date.now().toString()}.log`,
		}),
	],
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
	logger.log('info', `Ready, logged in as "${client.user.tag}"`);

	client.user.setActivity('the SCP Wiki | ./help', {
		type: 'WATCHING',
	});
});

client.on('debug', (m) => logger.log('debug', m));
client.on('warn', (m) => logger.log('warn', m));
client.on('error', (m) => logger.log('error', m));
process.on('uncaughtException', (error) => logger.log('error', error));

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
				logger.log(
					'info',
					`${message.author.id} scraped "${scps.join(', ')}" in ${
						message.guild.id
					}/${message.channel.id}`
				);
			} else {
				logger.log(
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
			logger.log(
				'info',
				`${message.author.id} executed "${COMMAND_PREFIX}${commandName} ${args}" in ${message.guild.id}/${message.channel.id}`
			);
		} else {
			logger.log(
				'info',
				`${message.author.id} executed "${COMMAND_PREFIX}${commandName} ${args}" in DM`
			);
		}
	} catch (error) {
		logger.log('error', error);
	}
});

client.login(DISCORD_TOKEN);
