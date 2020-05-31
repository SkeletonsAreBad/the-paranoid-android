module.exports = {
	name: 'ping',
	description: 'Determine the latency of the bot.',
	execute(message, args) {
		message.channel.send('Pong!');
	},
};
