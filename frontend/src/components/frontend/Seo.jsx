import { Helmet } from 'react-helmet';

function Seo({
  title,
  description,
  keywords,
  canonical,
  image = '/favicon_io/apple-touch-icon.png',
  robots = 'index, follow',
  type = 'website',
  twitterSite,
  imageWidth,
  imageHeight,
  imageAlt,
}) {
  console.log(title, image);
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name='description' content={description} />}
      {canonical && <link rel='canonical' href={canonical} />}
      {robots && <meta name='robots' content={robots} />}
      {keywords && <meta name='keywords' content={keywords} />}

      {/* Open Graph */}
      <meta property='og:locale' content='pl_PL' />
      <meta property='og:type' content={type} />
      <meta property='og:title' content={title} />
      {description && <meta property='og:description' content={description} />}
      {canonical && <meta property='og:url' content={canonical} />}
      {image && <meta property='og:image' content={image} />}
      {imageWidth && (
        <meta property='og:image:width' content={String(imageWidth)} />
      )}
      {imageHeight && (
        <meta property='og:image:height' content={String(imageHeight)} />
      )}
      {imageAlt && <meta property='og:image:alt' content={imageAlt} />}

      {/* Apple */}
      <meta name='apple-mobile-web-app-title' content={title} />

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      {twitterSite && <meta name='twitter:site' content={twitterSite} />}
      <meta name='twitter:title' content={title} />
      {description && <meta name='twitter:description' content={description} />}
      {image && <meta name='twitter:image' content={image} />}
    </Helmet>
  );
}

export default Seo;
