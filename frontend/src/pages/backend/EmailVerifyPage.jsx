import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EmailVerifyPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  //   after loading the page - check the token
  useEffect(() => {
    fetch(`/api/login-pass/email-token/${token}`)
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
    <main className='login-box'>
      <section className={'login'}>
        <p className='form__title'>⏳ Weryfikujemy Twój adres e-mail...</p>
      </section>
    </main>
  );
}

export default EmailVerifyPage;
