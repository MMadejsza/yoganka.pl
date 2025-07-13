import { useModalByURL } from '../../hooks/useModalByURL.js';
import Buttons from './Buttons.jsx';
import SanityImage from './imgsRelated/SanityImage.jsx';
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

  const renderSingleImg = (
    <SanityImage
      image={data.mainImage}
      variant='front'
      alt={data.front.title}
      className='tile__img'
    />
  );

  // Dates rendering definition
  const renderDates = data.front.dates?.map((date, index) => (
    <h3 className='tile__date' key={index}>
      {date}
    </h3>
  ));

  // Btns rendering definition
  const renderBtns = data.front.btnsContent && (
    <Buttons list={data.front.btnsContent} />
  );

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
