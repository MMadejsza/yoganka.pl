import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function EmailVerifyPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  //   after loading the page - check the token
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/login-pass/email-token/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.confirmation === 1) {
          // pass res state to the login page to display feedback box up there
          navigate('/login?verified=1');
        } else {
          navigate('/login?verified=0');
        }
      })
      .catch(() => navigate('/login?verified=0'));
  }, [token, navigate]);

  // Msg for the meanwhile before redirection
  return (
    <>
      <Helmet>
        <meta name='robots' content='noindex, nofollow' />
      </Helmet>

      <main className='login-box'>
        <section className={'login'}>
          <p className='form__title'>⏳ Weryfikujemy Twój adres e-mail...</p>
        </section>
      </main>
    </>
  );
}

export default EmailVerifyPage;
