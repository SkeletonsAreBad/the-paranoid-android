const re = /scp[-_ ]*\d+(?:[-_]*\w*){0,1}/gi;

module.exports = (input) => {
	const res = input.match(re);
	let scps;
	if (res) scps = res.map((scp) => scp.replace(/[-_ ]+/g, '-').toUpperCase());
	return scps;
};
