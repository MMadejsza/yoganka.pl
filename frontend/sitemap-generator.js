import fs from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { client } from './src/utils/sanityClient.js';

const siteUrl = 'https://yoganka.pl';

async function fetchUrlsFromSanity() {
  const query = `{
    "camps": *[_type == "camp"].slug.current,
    "classes": *[_type == "class"].slug.current,
    "events": *[_type == "event"].slug.current
  }`;
  const data = await client.fetch(query);

  return [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/wyjazdy', changefreq: 'monthly', priority: 0.9 },
    ...data.camps.map(slug => ({
      url: `/wyjazdy/${slug}`,
      changefreq: 'monthly',
      priority: 0.8,
    })),
    ...data.classes.map(slug => ({
      url: `/zajecia/${slug}`,
      changefreq: 'monthly',
      priority: 0.8,
    })),
    { url: '/wydarzenia', changefreq: 'monthly', priority: 0.9 },
    ...data.events.map(slug => ({
      url: `/wydarzenia/${slug}`,
      changefreq: 'weekly',
      priority: 0.75,
    })),
    { url: '/grafik', changefreq: 'daily', priority: 0.9 },
    { url: '/grafik/karnety', changefreq: 'weekly', priority: 0.9 },
    { url: '/yoga-dla-firm', changefreq: 'monthly', priority: 0.9 },
  ];
}

(async () => {
  const sitemap = new SitemapStream({ hostname: siteUrl });

  // Open file for write
  const writeStream = fs.createWriteStream('public/sitemap.xml');

  // Put data through generator
  sitemap.pipe(writeStream);

  // Fetch urls and add to sitemap
  const urls = await fetchUrlsFromSanity();
  urls.forEach(url => {
    sitemap.write(url);
  });

  // Close pipe
  sitemap.end();

  // Wait for saving the file
  await streamToPromise(sitemap);
  console.log('✅ Sitemap has been generated!');
})();
