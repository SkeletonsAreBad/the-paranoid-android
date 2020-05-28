const re = /scp[-_ ]*\d+(?:[-_]*\w*){0,1}/gi;

module.exports = (input) => {
	const res = input.match(re);
	const scps = res.map((scp) => scp.replace(/[-_ ]+/g, '-').toUpperCase());
	return scps;
};
