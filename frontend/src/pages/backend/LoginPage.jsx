import { Helmet } from 'react-helmet';
import LoginFrom from '../../components/backend/LoginForm.jsx';
function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Yoganka - Zaloguj się</title>
        <link rel='canonical' href='https://yoganka.pl/zaloguj-sie' />
      </Helmet>
      <LoginFrom />
    </>
  );
}

export default LoginPage;
