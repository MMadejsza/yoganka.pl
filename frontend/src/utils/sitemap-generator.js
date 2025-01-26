const {SitemapStream, streamToPromise} = require('sitemap');
const fs = require('fs');

// Function for static urls
function fetchUrls() {
	return [
		{url: '/', changefreq: 'weekly', priority: 1.0},
		{url: '/wyjazdy', changefreq: 'monthly', priority: 0.9},
		{url: '/wyjazdy/camp-peak-yoga', changefreq: 'monthly', priority: 0.8},
		{url: '/wyjazdy/camp-energia-liczb', changefreq: 'monthly', priority: 0.8},
		{url: '/wyjazdy/camp-ajurweda', changefreq: 'monthly', priority: 0.8},
		{url: '/wyjazdy/camp-summer-chill', changefreq: 'monthly', priority: 0.8},
		{url: '/wyjazdy/camp-harmonia', changefreq: 'monthly', priority: 0.8},
		{url: '/wydarzenia/yoga&sound', changefreq: 'weekly', priority: 0.75},
		{url: '/wydarzenia/sup-yoga', changefreq: 'weekly', priority: 0.75},
		{url: '/wydarzenia/sniadanie-z-yoga', changefreq: 'weekly', priority: 0.75},
	];
}

(async () => {
	const sitemap = new SitemapStream({hostname: 'https://yoganka.pl'});

	// Open file for write
	const writeStream = fs.createWriteStream('public/sitemap.xml');

	// Put data through generator
	sitemap.pipe(writeStream);

	// Fetch urls and add to sitemap
	const urls = fetchUrls();
	urls.forEach((url) => {
		sitemap.write(url);
	});

	// Close pipe
	sitemap.end();

	// Wait for saving the file
	await streamToPromise(sitemap);
	console.log('Sitemap has been generated!');
})();
