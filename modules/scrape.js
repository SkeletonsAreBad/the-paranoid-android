const cheerio = require('cheerio');
const fetch = require('node-fetch');

const EXCEPTIONS = require('../exceptions.json');

scrapeScp = async (input) => {
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

	const res = await fetch(scp.seriesUrl);

	const html = await res.text();
	const $ = cheerio.load(html);

	const listing = $(`.series ul li a:contains(${input})`);

	scp.item = listing.text();
	scp.slug = listing.attr().href;
	scp.title = listing
		.parent()
		.text()
		.slice(scp.item.length + 3);

	return scp;
};

module.exports.scrapeArticle = async (input) => {
	let article = {};

	article.slug = input
		.toLowerCase()
		.replace(/[-'" ]+/g, '-')
		.replace(/[.,]+/g, '');

	const res = await fetch(`http://scp-wiki.net/${article.slug}`);

	if (!res.ok) return null;

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

	if (
		$('#page-content p:contains("Object Class")') &&
		!EXCEPTIONS.includes(article.title)
	) {
		article.preview = `**Object Class:** ${$(
			'#page-content p:contains("Object Class")'
		)
			.text()
			.slice(14)}\n**Description:** ${$(
			'#page-content p:contains("Description")'
		)
			.text()
			.split(' ')
			.slice(1, 50)
			.join(' ')}…`;
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

module.exports.scrapeScps = async (input) => {
	let scpList = [];

	for (var i = 0; i < input.length; i++) {
		const scp = input[i];

		const scpItem = await scrapeScp(scp);

		scpList.push(
			`[${scpItem.series}](${scpItem.seriesUrl}) » [${scpItem.item}](http://scp-wiki.net${scpItem.slug}) - ${scpItem.title}`
		);
	}

	return scpList;
};

module.exports.scrape001 = async () => {
	let proposals = [];

	const res = await fetch(`http://scp-wiki.net/scp-001`);

	const html = await res.text();
	const $ = cheerio.load(html);

	$('.series p a').each(function () {
		codename = $(this).text();
		href = $(this).attr('href');
		title = $(this).parent().text().slice(codename.length);
		proposals.push(`[${codename}](http://scp-wiki.net${href})${title}`);
	});

	return proposals;
};

module.exports.scrapeMtfInfo = async (input) => {
	let mtf = {};

	const res = await fetch(`http://scp-wiki.net/task-forces`);

	const html = await res.text();
	const $ = cheerio.load(html);

	const mtfInfo = $(`span:contains(${input})`).parent();

	if (!mtfInfo) return null;

	mtf.url = input.toLowerCase();

	mtf.title = mtfInfo.text();

	if (mtf.title.startsWith('MTF')) {
		mtf.mission = mtfInfo.parent().parent().find('p').text().slice(20);

		mtf.logoUrl = mtfInfo.parent().find('img').attr().src;
	} else {
		mtf.title = 'MTF ' + mtf.title;

		mtf.mission = mtfInfo.next().text().slice(20);

		mtf.logoUrl =
			'http://www.scp-wiki.net/local--files/component:theme/logo.png';
	}

	return mtf;
};

module.exports.scrapeMtfFull = async () => {
	let mtf = [];

	const res = await fetch(`http://scp-wiki.net/task-forces`);

	const html = await res.text();
	const $ = cheerio.load(html);

	$('.collapsible-block-content p a').each(function () {
		text = $(this).text();
		if (!text.startsWith('MTF')) text = 'MTF ' + text;
		href = $(this).attr('href');
		if (href.match(/\w+-\d+/gi)) mtf.push(`• ${text}`);
	});

	return mtf;
};

module.exports.scrapeGoiInfo = async (input) => {
	let goi = {};

	const res = await fetch(`http://www.scp-wiki.net/groups-of-interest`);

	const html = await res.text();
	const $ = cheerio.load(html);

	const goiInfo = $(`h1:contains(${input})`);

	if (!goiInfo) return null;

	goi.url = goiInfo.children().children().attr('href');

	if (goi.url.startsWith('/')) goi.url = 'http://www.scp-wiki.net' + goi.url;

	goi.title = goiInfo.text();

	goi.overview = [];

	goi.overview = goiInfo.parent().find('p').first().text().slice(10);

	if (goi.overview.length > 2000)
		goi.overview = goi.overview.slice(0, 2000) + '…';

	goi.logoUrl = goiInfo.parent().find('img').attr().src;

	return goi;
};

module.exports.scrapeGoiFull = async () => {
	let goi = [];

	const res = await fetch(`http://scp-wiki.net/groups-of-interest`);

	const html = await res.text();
	const $ = cheerio.load(html);

	$('#toc-list div a').each(function () {
		text = $(this).text();
		goi.push(`• ${text}`);
	});

	return goi;
};
