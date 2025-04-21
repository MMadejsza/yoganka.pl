import { useState } from 'react';
import SymbolOrIcon from '../common/SymbolOrIcon';

function FloatingBtnCookie({ side }) {
  const [cookies, setCookies] = useState({
    delete: false,
  });

  function handleCookiesClose() {
    setCookies({
      delete: true,
    });
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
          onClick={e => e.preventDefault()}
          tabIndex='0'
        >
          <SymbolOrIcon
            specifier='cookie'
            classModifier={side ? '' : 'left'}
            extraClass={cookieBtnSymbolExtraClass}
          />

          <div className={cookieBtnMsgBoxClass}>
            <div className={cookieBtnMsgContentClass}>
              Używamy tylko niezbędnych plików cookie.
            </div>

            <SymbolOrIcon
              onClick={() => handleCookiesClose()}
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
