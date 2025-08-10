import LoginForm from '../../components/backend/LoginForm.jsx';
import Seo from '../../components/frontend/Seo.jsx';

function LoginPage() {
  return (
    <>
      <Seo
        title='Zaloguj się – Yoganka'
        description={null}
        canonical={null}
        robots='noindex, nofollow'
      />
      <LoginForm />
    </>
  );
}

export default LoginPage;
