import Section from './Section.jsx';
import {BENEFITS_DATA} from '../DATA/CAMPS_BENEFITS_DATA.js';

function CampsBenefitsSection({isMobile}) {
	return (
		<Section
			classy='camps-benefits'
			header='Co Cię czeka?'>
			<main className='camps-benefits__bullets-container'>
				{BENEFITS_DATA.map((benefit) => {
					return (
						<article
							key={benefit.title}
							className='camps-benefits__bullet'>
							<aside className='camps-benefits__symbol-container'>
								<span className='material-symbols-outlined camps-benefits__symbol'>
									{benefit.symbol}
								</span>
							</aside>
							<header className='camps-benefits__bullet-header'>
								{benefit.title}
							</header>
							<p className='camps-benefits__bullet-p'>{benefit.text}</p>
						</article>
					);
				})}
			</main>
		</Section>
	);
}

export default CampsBenefitsSection;
