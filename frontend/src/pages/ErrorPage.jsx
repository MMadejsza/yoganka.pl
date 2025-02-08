import Burger from '../components/nav/Burger.jsx';
import Nav from '../components/nav/Nav.jsx';
import Footer from '../components/Footer.jsx';
import FloatingPopUps from '../components/FloatingPopUps.jsx';

function ErrorPage() {
	const handleSubmit = async (e) => {
		e.preventDefault();
		const title = e.target.title.value;

		try {
			const response = await fetch('/api/ex', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({title}),
			});
			console.log('Response:', response);

			const data = await response.json();
			console.log('Send!', data);

			if (data.redirect) {
				window.location.href = data.redirect;
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<div className='wrapper'>
			<Burger />
			<Nav />
			<div className='error'>
				<h1 className='error__title'>Ups... Nie mamy takiej strony :)</h1>
				<form
					onSubmit={handleSubmit}
					style={{marginTop: '10rem'}}>
					<input
						type='text'
						name='title'
						style={{border: '1px solid black'}}
					/>
					<button type='submit'>Submit</button>
				</form>
				;
			</div>
			<Footer />
			<FloatingPopUps />
		</div>
	);
}

export default ErrorPage;
