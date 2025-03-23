import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useModalRoute(
  modalPath,
  initialOpen = false,
  animationDuration = 400
) {
  const location = useLocation();
  const navigate = useNavigate();

  // Modal state
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Effect of delayed visibility setting - for animation
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 5);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('stopScroll');
    } else {
      document.body.classList.remove('stopScroll');
    }
    return () => document.body.classList.remove('stopScroll');
  }, [isVisible]);

  // Sync modal state with url
  useEffect(() => {
    // If url includes modlaPath
    if (location.pathname.includes(modalPath)) {
      setIsOpen(true);
      setIsClosing(false);
    } else if (isOpen) {
      // If modal was open but url has changed to the one without its trigger - start closing
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [location, modalPath, isOpen, animationDuration]);

  // Opening function - setting url to modalPath with memorizing the location
  const openModal = useCallback(() => {
    navigate(modalPath, { state: { background: location } });
  }, [navigate, modalPath, location]);

  // Closing function returning to the previous path (or default '/')
  const closeModal = useCallback(() => {
    if (location.state && location.state.background) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }, [navigate, location]);

  return {
    isOpen,
    isVisible,
    isClosing,
    openModal,
    closeModal,
  };
}
