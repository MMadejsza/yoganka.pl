import {useEffect, useState} from 'react';

const classy = 'footer';
// // newsletter close
// document.querySelector('.footer__pop-up-btn--gift').addEventListener('click', (e) => {
// 	if (e.target.parentNode.classList.contains('footer__pop-up-btn--gift')) {
// 		e.target.style.opacity = 0;
// 		e.target.parentNode.style.opacity = 0;
// 		setTimeout(() => {
// 			e.target.parentNode.remove();
// 			e.target.remove();
// 		}, 800);
// 	} else {
// 		e.target.style.opacity = 0;
// 		setTimeout(() => {
// 			e.target.remove();
// 		}, 800);
// 	}
// });

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

	function handleClickNewsletter() {
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

	function handleCookiesClose(e) {
		e.preventDefault();

		setCookies({
			delete: true,
		});
	}

	return (
		<div
			className={`${classy}__pop-ups`}
			tabIndex='0'>
			{isNewsletterScriptReady && (
				<a
					className={`${classy}__pop-up-btn ${classy}__pop-up-btn--gift ml-onclick-form`}
					href='#'
					onClick={handleClickNewsletter}>
					<i className={`${classy}__pop-up-icon fas fa-gift`}></i>
				</a>
			)}

			{!cookies.delete && (
				<a
					className={`${classy}__pop-up-btn ${classy}__pop-up-btn--cookies`}
					href='#'>
					<i className={`${classy}__pop-up-icon fas fa-cookie-bite`}></i>
					<div className={`${classy}__cookie-pop-up`}>
						<div className={`${classy}__cookie-msg`}>
							Używamy tylko niezbędnych plików cookie.
						</div>
						<div className={`${classy}__cookie-close`}>
							<i
								onClick={(e) => handleCookiesClose(e)}
								className={`fas fa-times ${classy}__cookie-close-icon`}></i>
						</div>
					</div>
				</a>
			)}
		</div>
	);
}

export default FloatingPopUps;
