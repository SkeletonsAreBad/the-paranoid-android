const axios = require('axios');

module.exports = async input => {
	try {
		let scps = [];

		for (let i = 0; i < input.length; i++) {
			let scp = input[i];
			await axios.get(`http://scp-wiki.net/scp-${scp}`);
			scps.push(
				`[SCP-${scp.toUpperCase()}](http://scp-wiki.net/scp-${scp})`
			);
		}
		return scps;
	} catch (e) {
		console.error(e);
	}
};
