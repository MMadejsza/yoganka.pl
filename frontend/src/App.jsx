import React from 'react';
import Burger from './components/nav/Burger.jsx';

function App() {
	return (
		<div className='wrapper'>
			<Burger></Burger>

			<nav class='nav'>
				<ul class='nav__list'>
					<li class='nav__item'>
						<a
							class='nav__link'
							href='#zajecia'>
							<i class='far fa-clock nav__icon'></i>Zajęcia
						</a>
					</li>
					<li class='nav__item'>
						<a
							class='nav__link'
							href='#wyjazdy'>
							<i class='fas fa-cloud-moon nav__icon'></i>Wyjazdy
						</a>
					</li>
					<li class='nav__item'>
						<a
							class='nav__link'
							href='.offer-type--events'>
							<i class='fas fa-calendar-check nav__icon'></i>Wydarzenia
						</a>
					</li>

					<li class='nav__item'>
						<a
							class='nav__link'
							href='.certificates'>
							<i class='fa-solid fa-certificate nav__icon'></i>Certyfikaty
						</a>
					</li>
					<li class='nav__item'>
						<a
							class='nav__link'
							href='.footer__socials'>
							<i class='fa-solid fa-circle-info nav__icon'></i>Kontakt
						</a>
					</li>
				</ul>
				<div class='nav__logo-container'>
					<img
						class='nav__logo'
						src='imgs/logo/logo_1.svg'
						loading='lazy'
					/>
				</div>
			</nav>
		</div>
	);
}

export default App;
