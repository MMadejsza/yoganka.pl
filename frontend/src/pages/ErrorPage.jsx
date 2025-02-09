import Burger from '../components/nav/Burger.jsx';
import Nav from '../components/nav/Nav.jsx';
import Footer from '../components/Footer.jsx';
import FloatingPopUps from '../components/FloatingPopUps.jsx';

function ErrorPage() {
	const handleSubmit = async (e, type) => {
		e.preventDefault();
		const title = e.target.title.value;
		const content = type == 'admin' ? 'application/json' : 'text/html';
		try {
			const response = await fetch(`/api/${title}`, {
				method: 'POST',
				headers: {'Content-Type': content},
				body: type == 'admin' ? JSON.stringify({title}) : null,
			});
			console.log('Response:', response);

			const contentType = response.headers.get('Content-Type');

			if (contentType && contentType.includes('application/json')) {
				const data = await response.json();
				console.log('✅ JSON Response:', data);
			} else {
				const text = await response.text();
				console.log('📄 HTML Response:', text);

				document.body.innerHTML = text;
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
					onSubmit={(e) => handleSubmit(e, 'admin')}
					style={{marginTop: '10rem'}}
					autoComplete='on'>
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
