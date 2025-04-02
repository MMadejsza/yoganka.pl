import FloatingPopUps from '../../components/frontend/FloatingPopUps.jsx';
import Footer from '../../components/frontend/Footer.jsx';
import Burger from '../../components/frontend/navigation/Burger.jsx';
import Nav from '../../components/frontend/navigation/Nav.jsx';

function ErrorPage() {
  return (
    <div className='wrapper'>
      <Burger />
      <Nav />
      <div className='error'>
        <h1 className='error__title'>Ups... Nie mamy takiej strony :)</h1>
      </div>
      <Footer />
      <FloatingPopUps />
    </div>
  );
}

export default ErrorPage;
