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

  const cookieBtn = !cookies.delete && (
    <a
      // --cookies  required for scss opening on :focus
      className={`pop-ups__single${
        !side ? ` pop-ups__single--left` : ''
      } pop-ups__single--cookies`}
      href='#'
      onClick={e => e.preventDefault()}
      tabIndex='0'
    >
      {/* <i className={`pop-ups__icon fas fa-cookie-bite fa-bounce`} /> */}
      <span
        className={`material-symbols-rounded pop-ups__icon${
          !side ? ` pop-ups__icon--left` : ''
        }`}
      >
        cookie
      </span>
      <div className={`pop-ups__body${!side ? ` pop-ups__body--left` : ''}`}>
        <div
          className={`pop-ups__body--msg${
            !side ? ` pop-ups__body--msg-left` : ''
          }`}
        >
          <span
            className={`pop-ups__msg-content${
              !side ? ` pop-ups__msg-content---left` : ''
            }`}
          >
            Używamy tylko niezbędnych plików cookie.
          </span>
        </div>
        <i
          onClick={() => handleCookiesClose()}
          className={`fas fa-times pop-ups__icon${
            !side ? ` pop-ups__icon--left` : ''
          } pop-ups__icon--body-close${
            !side ? ` pop-ups__icon--body-close-left` : ''
          }`}
        />
      </div>
    </a>
  );

  return cookieBtn;
}

export default FloatingBtnCookie;
