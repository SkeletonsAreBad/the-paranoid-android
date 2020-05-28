const puppeteer = require('puppeteer');

module.exports.scrapeScps = async () => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	await page.goto('http://www.scp-wiki.net/scp-series');

	await page.waitForSelector('.series', { visible: true });

	const data = await page.evaluate(() => {
		const series = document.querySelectorAll('.series')[0];

		return series;
	});

	console.log(data);

	await browser.close();
};

module.exports.scrapeScp = async (input) => {
	let scp = {};

	const number = input.split('-')[1];

	if (input.endsWith('-J')) {
		scp.series = 'Joke SCPs';
		scp.seriesUrl = 'http://www.scp-wiki.net/joke-scps';
	} else if (input.endsWith('-ARC')) {
		scp.series = 'Archived SCPs';
		scp.seriesUrl = 'http://www.scp-wiki.net/archived-scps';
	} else if (input.endsWith('-EX')) {
		scp.series = 'Explained SCPs';
		scp.seriesUrl = 'http://www.scp-wiki.net/scp-ex';
	} else if (number.length === 4 && number.startsWith(5)) {
		scp.series = 'Series VI';
		scp.seriesUrl = 'http://www.scp-wiki.net/scp-series-6';
	} else if (number.length === 4 && number.startsWith(4)) {
		scp.series = 'Series V';
		scp.seriesUrl = 'http://www.scp-wiki.net/scp-series-5';
	} else if (number.length === 4 && number.startsWith(3)) {
		scp.series = 'Series IV';
		scp.seriesUrl = 'http://www.scp-wiki.net/scp-series-4';
	} else if (number.length === 4 && number.startsWith(2)) {
		scp.series = 'Series III';
		scp.seriesUrl = 'http://www.scp-wiki.net/scp-series-3';
	} else if (number.length === 4 && number.startsWith(1)) {
		scp.series = 'Series II';
		scp.seriesUrl = 'http://www.scp-wiki.net/scp-series-2';
	} else if (number.length === 3) {
		scp.series = 'Series I';
		scp.seriesUrl = 'http://www.scp-wiki.net/scp-series';
	} else return null;

	scp.item = input;

	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	await page.goto(scp.seriesUrl);

	await page.waitForSelector('.series', { visible: true });

	const data = await page.evaluate(() => {
		const series = document.querySelectorAll('a')[0].src;

		return series;
	});

	await page.close();

	console.log(data);

	return scp;
};

// module.exports.scps = async (input) => {
// 	try {
// 		let scps = [];

// 		for (let i = 0; i < input.length; i++) {
// 			let scp = input[i];
// 			await axios.get(`http://scp-wiki.net/scp-${scp}`);
// 			scps.push(
// 				`[SCP-${scp.toUpperCase()}](http://scp-wiki.net/scp-${scp})`
// 			);
// 		}
// 		return scps;
// 	} catch (e) {
// 		console.error(e);
// 	}
// };
