import { Helmet } from 'react-helmet';
import FloatingBtns from '../../components/backend/FloatingBtns.jsx';
import Footer from '../../components/frontend/Footer.jsx';
import Burger from '../../components/frontend/navigation/Burger.jsx';
import Nav from '../../components/frontend/navigation/Nav.jsx';

function ErrorPage() {
  return (
    <>
      <Helmet>
        <html lang='pl' />
        <title>Błąd - Strona nie została znaleziona</title>
        <meta name='robots' content='noindex, nofollow' />
      </Helmet>

      <div className='wrapper'>
        <Burger />
        <Nav />
        <div className='error'>
          <h1 className='error__title'>Ups... Nie mamy takiej strony :)</h1>
        </div>
        <Footer />
        <FloatingBtns />
      </div>
    </>
  );
}

export default ErrorPage;
