import Section from '../Section.jsx';
import {TYPES} from '../../DATA/B2B_DATA.js';

function B2BBenefitsSection() {
	const classy = 'camps-benefits__';
	return (
		<Section
			classy='camps-benefits'
			header='ZORGANIZUJĘ JAKO:'>
			<main className='camps-benefits__bullets-container'>
				{TYPES.map((benefit, index) => {
					return (
						<div
							className={`${classy}bullet-container types__bullet-container`}
							tabIndex='0'
							key={index}>
							<article
								key={benefit.title}
								className={`${classy}bullet`}>
								<aside className={`${classy}symbol-container`}>
									<span className={`material-symbols-rounded ${classy}symbol`}>
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

export default B2BBenefitsSection;
