import {Helmet} from 'react-helmet';
import LoginFrom from '../components/login/LoginForm';

function LoginPage() {
	return (
		<>
			<Helmet>
				<title>Yoganka - Zaloguj się</title>
				<link
					rel='canonical'
					href='https://yoganka.pl/zaloguj-sie'
				/>
			</Helmet>
			<main className='loginBox'>
				<LoginFrom type='login' />
				<LoginFrom
					type='register'
					regQuestion={true}
				/>
			</main>
		</>
	);
}

export default LoginPage;
