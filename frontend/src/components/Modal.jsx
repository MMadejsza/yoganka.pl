import React, {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {Helmet} from 'react-helmet';
import GlideContainer from './glide/GlideContainer.jsx';
import CampGlance from './ModalGlance.jsx';
import CampDay from './camps/CampDay.jsx';
import ModalList from './ModalList.jsx';

function Modal({visited, tile, singleImg, onClose, today}) {
	const [isVisible, setIsVisible] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const {type, modal, gallerySize, galleryPath, fileName, extraClass} = tile;
	let isUpToDate = tile.date > today;
	let isCamp = type === 'camp';
	let isEvent = type === 'event';

	useEffect(() => {
		if (visited) {
			const delay = setTimeout(() => setIsVisible(true), 5);
			return () => clearTimeout(delay);
		}
	}, [visited]);

	useEffect(() => {
		if (isVisible) {
			document.body.classList.add('stopScroll');
		} else {
			document.body.classList.remove('stopScroll');
		}

		return () => {
			document.body.classList.remove('stopScroll');
		};
	}, [isVisible]);

	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			setIsVisible(false); // hide modal but let animate
			onClose();
		}, 400); // delete modal
	};

	const dynamicClass = (baseClass, extraClass) =>
		`${baseClass} ${extraClass ? `${baseClass}--${extraClass}` : ''}`;

	const renderSummaryLists = () => {
		return (
			<section className='modal__summary'>
				{Object.entries(modal.summary).map(([listType, content], index) => (
					<ModalList
						key={index}
						listType={listType}
						data={content}
					/>
				))}
			</section>
		);
	};

	const renderFooter = () => {
		return (
			isUpToDate && (
				<footer className='modal__user-action'>
					{modal.btnsContent.map((btn, index) => (
						<a
							key={index}
							href={btn.link}
							target='_blank'
							title={btn.title}
							className={`modal__btn`}>
							{btn.icon ? (
								<i
									className={`${btn.icon} nav__icon`}
									style={{paddingRight: '1rem'}}></i>
							) : btn.symbol ? (
								<span className='material-symbols-rounded nav__icon'>
									{btn.symbol}
								</span>
							) : null}
							{btn.text}
						</a>
					))}
				</footer>
			)
		);
	};

	const metaDescription =
		tile.type == 'camp'
			? `Dowiedz się wszystkiego o kobiecym wyjeździe z jogą do: ${tile.front.location}.`
			: `Dowiedz się wszystkiego o wydarzeniu ${tile.name}. Miejsce: ${tile.front.location}.`;
	const metaTitle =
		tile.type == 'camp'
			? `${tile.name} - Kobiecy Wyjazd z jogą`
			: `${tile.name} - Wydarzenie z Yoganką`;
	const canonicalTagUrl =
		tile.type == 'camp'
			? `https://yoganka.pl/wyjazdy/${tile.link} `
			: `https://yoganka.pl/wydarzenia/${tile.link}`;
	// const metaImgSpecifier = tile == 'camp' ? 'camps' : 'events';
	// const metaImgUrl = `https://yoganka.pl/imgs/offer/${metaImgSpecifier}/${tile.fileName}/front/480_${tile.fileName}_0.jpg`;
	return createPortal(
		<>
			<Helmet>
				<title>{metaTitle}</title>

				<meta
					name='description'
					content={metaDescription}
				/>
				<meta
					name='robots'
					content='index, follow'
				/>
				<meta
					property='og:title'
					content={metaTitle}
				/>
				<meta
					property='og:description'
					content={`Dowiedz się wszystkiego o wyjeździe do: ${tile.front.location}. Kliknij teraz!`}
				/>
				{/* <meta
					property='og:image'
					content={metaImgUrl}
				/> */}
				<meta
					property='og:url'
					content={`https://yoganka.pl/${
						tile.type == 'camp' ? 'wyjazdy' : 'wydarzenia'
					}/${tile.link}`}
				/>
				<meta
					property='og:type'
					content='website'
				/>
				<link
					rel='canonical'
					href={canonicalTagUrl}
				/>
			</Helmet>
			<div
				className={`modal__overlay ${isVisible ? 'visible' : ''}`}
				onClick={handleClose}
			/>
			<div
				className={`modal ${isClosing ? 'fade-out' : isVisible ? 'visible' : ''}`}
				onClick={(e) => e.stopPropagation()}>
				<div className='modal__x-btn'>
					<a
						className='modal__close-btn'
						onClick={handleClose}>
						<i className='fa-solid fa-xmark modal__icon'></i>
					</a>
				</div>

				<div
					className='modal__modal-body modal__modal-body--offer '
					onClick={(e) => e.stopPropagation()}>
					{gallerySize ? (
						<GlideContainer
							placement={'comp'}
							glideConfig={{
								type: 'carousel',
								focusAt: 'center',
								perView: 2,
								gap: 20,
								animationDuration: 800,
							}}
							glideBreakpoints={{
								// <=
								1025: {perView: 1},
							}}
							type='photo'
							slides={{
								galleryPath: galleryPath,
								fileName: fileName,
								size: gallerySize,
							}}
						/>
					) : (
						singleImg
					)}
					{/* ${modal.fullDesc.length > 375 ? 'modal__full-desc--long-text' : ''} */}
					<section
						className={`modal__full-desc--${type} ${dynamicClass(
							'modal__full-desc',
							extraClass,
						)} modal__full-desc--long-text`}>
						{modal?.fullDescTitle && (
							<h3 className='modal__title'>{modal.fullDescTitle}</h3>
						)}
						<p className=' modal__full-desc modal__full-desc--content'>
							{modal.fullDesc}
						</p>
					</section>

					{isCamp && (
						<>
							<header className={`modal__header modal__full-desc--long-text`}>
								<CampGlance glance={modal.glance} />
							</header>

							{modal.plan.schedule.length > 0 && (
								<section className={dynamicClass('modal__desc', extraClass)}>
									<h3 className='modal__title'>{modal.plan.title}</h3>
									{modal.plan.schedule.map((day, index) => (
										<CampDay
											key={index}
											dayData={day}
										/>
									))}
								</section>
							)}

							{Object.keys(modal.summary).length > 0 && renderSummaryLists()}
						</>
					)}
					{isEvent && (
						<ModalList
							extraClass='event'
							listType={modal.program.listType}
							data={modal.program}
						/>
					)}
					{isUpToDate && modal.note && (
						<h2 className='modal__attention-note'>{modal.note}</h2>
					)}

					{modal.btnsContent?.length > 0 && renderFooter()}
				</div>
			</div>
		</>,
		document.getElementById('modal'),
	);
}

export default Modal;
