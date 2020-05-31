const cheerio = require('cheerio');
const fetch = require('node-fetch');

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

	console.log(data);

	return scp;
};

module.exports.scrapeArticle = async (input) => {
	let article = {};

	article.slug = input.toLowerCase().replace(/[- ]+/g, '-');

	const res = await fetch(`http://scp-wiki.net/${article.slug}`);

	const html = await res.text();
	const $ = cheerio.load(html);

	article.title = $('#page-title')
		.first()
		.text()
		.replace(/[ ]+/g, ' ')
		.replace(/\n /g, '');

	let breadcrumbs = $('#breadcrumbs a').toArray();
	let breadcrumbsarray = [];

	for (var i = 0; i < breadcrumbs.length; i++) {
		breadcrumbsarray.push(
			`[${breadcrumbs[i].children[0].data}](http://scp-wiki.net${breadcrumbs[i].attribs.href})`
		);
	}

	article.breadcrumbs = breadcrumbsarray.join(' » ');

	if ($('#page-content p').first().text().startsWith('Item #:')) {
		article.preview = `**Object Class:** ${
			$('#page-content p').toArray()[1].children[1].data
		}`;
	} else {
		article.preview = `${$('#page-content p')
			.first()
			.text()
			.split(' ')
			.slice(0, 50)
			.join(' ')}…`;
	}

	article.pageInfo = `${$('#page-info').first().text()} | ${$('.rate-points')
		.first()
		.text()}`;

	return article;
};
