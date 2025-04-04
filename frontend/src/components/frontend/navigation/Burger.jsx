import { useEffect, useRef, useState } from 'react';

function Burger({ side, isNavOpen: isOpen, setIsNavOpen: setIsOpen }) {
  let openCount = useRef(0);
  // const [isOpen, setIsOpen] = useState(false);
  const [startX, setStartX] = useState(null);
  let isActive = isOpen ? `active` : undefined;

  // Function handling burger click
  function handleClick() {
    setIsOpen(prevState => !prevState);
    // count opening when clicked not open
    if (!isOpen) {
      openCount.current += 1;
    }
    if (openCount.current > 0) {
      if (isOpen) {
        setTimeout(() => {
          document.querySelector('.nav').classList.add('highlighted');
        }, 500);
      }
    }
  }

  // Function fetching touch position
  function handleTouchStart(e) {
    setStartX(e.touches[0].clientX); // Fetch initial touch position
  }

  // Function handling main movement logic
  function handleTouchMove(e) {
    // Fetch current touch position
    const currentX = e.touches[0].clientX;
    // If exists and is in the right 20% of the screen (drawer from the right)
    if (startX !== null && startX / window.innerWidth >= 0.8) {
      // If drag left is longer than 10% of the screen - open
      // console.log(currentX + startX);
      if (startX - currentX > window.innerWidth * 0.1) {
        setIsOpen(true);
        // count opening
        openCount += 1;
      }
    }
    // If drag right is longer than 10% of the screen - close
    if (currentX - startX > window.innerWidth * 0.1) {
      setIsOpen(false);
    }
  }

  // Function finishing touch and resetting the position
  function handleTouchEnd() {
    setStartX(null); // Resetuj początkowy punkt dotyku
  }

  // Listening to touch for full page
  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    // remove on unmount
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startX]);

  return (
    <div
      className={`burger ${isActive} ${side ? 'burger--left' : ''}`}
      id='burger'
      onClick={handleClick}
    >
      <div className='burger__bar burger__bar--top'></div>
      <div className='burger__bar burger__bar--middle'></div>
      <div className='burger__bar burger__bar--bottom'></div>
    </div>
  );
}

export default Burger;
