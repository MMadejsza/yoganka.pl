export const smoothScrollInto = (e, navigate, location) => {
  // console.log(location);
  e.preventDefault();
  navigate(`/`, { state: { background: location } });
  setTimeout(() => {
    // fetch prop href from clicked menu tile
    const targetSelector = e.target.getAttribute('data-scroll');
    // Find in Dom first element matching href
    const targetSection = document.querySelector(targetSelector);
    // If section exists - scroll to it
    if (targetSection) {
      // Calculate position to move including offset
      const offset = 80;
      // Section top position + current view position - offset
      const targetPosition =
        targetSection.getBoundingClientRect().top + window.scrollY - offset;

      // Action
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  }, 500);
};
// function to replace the main contact btn's link
export const whatsAppTemplate = () => {
  const phoneNumber = '48792891607';
  const msgContact = `Hej! Piszę do Ciebie z yoganka.pl :)\n\nTu [imię] [Nazwisko]`;

  const linkContact = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    msgContact
  )}`;

  return linkContact;
};
export const assignPageCSSModifier = modifier => {
  const wrapper = document.body.querySelector('.wrapper');
  const newClass = `wrapper--${modifier}`;

  if (wrapper) {
    wrapper.classList.add(newClass);
  }
  return () => {
    // deleting on unmount
    if (wrapper) {
      wrapper.classList.remove(newClass);
    }
  };
};
