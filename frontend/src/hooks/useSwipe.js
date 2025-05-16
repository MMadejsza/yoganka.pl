import { useEffect, useState } from 'react';

export function useSwipe(
  side,
  onOpen,
  onClose,
  { edgePercent = 0.25, thresholdPercent = 0.1 } = {}
) {
  // State to store the initial touch position
  const [startX, setStartX] = useState(null);

  useEffect(() => {
    const windowWidth = window.innerWidth;

    // Handle the start of a touch event
    function handleTouchStart(e) {
      const x = e.touches[0].clientX;
      // Only start tracking if touch starts within the configured edge region
      if (
        (!side && x >= windowWidth * (1 - edgePercent)) || // right edge
        (side && x <= windowWidth * edgePercent) // left edge
      ) {
        setStartX(x);
      }
    }

    // Handle movement during a touch event
    function handleTouchMove(e) {
      // Only if touch is in eligible area
      if (startX === null) return;
      // Fetch current touch position
      const currentX = e.touches[0].clientX;
      const delta = currentX - startX;
      const threshold = windowWidth * thresholdPercent;

      // If drawer on RIGHT edge
      if (!side && startX >= windowWidth * (1 - edgePercent)) {
        //if  swipe LEFT beyond threshold, trigger open
        if (startX - currentX > threshold) {
          onOpen();
        }
      }
      // If drawer on LEFT edge
      if (side && startX <= windowWidth * edgePercent) {
        // if swipe RIGHT beyond threshold, trigger open
        if (currentX - startX > threshold) {
          onOpen();
        }
      }
      // Close drawer on opposite swipe beyond threshold
      if (
        (!side && delta > threshold) || // on right, swipe right to close
        (side && -delta > threshold) // on left, swipe left to close
      ) {
        onClose();
      }
    }

    // Handle end of touch event and reset tracking
    function handleTouchEnd() {
      setStartX(null);
    }

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startX, side, edgePercent, thresholdPercent, onOpen, onClose]);
}
