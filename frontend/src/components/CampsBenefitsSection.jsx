import Section from './Section.jsx';
import {BENEFITS_DATA} from '../DATA/CAMPS_BENEFITS_DATA.js';

function CampsBenefitsSection() {
	const classy = 'camps-benefits__';
	return (
		<Section
			classy='camps-benefits'
			header='Co Cię czeka?'>
			<main className='camps-benefits__bullets-container'>
				{BENEFITS_DATA.map((benefit, index) => {
					return (
						<div
							className={`${classy}bullet-container`}
							tabIndex='0'
							key={index}>
							<article
								key={benefit.title}
								className={`${classy}bullet`}>
								<aside className={`${classy}symbol-container`}>
									<span className={`material-symbols-outlined ${classy}symbol`}>
										{benefit.symbol}
									</span>
								</aside>
								<header className={`${classy}bullet-header`}>
									{benefit.title}
								</header>
								<p className={`${classy}bullet-p`}>{benefit.text}</p>
							</article>
						</div>
					);
				})}
			</main>
		</Section>
	);
}

export default CampsBenefitsSection;
