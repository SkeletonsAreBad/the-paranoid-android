const re = /\d+(?:-\w*)*/gi;

module.exports = input => {
	let res = input.match(re);
	return res;
};
