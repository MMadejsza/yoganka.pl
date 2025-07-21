import { Helmet } from 'react-helmet';
import LoginForm from '../../components/backend/LoginForm.jsx';
function LoginPage() {
  return (
    <>
      <Helmet>
        <html lang='pl' />
        <title>Zaloguj się – Yoganka</title>
        <meta name='robots' content='noindex, nofollow' />
      </Helmet>
      <LoginForm />
    </>
  );
}

export default LoginPage;
