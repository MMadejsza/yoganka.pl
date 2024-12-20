import React, {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import GlideContainer from './glide/GlideContainer.jsx';
import CampGlance from './ModalGlance.jsx';
import CampDay from './CampDay.jsx';
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
							className={`modal__btn`}>
							{btn.text}
						</a>
					))}
				</footer>
			)
		);
	};

	return createPortal(
		<>
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
								360: {perView: 1},
								480: {perView: 1},
							}}
							slides={{
								type: 'photo',
								path: galleryPath,
								fileName: fileName,
								size: gallerySize,
							}}
						/>
					) : (
						singleImg
					)}

					<section
						className={`modal__full-desc--${type} ${dynamicClass(
							'modal__full-desc',
							extraClass,
						)} ${modal.fullDesc.length > 375 ? 'modal__full-desc--long-text' : ''}`}>
						{modal.fullDescTitle && (
							<h3 className='modal__title'>{modal.fullDescTitle}</h3>
						)}
						<p className=' modal__full-desc modal__full-desc--content'>
							{modal.fullDesc}
						</p>
					</section>

					{isCamp && (
						<>
							<header
								className={`modal__header ${
									modal.fullDesc.length > 375 ? 'modal__full-desc--long-text' : ''
								}`}>
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
							listType='included'
							data={modal.program}
						/>
					)}
					{isUpToDate && modal.note && (
						<h2 className='modal__attention-note'>{modal.note}</h2>
					)}

					{modal.btnsContent.length > 0 && renderFooter()}
				</div>
			</div>
		</>,
		document.getElementById('modal'),
	);
}

export default Modal;
