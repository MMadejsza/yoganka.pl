import { Link } from 'react-router-dom';
import { useModalByURL } from '../../hooks/useModalByURL.js';
import { smoothScrollInto } from '../../utils/utils.jsx';
import SymbolOrIcon from '../common/SymbolOrIcon';
import ImgDynamic from './imgsRelated/ImgDynamic.jsx';
import Modal from './Modal.jsx';

function Tile({ data, today, clickable }) {
  const isPast = data.front.title != 'Sup Yoga' && data.date < today;
  const classes = data.type === 'class';
  const conditionalClasses = [
    'tile',
    clickable ? 'clickable' : null,
    classes ? 'tile--classes' : null,
    isPast ? 'past' : null,
    data.extraClass ? `tile--${data.extraClass}` : null,
  ]
    .join(' ')
    .trim();
  const modalPath =
    data.explicitLink ??
    `/${data.type === 'camp' ? 'wyjazdy' : 'wydarzenia'}/${data.link}`;

  if (isPast && data.modal?.glance) data.modal.glance.price = '-';

  // Custom hook for handling modal behavior
  const { isOpen, isVisible, isClosing, openModal, closeModal } =
    useModalByURL(modalPath);

  // Function for clicking the tile
  const handleOpenModal = () => {
    if (clickable) {
      if (classes) {
        // classes page
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 20);
      }
      openModal();
    }
  };

  // Function for closing the tile from hook
  const handleCloseModal = closeModal;

  // Img paths definition
  const imgPaths = [
    { path: `${data.imgPath}/320_${data.fileName}_0.jpg`, size: '320w' },
    { path: `${data.imgPath}/480_${data.fileName}_0.jpg`, size: '600w' },
  ];
  const renderSingleImg = (
    <ImgDynamic
      classy={`tile__img`}
      srcSet={imgPaths}
      sizes={`
					(max-width: 640px) 320px,
					(max-width: 768px) 480px,
					480px
					`}
      alt={data.name}
    />
  );

  // Dates rendering definition
  const renderDates = data.front.dates?.map((date, index) => (
    <h3 className='tile__date' key={index}>
      {date}
    </h3>
  ));

  // Btns rendering definition
  const renderBtns = data.front.btnsContent?.map((btn, index) => {
    // Chose if material design symbol or icon

    // If btn supposes to redirect to different page - use Link (no reloading)
    if (btn.action === 'subPage') {
      return (
        <Link
          key={index}
          to={btn.link}
          title={btn.title}
          className={`tile__btn tile__btn--${data.fileName}`}
        >
          <SymbolOrIcon
            type={btn.icon ? 'ICON' : 'SYMBOL'}
            specifier={btn.icon || btn.symbol}
          />
          {btn.text}
        </Link>
      );
    } else {
      // Case where Btn was to scroll to different section of the page (archived behavior for now)
      return (
        <a
          onClick={btn.action === 'scroll' ? e => smoothScrollInto(e) : null}
          key={index}
          target='_blank'
          href={btn.link}
          title={btn.title}
          className={`tile__btn tile__btn--${data.fileName}`}
        >
          <SymbolOrIcon
            type={btn.icon ? 'ICON' : 'SYMBOL'}
            specifier={btn.icon || btn.symbol}
          />
          {btn.text}
        </a>
      );
    }
  });

  return (
    <div
      className={conditionalClasses}
      onClick={clickable ? handleOpenModal : undefined}
    >
      {renderSingleImg}

      <h3 className='tile__title'>{data.front.title}</h3>

      {data.front.dates?.length > 0 && renderDates}

      {data.front.location && (
        <h4 className='tile__location'>{data.front.location}</h4>
      )}

      {clickable ? (
        <p className='tile__desc'>
          {data.front.desc ?? null}
          <span className='material-symbols-rounded click-suggestion'>
            web_traffic
          </span>
        </p>
      ) : (
        <p className='tile__desc'>{data.front.desc}</p>
      )}

      {data.front.btnsContent?.length > 0 && renderBtns}

      {isOpen && clickable && (
        <Modal
          tile={data}
          singleImg={renderSingleImg}
          onClose={handleCloseModal}
          today={today}
          isVisible={isVisible}
          isClosing={isClosing}
        />
      )}
    </div>
  );
}

export default Tile;
