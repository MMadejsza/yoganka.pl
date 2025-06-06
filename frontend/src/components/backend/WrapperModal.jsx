import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import SymbolOrIcon from '../../components/common/SymbolOrIcon.jsx';
import { useModal } from '../../hooks/useModal';

function WrapperModal({ visited, onClose, onCloseFeedback, children }) {
  const { isOpen, isVisible, isClosing, openModal, closeModal } =
    useModal(false);

  useEffect(() => {
    if (visited) {
      openModal();
    }
  }, [visited, isOpen, openModal]);

  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('stopScroll');
    } else {
      document.body.classList.remove('stopScroll');
    }

    return () => {
      document.body.classList.remove('stopScroll');
    };
  }, [isVisible]);

  const handleClose = () => {
    if (onCloseFeedback) {
      onCloseFeedback();
    }
    closeModal(onClose);
  };

  if (!isOpen) return null;

  return createPortal(
    <>
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
              type='ICON'
              specifier={'fa-solid fa-xmark modal__icon'}
            />
          </a>
        </div>
        {children}
      </div>
    </>,
    document.getElementById('modal')
  );
}

export default WrapperModal;
