import { memo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import SymbolOrIcon from '../../components/common/SymbolOrIcon.jsx';
import { useModalByURL } from '../../hooks/useModalByURL';

function WrapperModal({
  basePath,
  visited,
  onClose,
  onCloseFeedback,
  children,
}) {
  const { isOpen, isVisible, isClosing, openModal, closeModal } =
    useModalByURL(basePath);
  const prevOpenRef = useRef(isOpen);
  const openOnce = useRef(false);

  useEffect(() => {
    if (prevOpenRef.current && !isOpen) {
      onClose();
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, onClose]);

  useEffect(() => {
    if (
      visited &&
      !isOpen &&
      !openOnce.current &&
      location.pathname !== basePath
    ) {
      openOnce.current = true;
      openModal();
    }
  }, [visited, isOpen, openModal, basePath]);

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

  // when the hook sets isOpen=false (e.g. for back), we call onClose once

  const handleClose = () => {
    if (onCloseFeedback) {
      onCloseFeedback();
    }
    // then animate & unmount the modal
    closeModal();
  };

  if (!isOpen && !isClosing) return null;

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

export default memo(WrapperModal);
