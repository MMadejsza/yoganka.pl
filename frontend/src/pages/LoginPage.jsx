import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import LoginFrom from '../components/login/LoginForm';
function LoginPage() {
  // From EmailVerification page:
  const [searchParams] = useSearchParams();
  const verified = searchParams.get('verified');
  const successMsg =
    verified === '1' ? 'Twój adres e-mail został potwierdzony!' : null;
  const errorMsg =
    verified === '0' ? 'Weryfikacja e-maila nie powiodła się.' : null;

  return (
    <>
      <Helmet>
        <title>Yoganka - Zaloguj się</title>
        <link rel='canonical' href='https://yoganka.pl/zaloguj-sie' />
      </Helmet>
      <main className='loginBox'>
        <LoginFrom successMsg={successMsg} errorMsg={errorMsg} />
      </main>
    </>
  );
}

export default LoginPage;
