import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet';
import CampDay from './camps/CampDay.jsx';
import GlideContainer from './glide/GlideContainer.jsx';
import CampGlance from './ModalGlance.jsx';
import ModalList from './ModalList.jsx';

function Modal({ tile, singleImg, onClose, today, isVisible, isClosing }) {
  const { type, modal, gallerySize, galleryPath, fileName, extraClass } = tile;
  let isUpToDate = tile.date > today;
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

  const galleryContent = gallerySize ? (
    // If has gallery - not single img
    <GlideContainer
      placement={'comp'}
      glideConfig={{
        type: 'carousel',
        focusAt: 'center',
        perView: 2,
        gap: 20,
        animationDuration: 800,
      }}
      glideBreakpoints={{
        // <=
        1025: { perView: 1 },
      }}
      type='photo'
      slides={{
        galleryPath: galleryPath,
        fileName: fileName,
        size: gallerySize,
      }}
    />
  ) : (
    singleImg
  );

  const fullDescription = (
    <section
      className={`modal__full-desc--${type} ${dynamicClass(
        'modal__full-desc',
        extraClass
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
      {Object.entries(modal.summary).map(([listType, content], index) => (
        <ModalList key={index} listType={listType} data={content} />
      ))}
    </section>
  );

  const eventOnlyContent = isEvent && (
    <ModalList
      extraClass='event'
      listType={modal.program.listType}
      data={modal.program}
    />
  );

  const campOnlyContent = isCamp && (
    <>
      <header className={`modal__header modal__full-desc--long-text`}>
        <CampGlance glance={modal.glance} />
      </header>

      {modal.plan.schedule.length > 0 && (
        <section className={dynamicClass('modal__desc', extraClass)}>
          <h3 className='modal__title'>{modal.plan.title}</h3>

          {modal.plan.schedule.map((day, index) => (
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

    // Chose if material design symbol or icon //# similar to renderBtns in Tile.jsx
    const symbolOrIcon = btn => {
      if (btn.icon && btn.symbol) return;
      if (btn.icon) {
        <i
          className={`${btn.icon} nav__icon`}
          style={{ paddingRight: '1rem' }}
        ></i>;
      } else if (btn.symbol) {
        <span className='material-symbols-rounded nav__icon'>
          {btn.symbol}
        </span>;
      }
    };

    return (
      isUpToDate && (
        <footer className='modal__user-action'>
          {modal.btnsContent.map((btn, index) => (
            <a
              key={index}
              href={btn.link}
              target='_blank'
              title={btn.title}
              className={`modal__btn`}
            >
              {symbolOrIcon(btn)}
              {btn.text}
            </a>
          ))}
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
        {/* END For social media links */}
        <link rel='canonical' href={helmetContent.canonicalTag} />
      </Helmet>

      <div
        className={`modal__overlay ${isVisible ? 'visible' : ''}`}
        onClick={handleClose}
      />

      <div
        className={`modal ${isClosing ? 'fade-out' : isVisible ? 'visible' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className='modal__x-btn'>
          <a className='modal__close-btn' onClick={handleClose}>
            <i className='fa-solid fa-xmark modal__icon'></i>
          </a>
        </div>

        <div
          className='modal__modal-body modal__modal-body--offer '
          onClick={e => e.stopPropagation()}
        >
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
