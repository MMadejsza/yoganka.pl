import { urlFor } from '../../../utils/sanityClient';
// const breakpoints = [360, 480, 640, 768, 960, 1025, 1080, 1280, 1400, 1920];

const frontSizes = [320, 480];
const logoSizes = [55, 100, 150, 185, 200];
const partnersSizes = [185, 250, 360, 500];
const galleryWidths = [480, 768, 1024, 1200];
const galleryHeights = [360, 576, 768, 1024];
const writtenLogoSizes = [200, 275, 320, 480];
const stampedImgSizes = [375, 480, 768];
const stampsSizes = [35, 41, 70, 100, 150];
const imgQuality = 60;

function SanityImage({
  image,
  variant,
  alt = '',
  className = '',
  containerClassName = '',
}) {
  if (!image || !image.asset?._ref) return null;

  const builder = urlFor(image);
  const galleryBuilder = urlFor(image).ignoreImageParams();

  const filename = image.asset.originalFilename || '';
  const ref = image.asset._ref.toLowerCase();

  //   squares
  if (variant === 'front' || variant === 'partner') {
    if (variant === 'partner' && ref.endsWith('-svg')) {
      return (
        <img
          src={builder.url()}
          alt={alt || filename}
          title={filename}
          className={className}
          loading='lazy'
        />
      );
    }
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

    const givenSizes =
      variant === 'partner'
        ? partnersSizes.map(size => `${size}px`).join(', ')
        : frontSizes.map(size => `${size}px`).join(', ');

    return (
      <picture className={containerClassName ?? className}>
        <source
          type='image/webp'
          srcSet={webpSrcSet}
          // sizes={givenSizes}
        />
        <source
          type='image/jpeg'
          srcSet={jpgSrcSet}
          // sizes={givenSizes}
        />
        <img
          src={builder
            .width(frontSizes[0])
            .height(frontSizes[0])
            .fit('crop')
            .auto('format')
            .quality(imgQuality)
            .url()}
          srcSet={jpgSrcSet}
          // sizes={givenSizes}
          alt={alt || filename}
          title={filename}
          className={className}
          loading='lazy'
        />
      </picture>
    );
  } else if (
    variant === 'writtenLogo' ||
    variant === 'stampedImg' ||
    variant === 'stamp' ||
    variant === 'logo'
  ) {
    const pickedSet =
      variant === 'writtenLogo'
        ? writtenLogoSizes
        : variant === 'logo'
        ? logoSizes
        : variant === 'stampedImg'
        ? stampedImgSizes
        : stampsSizes;
    // if svg
    if (ref.endsWith('-svg')) {
      return (
        <img
          src={builder.url()}
          alt={alt || filename}
          title={filename}
          className={className}
          loading='lazy'
        />
      );
    }
    // WebP srcSet
    const webpSrcSet = pickedSet
      .map(
        size =>
          `${builder
            .fit('max')
            .width(size)
            .format('webp')
            .quality(imgQuality)
            .url()} ${size}w`
      )
      .join(', ');
    // JPEG srcSet fallback
    const jpgSrcSet = pickedSet
      .map(
        size =>
          `${builder
            .fit('max')
            .width(size)
            .auto('format')
            .quality(imgQuality)
            .url()} ${size}w`
      )
      .join(', ');

    // const givenSizes = pickedSet.map(size => `${size}px`).join(', ');

    return (
      <picture className={containerClassName ?? className}>
        <source
          type='image/webp'
          srcSet={webpSrcSet}
          // sizes={givenSizes}
        />
        <source
          type='image/jpeg'
          srcSet={jpgSrcSet}
          // sizes={givenSizes}
        />
        <img
          src={builder
            .width(pickedSet[0])
            .fit('max')
            .auto('format')
            .quality(imgQuality)
            .url()}
          srcSet={jpgSrcSet}
          // sizes={givenSizes}
          alt={alt || filename}
          title={filename}
          className={className}
          loading='lazy'
        />
      </picture>
    );
  } else {
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
      <picture className={containerClassName ?? className}>
        <source
          type='image/webp'
          srcSet={webpSrc}
          // sizes={sizesAttr}
        />
        <source
          type='image/jpeg'
          srcSet={jpgSrcSet}
          // sizes={sizesAttr}
        />
        <img
          src={galleryBuilder
            .fit('max')
            .width(galleryWidths[0])
            .height(galleryHeights[0])
            .auto('format')
            .quality(imgQuality)
            .url()}
          srcSet={jpgSrcSet}
          // sizes={sizesAttr}
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
