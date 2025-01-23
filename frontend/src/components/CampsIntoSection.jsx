import Section from './Section.jsx';

function CampsIntoSection({isMobile}) {
	return (
		<Section
			classy='camps-intro'
			header='Kobiece Wyjazdy Jogowe'>
			<article className='about__bio--content camps-intro__welcome-desc'>
				<p>
					Zapraszam Cię na moje autorskie, rozwojowe weekendy z jogą w roli głównej. Campy
					są odpowiedzią na twoje potrzeby holistycznego projektu, który całościowo zadba
					o Twoje samopoczucie. To nie tylko ćwiczenia fizyczne ale również przestrzeń na
					refleksję, przywracanie równowagi, budowanie uważności oraz rozwijanie
					samoświadomości. Wrócisz z nową perspektywą i energią do działania. Miejsca, w
					których mieszkamy są starannie wyselekcjonowane aby wspierały proces
					regeneracji.
				</p>
				<p>
					Poza jogą, medytacją czeka na Ciebie warsztat kreatywny/rozwojowy, a to wszystko
					w otoczeniu kojącej natury.
				</p>
				<p>
					Na każdy wyjazd obowiązuje rezerwacja poprzez formularz oraz przedpłata wskazana
					w ofercie konkretnego campu. Liczba miejsc jest ograniczona, aby zadbać o Twój
					komfort przebywania oraz praktykowania.
				</p>
				<p>Do błogiego zobaczenia!</p>
			</article>
		</Section>
	);
}

export default CampsIntoSection;
