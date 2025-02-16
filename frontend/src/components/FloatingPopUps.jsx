import {useEffect, useState} from 'react';

function FloatingPopUps() {
	const [cookies, setCookies] = useState({
		delete: false,
	});

	const [isNewsletterScriptReady, setIsNewsletterScriptReady] = useState(false);

	useEffect(() => {
		// check if script is already inserted (if other components used it)
		const existingScript = document.querySelector(
			'script[src="https://assets.mailerlite.com/js/universal.js"]',
		);
		// if not - launch it
		if (!existingScript) {
			const script = document.createElement('script');
			script.src = 'https://assets.mailerlite.com/js/universal.js';
			script.async = true;

			// when script tag loaded - fetch API function
			script.onload = () => {
				window.ml =
					window.ml ||
					function () {
						(window.ml.q = window.ml.q || []).push(arguments);
					};
				// apply account identifier
				window.ml('account', '1112086');
				setIsNewsletterScriptReady(true);
			};
			// debugging
			script.onerror = () => {
				console.error('Failed to load MailerLite script.');
			};

			// append ready script component
			document.body.appendChild(script);
		}
		// console.log('MailerLite script already exists.');

		// if script already exists, double check for ml function required by API to work
		// if not:
		if (typeof window.ml !== 'function') {
			window.ml =
				window.ml ||
				function () {
					(window.ml.q = window.ml.q || []).push(arguments);
				};
			window.ml('account', '1112086');
			setIsNewsletterScriptReady(true);
		}
	}, []);

	function handleClickNewsletter(e) {
		e.preventDefault();
		if (isNewsletterScriptReady && typeof window.ml === 'function') {
			// if API function is ready to use - use it to show modal
			window.ml('show', 'jiW5Nb', true);
			// update state to hide initial button (conditional rendering)
			setTimeout(() => {
				setIsNewsletterScriptReady(false);
			}, 800);
			// debugging
		} else {
			console.error('MailerLite function (ml) is not available.');
		}
	}

	function handleCookiesClose() {
		setCookies({
			delete: true,
		});
	}

	return (
		<div
			className={`pop-ups`}
			tabIndex='0'>
			{isNewsletterScriptReady && (
				<a
					// --gift  required for scss opening on :focus
					className={`pop-ups__single pop-ups__single--gift ml-onclick-form`}
					href='#'
					onClick={handleClickNewsletter}>
					<span className='material-symbols-rounded pop-ups__icon'>mail</span>
				</a>
			)}

			{!cookies.delete && (
				<a
					// --cookies  required for scss opening on :focus
					className={`pop-ups__single pop-ups__single--cookies`}
					href='#'
					onClick={(e) => e.preventDefault()}
					tabIndex='0'>
					{/* <i className={`pop-ups__icon fas fa-cookie-bite fa-bounce`} /> */}
					<span className='material-symbols-rounded pop-ups__icon'>cookie</span>
					<div className={`pop-ups__body`}>
						<div className={`pop-ups__body--msg`}>
							Używamy tylko niezbędnych plików cookie.
						</div>
						<i
							onClick={() => handleCookiesClose()}
							className={`fas fa-times pop-ups__icon pop-ups__icon--body-close`}
						/>
					</div>
				</a>
			)}
		</div>
	);
}

export default FloatingPopUps;
