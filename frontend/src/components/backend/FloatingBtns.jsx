import { useLocation } from 'react-router-dom';
import FloatingBtnCookie from '../frontend/FloatingBtnCookie.jsx';
import FloatingBtnMailerLite from '../frontend/FloatingBtnMailerLite.jsx';

function FloatingBtns({ side, children }) {
  const location = useLocation();
  const isAdminPanel = location.pathname.includes('admin-console');

  const content = (
    <div className={`pop-ups${!side ? ` pop-ups--left` : ''}`} tabIndex='0'>
      {!isAdminPanel && (
        <>
          <FloatingBtnMailerLite cookieId={'newsletter-info'} />
          <FloatingBtnCookie side={side} cookieId={'cookies-info'} />
        </>
      )}
      {children}
    </div>
  );

  return content;
}

export default FloatingBtns;
