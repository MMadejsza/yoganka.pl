import { useLocation } from 'react-router-dom';
import FloatingBtnCookie from '../frontend/FloatingBtnCookie.jsx';
import FloatingBtnMailerLite from '../frontend/FloatingBtnMailerLite.jsx';

function FloatingBtns({ children }) {
  const location = useLocation();
  const isAdminPanel = location.pathname.includes('admin-console');

  const content = (
    <div className={`pop-ups`} tabIndex='0'>
      {!isAdminPanel && (
        <>
          <FloatingBtnMailerLite />
          <FloatingBtnCookie />
        </>
      )}
      {children}
    </div>
  );

  return content;
}

export default FloatingBtns;
