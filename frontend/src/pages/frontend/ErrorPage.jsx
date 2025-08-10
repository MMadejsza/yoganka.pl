import FloatingBtns from '../../components/backend/FloatingBtns.jsx';
import Footer from '../../components/frontend/Footer.jsx';
import Burger from '../../components/frontend/navigation/Burger.jsx';
import Nav from '../../components/frontend/navigation/Nav.jsx';
import Seo from '../../components/frontend/Seo.jsx';

function ErrorPage() {
  return (
    <>
      <Seo
        title='Błąd - Strona nie została znaleziona'
        description={null}
        canonical={null}
        robots='noindex, nofollow'
      />

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
