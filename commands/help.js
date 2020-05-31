const { COMMAND_PREFIX } = process.env;

const { embedHelpCommand, embedHelpFull } = require('../modules/embed');

module.exports = {
	name: 'help',
	description:
		"Get a list of commands for the bot. (You're using it right now!)",
	usage: '[command]',
	cooldown: 10,
	execute(message, args) {
		const data = {};
		const { commands } = message.client;

		if (!args.length) {
			data.commands = commands
				.map((command) => `**${command.name}:** ${command.description}`)
				.join('\n');

			return message.author
				.send({ embed: embedHelpFull(data) })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply("I've sent you a DM with all my commands.");
				})
				.catch((err) => {
					console.error(
						`Could not send help DM to ${message.author.tag}.\n`,
						error
					);
					message.reply(
						"It looks like I can't DM you. Do you have DMs disabled?"
					);
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name);

		if (!command)
			return message.reply(
				`Invalid command.\nRun \`${COMMAND_PREFIX}${this.name}\` for a list of commands.`
			);

		data.name = command.name;
		if (command.description) data.description = command.description;
		data.usage = command.usage
			? `${COMMAND_PREFIX}${command.name} ${command.usage}`
			: `${COMMAND_PREFIX}${command.name}`;
		data.cooldown = command.cooldown
			? `${command.cooldown} seconds`
			: '1 second';

		message.channel.send({ embed: embedHelpCommand(data) });
	},
};
