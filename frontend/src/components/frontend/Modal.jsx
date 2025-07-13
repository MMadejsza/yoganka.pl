import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet';
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

  // Function rendering lists based on its structure in the DATA folder (summary:{included:{[...]}, [...]})

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
        <h3 className='modal__title'>{modal.fullDescTitle}</h3>
      )}

      <p className=' modal__full-desc modal__full-desc--content'>
        {modal.fullDesc}
      </p>
    </section>
  );

  const renderSummaryLists = () => (
    <section className='modal__summary'>
      {Object.entries(modal.summary).map(([listType, content], index) => {
        return <ModalList key={index} listType={listType} data={content} />;
      })}
    </section>
  );

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
          data={modal.program}
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
          <h3 className='modal__title'>{modal.plan.title}</h3>

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

  // Content for helmet - each modal has different data for social media and searchEngine
  const metaContent = () => {
    const isCamp = tile.type == 'camp';

    if (isCamp) {
      return {
        title: `${tile.name} - Kobiecy Wyjazd z jogą`,
        desc: `Dowiedz się wszystkiego o kobiecym wyjeździe z jogą. Miejsce: ${tile.front.location}.`,
        canonicalTag: `https://yoganka.pl/wyjazdy/${tile.link}`,
        link: `https://yoganka.pl/wyjazdy/${tile.link}`,
      };
    } else {
      return {
        title: `${tile.name} - Wydarzenie z Yoganką`,
        desc: `Dowiedz się wszystkiego o wydarzeniu ${tile.name}. Miejsce: ${tile.front.location}.`,
        canonicalTag: `https://yoganka.pl/wydarzenia/${tile.link}`,
        link: `https://yoganka.pl/wydarzenia/${tile.link}`,
      };
    }
  };
  const helmetContent = metaContent();
  // const metaImgSpecifier = tile == 'camp' ? 'camps' : 'events';
  // const metaImgUrl = `https://yoganka.pl/imgs/offer/${metaImgSpecifier}/${tile.fileName}/front/480_${tile.fileName}_0.jpg`;

  return createPortal(
    <>
      <Helmet>
        <title>{helmetContent.title}</title>
        <meta name='description' content={helmetContent.desc} />
        <meta name='robots' content='index, follow' />
        {/* START For social media links */}
        <meta property='og:title' content={helmetContent.title} />
        <meta
          property='og:description'
          content={`Dowiedz się wszystkiego o wyjeździe do: ${tile.front.location}. Kliknij teraz!`}
        />
        <meta property='og:url' content={helmetContent.link} />
        <meta property='og:type' content='website' />
        <meta
          property='og:image'
          content={`https://yoganka.pl/imgs/offer/${
            type === 'camp' ? 'camps' : 'events'
          }/${fileName}/front/480_${fileName}_0.jpg`}
        />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={helmetContent.title} />
        <meta name='twitter:description' content={helmetContent.desc} />
        <meta
          name='twitter:image'
          content={`https://yoganka.pl/imgs/offer/${
            type === 'camp' ? 'camps' : 'events'
          }/${fileName}/front/480_${fileName}_0.jpg`}
        />
        {/* END For social media links */}
        <link rel='canonical' href={helmetContent.canonicalTag} />
      </Helmet>

      <div
        className={`modal__overlay ${isVisible ? 'visible' : ''}`}
        onClick={handleClose}
      />

      <div
        className={`modal ${
          isClosing ? 'fade-out' : isVisible ? 'visible' : ''
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className='modal__x-btn'>
          <a className='modal__close-btn' onClick={handleClose}>
            <SymbolOrIcon
              specifier={'fa-solid fa-xmark'}
              type='ICON'
              extraClass={'modal__icon'}
            />
          </a>
        </div>

        <div
          className='modal__modal-body modal__modal-body--offer '
          onClick={e => e.stopPropagation()}
        >
          {modal.title && <h3 className='modal__main-title '>{modal.title}</h3>}

          {galleryContent}
          {/* ${modal.fullDesc.length > 375 ? 'modal__full-desc--long-text' : ''} */}

          {fullDescription}

          {campOnlyContent}

          {eventOnlyContent}

          {isUpToDate && modal.note && (
            <h2 className='modal__attention-note'>{modal.note}</h2>
          )}

          {renderFooter()}
        </div>
      </div>
    </>,
    document.getElementById('modal')
  );
}

export default Modal;
