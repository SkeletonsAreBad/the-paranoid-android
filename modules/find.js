const re = /scp[-_ ]*\d+(?:[-_]*\w*){0,1}/gi;

module.exports = (input) => {
	let res = input.match(re);
	return res;
};
