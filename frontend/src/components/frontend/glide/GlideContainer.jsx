import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
import { useEffect, useRef } from 'react';
import SanityImage from '../imgsRelated/SanityImage.jsx';
import CertificateSlide from './slides/CertificateSlide.jsx';
import PhotoSlide from './slides/PhotoSlide.jsx';
import ReviewSlide from './slides/ReviewSlide.jsx';

function GlideContainer({
  placement,
  glideConfig,
  glideBreakpoints,
  slides,
  type,
}) {
  const glideRef = useRef(null);

  useEffect(() => {
    // double checking if component is rendered
    if (glideRef.current) {
      try {
        const glide = new Glide(glideRef.current, {
          ...glideConfig,
          breakpoints: glideBreakpoints || {
            360: { perView: 1 },
            480: { perView: 2 },
            1024: { perView: 3 },
          },
        });
        glide.mount();

        // happens after unmounting the component:
        return () => {
          glide.destroy();
        };
      } catch (error) {
        console.error('Error initializing Glide:', error);
      }
    }
  }, [glideConfig, glideBreakpoints]);

  const isTile = type === 'tile';
  const isPhoto = type === 'photo';
  const isAllPhotos = type === 'allPhotos';
  const isReview = type === 'review';
  const isPartner = type === 'partner';

  const renderSlides = () => {
    const SlideComponent = (() => {
      if (isTile) return CertificateSlide;
      if (isPhoto || isAllPhotos) return PhotoSlide;
      if (isReview) return ReviewSlide;
      return null;
    })();

    if (SlideComponent && !isPartner) {
      return slides.map((slide, index) => (
        <SlideComponent key={index} slideData={slide} />
      ));
    } else {
      return slides.map((partner, index) => (
        <a
          key={index}
          href={partner.link}
          target='_blank'
          className={`partners__link`}
        >
          <SanityImage
            image={partner.logo}
            variant='partner'
            className='partners__image'
          />
        </a>
      ));
    }
  };
  const renderBullets = () => {
    return Array.from({ length: slides.length }).map((_, index) => (
      <button
        key={index}
        className='glide__bullet'
        data-glide-dir={`=${index}`}
      />
    ));
  };

  return (
    <div
      className={`glide ${placement ? `glide--${placement}` : ''}`}
      ref={glideRef}
    >
      <div className='glide__track' data-glide-el='track'>
        <ul className='glide__slides'>{renderSlides()}</ul>
      </div>

      <div className='glide__bullets' data-glide-el='controls[nav]'>
        {renderBullets()}
      </div>

      <div className='glide__arrows' data-glide-el='controls'>
        <button className='glide__arrow glide__arrow--left' data-glide-dir='<'>
          <i className='fa-solid fa-chevron-left'></i>
        </button>
        <button className='glide__arrow glide__arrow--right' data-glide-dir='>'>
          <i className='fa-solid fa-chevron-right'></i>
        </button>
      </div>
    </div>
  );
}

export default GlideContainer;
