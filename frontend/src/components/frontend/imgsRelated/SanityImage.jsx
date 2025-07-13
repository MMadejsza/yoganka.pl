import { urlFor } from '../../../utils/sanityClient';
const frontSizes = [320, 480];
const galleryWidths = [480, 768, 1024, 1200];
const galleryHeights = [360, 576, 768, 768];
const imgQuality = 70;

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
            .quality(imgQuality)
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
            .quality(imgQuality)
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
            .quality(imgQuality)
            .url()}
          srcSet={jpgSrcSet}
          sizes={givenSizes}
          alt={alt || filename}
          title={filename}
          className={className}
          loading='lazy'
        />
      </picture>
    );
  } else {
    const galleryBuilder = urlFor(image).ignoreImageParams();
    const jpgSrcSet = galleryWidths
      .map((w, i) => {
        const h = galleryHeights[i] ?? w;
        return `${galleryBuilder
          .fit('max')
          .width(w)
          .height(h)
          .auto('format')
          .quality(imgQuality)
          .url()} ${w}w`;
      })
      .join(', ');
    const webpSrc = galleryWidths
      .map((w, i) => {
        const h = galleryHeights[i] ?? w;
        return `${galleryBuilder
          .fit('max')
          .width(w)
          .height(h)
          .format('webp')
          .quality(imgQuality)
          .url()} ${w}w`;
      })
      .join(', ');

    const maxWidth = Math.max(...galleryWidths);
    const sizesAttr = galleryWidths
      .map((w, i) => `(max-width:${galleryWidths[i]}px) ${galleryWidths[i]}px`)
      .concat(`${maxWidth}px`)
      .join(', ');

    return (
      <picture className={className}>
        <source type='image/webp' srcSet={webpSrc} sizes={sizesAttr} />
        <source type='image/jpeg' srcSet={jpgSrcSet} sizes={sizesAttr} />
        <img
          src={galleryBuilder
            .fit('max')
            .width(galleryWidths[0])
            .height(galleryHeights[0])
            .auto('format')
            .quality(imgQuality)
            .url()}
          srcSet={jpgSrcSet}
          sizes={sizesAttr}
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
