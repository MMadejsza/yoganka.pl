import Section from '../Section.jsx';

function B2BIntroSection() {
	return (
		<Section
			classy='camps-intro'
			header={`Joga dla firm`}>
			<article className='about__bio--content camps-intro__welcome-desc'>
				<p className='about__bio--description'>Twój biznes musi się ruszać!</p>
				<p className='about__bio--description'>
					W dynamicznym środowisku pracy joga staje się nieocenionym wsparciem dla
					organizacji, które chcą budować zdrową, zmotywowaną i odporną na stres kulturę
					pracy. Proponuję zajęcia dostosowane do potrzeb Twojego zespołu, które pomogą
					zwiększyć efektywność, poprawić samopoczucie pracowników i zminimalizować skutki
					przeciążenia pracą.
				</p>
			</article>
		</Section>
	);
}

export default B2BIntroSection;
