import { urlFor } from '../../../utils/sanityClient';
const frontSizes = [320, 480];
const gallerySizes = [480, 768, 1024, 1400, 1600];

function SanityImage({ image, variant, alt = '', className = '' }) {
  if (!image || !image.asset?._ref) return null;
  const builder = urlFor(image);
  const filename = image.asset.originalFilename || '';

  //   squares
  if (variant === 'front') {
    // WebP srcSet
    const webpSrcSet = frontSizes
      .map(
        size =>
          `${builder
            .width(size)
            .height(size)
            .fit('crop')
            .format('webp')
            .url()} ${size}w`
      )
      .join(', ');
    // JPEG srcSet fallback
    const jpgSrcSet = frontSizes
      .map(
        size =>
          `${builder
            .width(size)
            .height(size)
            .fit('crop')
            .format('jpg')
            .url()} ${size}w`
      )
      .join(', ');

    const givenSizes = frontSizes.map(size => `${size}px`).join(', ');

    return (
      <picture className={className}>
        <source type='image/webp' srcSet={webpSrcSet} sizes={givenSizes} />
        <source type='image/jpeg' srcSet={jpgSrcSet} sizes={givenSizes} />
        <img
          src={builder
            .width(frontSizes[0])
            .height(frontSizes[0])
            .fit('crop')
            .auto('format')
            .url()}
          srcSet={jpgSrcSet}
          sizes={`${frontSizes[0]}px, ${frontSizes[1]}px`}
          alt={alt || filename}
          title={filename}
          className={className}
          loading='lazy'
        />
      </picture>
    );
  } else {
    const srcSet = gallerySizes
      .map(w => `${builder.width(w).fit('max').auto('format').url()} ${w}w`)
      .join(', ');
    const webpSrc = builder
      .width(gallerySizes[gallerySizes.length - 1])
      .fit('max')
      .format('webp')
      .url();

    return (
      <picture className={className}>
        <source type='image/webp' srcSet={webpSrc} sizes='100vw' />
        <img
          src={builder.width(gallerySizes[0]).fit('max').auto('format').url()}
          srcSet={srcSet}
          sizes='(max-width:480px) 480px, (max-width:768px) 768px, (max-width:1024px) 1024px, (max-width:1400px) 1400px, 1600px'
          alt={alt || filename}
          title={filename}
          loading='lazy'
          className={className}
        />
      </picture>
    );
  }
}

export default SanityImage;
