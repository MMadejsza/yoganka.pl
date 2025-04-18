import { useState } from 'react';

function FloatingBtnCookie() {
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
      className={`pop-ups__single pop-ups__single--cookies`}
      href='#'
      onClick={e => e.preventDefault()}
      tabIndex='0'
    >
      {/* <i className={`pop-ups__icon fas fa-cookie-bite fa-bounce`} /> */}
      <span className='material-symbols-rounded pop-ups__icon'>cookie</span>
      <div className={`pop-ups__body`}>
        <div className={`pop-ups__body--msg`}>
          Używamy tylko niezbędnych plików cookie.
        </div>
        <i
          onClick={() => handleCookiesClose()}
          className={`fas fa-times pop-ups__icon pop-ups__icon--body-close`}
        />
      </div>
    </a>
  );

  return cookieBtn;
}

export default FloatingBtnCookie;
