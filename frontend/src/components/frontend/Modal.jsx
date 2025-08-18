import { createPortal } from 'react-dom';
import Seo from '../../components/frontend/Seo.jsx';
import { urlFor } from '../../utils/sanityClient.js';
import { protectWordBreaks } from '../../utils/validation.js';
import SymbolOrIcon from '../common/SymbolOrIcon';
import SanityImage from '../frontend/imgsRelated/SanityImage.jsx';
import Buttons from './Buttons.jsx';
import CampDay from './camps/CampDay.jsx';
import GlideContainer from './glide/GlideContainer.jsx';
import CampGlance from './ModalGlance.jsx';
import ModalList from './ModalList.jsx';

function Modal({ tile, onClose, isVisible, isClosing }) {
  console.log(`Modal tile`, tile);
  const { type, modal, fileName } = tile;
  const gallery = modal.gallery;
  const schedule = modal.plan?.schedule;
  const daysNumber = schedule?.length;
  let isUpToDate =
    modal.title === 'Sup Yoga' ||
    new Date(tile.date).getTime() > new Date().getTime();
  let isCamp = type === 'camp';
  let isEvent = type === 'event';

  // Function closing modal from hook
  const handleClose = () => {
    onClose();
  };

  // Util defining final class of some element
  const dynamicClass = (baseClass, extraClass) =>
    `${baseClass} ${extraClass ? `${baseClass}--${extraClass}` : ''}`;

  // Function rendering lists based on its structure in the data folder (summary:{included:{[...]}, [...]})

  console.log('gallery', gallery);
  const galleryContent =
    gallery && Array.isArray(gallery) && gallery.length > 1 ? (
      // If has gallery - not single img
      <GlideContainer
        placement={'comp'}
        glideConfig={{
          type: 'carousel',
          focusAt: 'center',
          perView: 1,
          gap: 20,
          animationDuration: 800,
        }}
        glideBreakpoints={{
          // <=
          1025: { perView: 1 },
        }}
        type='photo'
        slides={gallery}
      />
    ) : gallery ? (
      <SanityImage image={gallery[0]} variant='gallery' className='tile__img' />
    ) : (
      <SanityImage
        image={tile.mainImage}
        variant='gallery'
        className='tile__img'
      />
    );

  const fullDescription = (
    <section
      className={`modal__full-desc--${type} ${dynamicClass(
        'modal__full-desc',
        `${daysNumber > 3 ? 'long' : ''}`
      )} modal__full-desc--long-text`}
    >
      {modal?.fullDescTitle && (
        <h3 className='modal__title'>
          {protectWordBreaks(modal.fullDescTitle)}
        </h3>
      )}

      <p className=' modal__full-desc modal__full-desc--content'>
        {protectWordBreaks(modal.fullDesc)}
      </p>
    </section>
  );

  const renderSummaryLists = () => {
    console.log(modal.summary);
    return (
      <section className='modal__summary'>
        {modal.summary.map(obj => (
          <ModalList
            key={obj._key}
            listType={obj._type}
            list={obj.list}
            title={obj.title}
          />
        ))}
      </section>
    );
  };

  const eventOnlyContent = isEvent && (
    <>
      {modal.glance && (
        <header className={`modal__header modal__full-desc--long-text`}>
          <CampGlance glance={modal.glance} />
        </header>
      )}

      {modal.program?.list?.length > 0 && (
        <ModalList
          extraClass='event'
          listType={modal.program?.listType}
          list={modal.program?.list}
          title={modal.program.title}
        />
      )}
    </>
  );

  const campOnlyContent = isCamp && (
    <>
      <header className={`modal__header modal__full-desc--long-text`}>
        <CampGlance glance={modal.glance} />
      </header>

      {daysNumber > 0 && (
        <section
          className={dynamicClass(
            'modal__desc',
            `${daysNumber > 3 ? 'long' : ''}`
          )}
        >
          <h3 className='modal__title'>
            {protectWordBreaks(modal.plan.title)}
          </h3>

          {schedule.map((day, index) => (
            <CampDay key={index} dayData={day} />
          ))}
        </section>
      )}

      {Object.keys(modal.summary).length > 0 && renderSummaryLists()}
    </>
  );

  // Function to render action btns as modals footer
  const renderFooter = () => {
    // If no btns - don't render
    const noBtns = modal.btnsContent?.length === 0;
    if (noBtns) return null;

    return (
      isUpToDate && (
        <footer className='modal__user-action'>
          <Buttons list={modal.btnsContent} />
        </footer>
      )
    );
  };

  const socialImageUrl = urlFor(tile.mainImage)
    .width(1200)
    .height(630)
    .fit('crop')
    .auto('format')
    .quality(60)
    .url();
  return createPortal(
    <>
      <Seo
        title={tile.seoTitle || tile.front.title}
        description={
          tile.seoDescription || `Dowiedz się wszystkiego o ${tile.front.title}`
        }
        canonical={`https://yoganka.pl/${isCamp ? 'wyjazdy' : 'wydarzenia'}/${
          tile.link
        }`}
        image={socialImageUrl}
        imageWidth={1200}
        imageHeight={630}
        imageAlt={tile.front.title}
      />

      <div
        className={`overlay ${isVisible ? 'visible' : ''}`}
        onClick={handleClose}
      />

      <div
        className={`modal ${
          isClosing ? 'fade-out' : isVisible ? 'visible' : ''
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className='close-btn__container'>
          <a className='close-btn__btn' onClick={handleClose}>
            <SymbolOrIcon
              specifier={'fa-solid fa-xmark'}
              type='ICON'
              extraClass={'modal__icon'}
            />
          </a>
        </div>

        {modal.title && (
          <h3 className='modal__main-title '>
            {protectWordBreaks(modal.title)}
          </h3>
        )}

        {galleryContent}

        {fullDescription}

        {campOnlyContent}

        {eventOnlyContent}

        {isUpToDate && modal.note && (
          <h2 className='modal__attention-note'>
            {protectWordBreaks(modal.note)}
          </h2>
        )}

        {renderFooter()}
      </div>
    </>,
    document.getElementById('modal')
  );
}

export default Modal;
