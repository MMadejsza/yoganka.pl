import { useRef } from 'react';

function Burger({ side, isNavOpen: isOpen, setIsNavOpen: setIsOpen }) {
  let openCount = useRef(0);
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
