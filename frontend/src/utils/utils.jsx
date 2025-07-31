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
export const btnsMap = {
  instagram: {
    type: 'ICON',
    content: 'fa-brands fa-instagram',
    text: ``,
    title: 'Yoganka – joga, wyjazdy i inspiracje na Instagramie',
    linkPrefix: ``,
    qrTitle: 'Zeskanuj kod i otwórz Instagram Yoganki – oddech w kadrach',
    qrAlt:
      'Kod QR do profilu Yoganki na Instagramie – joga i spokój na wyciągnięcie ręki',
  },
  facebook: {
    type: 'ICON',
    content: 'fa-brands fa-square-facebook',
    text: ``,
    title: 'Yoganka – joga i wydarzenia na Facebooku',
    linkPrefix: ``,
    qrTitle:
      'Zeskanuj kod i otwórz Facebook Yoganki – znajdź przestrzeń dla siebie',
    qrAlt: 'Kod QR do profilu Yoganki na Facebooku – spotkajmy się przy macie',
  },
  whatsapp: {
    type: 'ICON',
    content: 'fab fa-whatsapp',
    text: `whatsapp`,
    title: 'Napisz do Yoganki na WhatsAppie',
    linkPrefix: `https://wa.me/`,
    qrTitle:
      'Zeskanuj kod i rozpocznij rozmowę z Yoganką – spokojnie, bez pośpiechu',
    qrAlt: 'Kod QR do czatu z Yoganką w WhatsAppie – pytaj, oddychaj, działaj',
  },
  phone: {
    type: 'ICON',
    content: 'fa-solid fa-phone',
    text: `zadzwoń`,
    title: 'Zadzwoń do Yoganki',
    linkPrefix: `tel:`,
    qrTitle: 'Zeskanuj kod, aby zadzwonić do Yoganki – kontakt pełen uważności',
    qrAlt: 'Kod QR do rozmowy telefonicznej z Yoganką – usłysz głos spokoju',
  },
  mail: {
    type: 'ICON',
    content: 'fa-solid fa-envelope',
    text: `Napisz`,
    title: 'Napisz do Yoganki',
    linkPrefix: `mailto:`,
    qrTitle: 'Zeskanuj kod i wyślij wiadomość – joga zaczyna się od rozmowy',
    qrAlt: 'Kod QR do e-maila do Yoganki – kilka słów, wiele harmonii',
  },
  schedule: {
    type: 'SYMBOL',
    content: 'calendar_month',
    title: `Zobacz grafik Yoganki`,
    linkPrefix: `/grafik`,
  },
  scheduleRecord: {
    type: 'SYMBOL',
    content: 'event',
    text: `rezerwuję`,
    title: 'Zobacz najbliższy termin zajęć',
    linkPrefix: `/grafik/`,
  },
};
