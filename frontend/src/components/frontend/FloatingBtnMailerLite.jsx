import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import SymbolOrIcon from '../common/SymbolOrIcon';

function FloatingBtnMailerLite({ cookieId }) {
  const cookieKey = `floating_cookie_closed_${cookieId}`;

  const [wasClosed, setWasClosed] = useState(false);
  const [isNewsletterScriptReady, setIsNewsletterScriptReady] = useState(false);

  useEffect(() => {
    if (Cookies.get(cookieKey) === 'true') {
      setWasClosed(true);
    }

    // check if script is already inserted (if other components used it)
    const existingScript = document.querySelector(
      'script[src="https://assets.mailerlite.com/js/universal.js"]'
    );
    // if not - launch it
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://assets.mailerlite.com/js/universal.js';
      script.async = true;

      // when script tag loaded - fetch API function
      script.onload = () => {
        window.ml =
          window.ml ||
          function () {
            (window.ml.q = window.ml.q || []).push(arguments);
          };
        // apply account identifier
        window.ml('account', '1112086');
        setIsNewsletterScriptReady(true);
      };
      // debugging
      script.onerror = () => {
        console.error('Failed to load MailerLite script.');
      };

      // append ready script component
      document.body.appendChild(script);
    }
    // console.log('MailerLite script already exists.');

    // if script already exists, double check for ml function required by API to work
    // if not:
    if (typeof window.ml !== 'function') {
      window.ml =
        window.ml ||
        function () {
          (window.ml.q = window.ml.q || []).push(arguments);
        };
      window.ml('account', '1112086');
      setIsNewsletterScriptReady(true);
    }
  }, [cookieKey]);

  function handleClickNewsletter(e) {
    e.preventDefault();
    if (isNewsletterScriptReady && typeof window.ml === 'function') {
      // if API function is ready to use - use it to show modal
      window.ml('show', 'jiW5Nb', true);
      // update state to hide initial button (conditional rendering)
      setTimeout(() => {
        setIsNewsletterScriptReady(false);
        setWasClosed(true);
        Cookies.set(cookieKey, 'true', { expires: 365 });
      }, 800);
      // debugging
    } else {
      console.error('MailerLite function (ml) is not available.');
    }
  }

  if (wasClosed) return null;

  const mailerLiteCookie = isNewsletterScriptReady && (
    <a
      // --gift  required for scss opening on :focus
      className={`pop-ups__single pop-ups__single--gift ml-onclick-form`}
      href='#'
      onClick={handleClickNewsletter}
    >
      <SymbolOrIcon specifier={'mail'} extraClass={'pop-ups__icon'} />
    </a>
  );

  return mailerLiteCookie;
}

export default FloatingBtnMailerLite;
