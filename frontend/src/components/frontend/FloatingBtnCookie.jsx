import { useState } from 'react';

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

  const cookieBtnSymbolClass = `material-symbols-rounded pop-ups__icon${
    !side ? ` pop-ups__icon--left` : ''
  }`;
  const cookieBtnIconClass = `fas fa-times pop-ups__icon${
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
          {/* <i className={`pop-ups__icon fas fa-cookie-bite fa-bounce`} /> */}
          <span className={cookieBtnSymbolClass}>cookie</span>

          <div className={cookieBtnMsgBoxClass}>
            <div className={cookieBtnMsgContentClass}>
              Używamy tylko niezbędnych plików cookie.
            </div>
            <i
              onClick={() => handleCookiesClose()}
              className={cookieBtnIconClass}
            />
          </div>
        </a>
      )}
    </>
  );
}

export default FloatingBtnCookie;
