import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import SymbolOrIcon from '../common/SymbolOrIcon';

function FloatingBtnCookie({ side, cookieId }) {
  const cookieKey = `floating_cookie_closed_${cookieId}`;

  const [cookies, setCookies] = useState({
    open: false,
    delete: false,
  });

  useEffect(() => {
    const closed = Cookies.get(cookieKey) === 'true';
    if (closed) {
      setCookies(prev => ({ ...prev, delete: true }));
    }
  }, [cookieKey]);

  function handleCookiesOpen() {
    setCookies(prev => ({
      ...prev,
      open: !prev.open,
    }));
  }
  function handleCookiesClose() {
    setCookies(prev => ({
      ...prev,
      delete: true,
    }));
    Cookies.set(cookieKey, 'true', { expires: 365 });
  }

  const singleCookieBtnClass = `pop-ups__single${
    !side ? ` pop-ups__single--left` : ''
  } pop-ups__single--cookies`;

  const cookieBtnSymbolExtraClass = `pop-ups__icon${
    !side ? ` pop-ups__icon--left` : ''
  }`;
  const cookieBtnIconClass = `fas fa-times`;
  const cookieBtnIconExtraClass = `pop-ups__icon${
    !side ? ` pop-ups__icon--left` : ''
  } pop-ups__icon--body-close${!side ? ` pop-ups__icon--body-close-left` : ''}`;

  const cookieBtnMsgBoxClass = `pop-ups__body${
    !side ? ` pop-ups__body--left` : ''
  }`;
  const cookieBtnMsgContentClass = `pop-ups__body--msg${
    !side ? ` pop-ups__body--msg-left` : ''
  }`;

  return (
    <>
      {!cookies.delete && (
        <a
          // --cookies  required for scss opening on :focus
          className={singleCookieBtnClass}
          href='#'
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            handleCookiesOpen();
          }}
          tabIndex='0'
        >
          <SymbolOrIcon
            specifier='cookie'
            classModifier={side ? '' : 'left'}
            extraClass={cookieBtnSymbolExtraClass}
          />

          <div className={cookieBtnMsgBoxClass}>
            {cookies.open && (
              <div className={cookieBtnMsgContentClass}>
                Używamy tylko niezbędnych plików cookie.
              </div>
            )}

            <SymbolOrIcon
              onClick={e => {
                handleCookiesClose();
                e.stopPropagation();
              }}
              specifier={cookieBtnIconClass}
              type='ICON'
              classModifier={side ? '' : 'left'}
              extraClass={cookieBtnIconExtraClass}
            />
          </div>
        </a>
      )}
    </>
  );
}

export default FloatingBtnCookie;
