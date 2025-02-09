import Burger from '../components/nav/Burger.jsx';
import Nav from '../components/nav/Nav.jsx';
import Footer from '../components/Footer.jsx';
import FloatingPopUps from '../components/FloatingPopUps.jsx';

const options = [
	{
		label: 'a all users', // And their settings
		path: 'admin/show-all-users',
	},
	{
		label: 'a all customers',
		path: 'admin/show-all-customers',
	},
	{
		label: 'a schedule',
		path: 'admin/show-all-schedule',
	},
	{
		label: 'a all feedbacks',
		path: 'admin/show-all-products',
	},
	{
		label: 'a all newsletters',
		path: 'admin/show-all-products',
	},
	{
		label: 'a all newsletters subs',
		path: 'admin/show-all-products',
	},
	{
		label: 'a all products',
		path: 'admin/show-all-products',
	},
];

function ErrorPage() {
	const handleSubmit = async (e, type) => {
		e.preventDefault();
		const val = e.target.selectOption.value;
		const content = type == 'admin' ? 'application/json' : 'text/html';
		try {
			const response = await fetch(`/api/${val}`, {
				method: 'POST',
				headers: {'Content-Type': content},
				body: type == 'admin' ? JSON.stringify({val}) : null,
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
					<select
						name='selectOption'
						style={{border: '1px solid black', marginTop: '1rem'}}>
						{options.map((option, index) => (
							<option
								key={index}
								value={option.path}>
								{option.label}
							</option>
						))}
					</select>
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
