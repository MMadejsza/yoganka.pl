import React, {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import GlideContainer from './glide/GlideContainer.jsx';
import CampGlance from './ModalGlance.jsx';
import CampDay from './CampDay.jsx';
import ModalList from './ModalList.jsx';

function Modal({visited, tile, singleImg, onClose, today}) {
	const [isVisible, setIsVisible] = useState(false);

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
	const handleClose = () => {
		setIsVisible(false); // hide modal but let animate
		setTimeout(() => onClose(), 300); // delete modal
	};
	const dynamicClass = (baseClass, extraClass) =>
		`${baseClass} ${extraClass ? `${baseClass}--${extraClass}` : ''}`;

	const renderSummaryLists = () => {
		return Object.entries(modal.summary).map(([listType, content], index) => (
			<ModalList
				key={index}
				listType={listType}
				data={content}
			/>
		));
	};
	const renderFooter = () =>
		isUpToDate && (
			<footer className='modal__user-action'>
				<a
					href={modal.formLink}
					className='modal__btn modal__sign-up'
					target='_blank'
					rel='noopener noreferrer'>
					Dołączam
				</a>
			</footer>
		);

	return createPortal(
		<div className={`modal ${isVisible ? 'visible' : ''}`}>
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
					)}`}>
					{modal.fullDescTitle && <h3 className='modal__title'>{modal.fullDescTitle}</h3>}
					<p className='modal__full-desc-content'>{modal.fullDesc}</p>
				</section>

				{isCamp && (
					<>
						<header className={`modal__header`}>
							<CampGlance glance={modal.glance} />
						</header>
						<section className={dynamicClass('modal__desc', extraClass)}>
							<h3 className='modal__title'>{modal.plan.title}</h3>
							{modal.plan.schedule.map((day, index) => (
								<CampDay
									key={index}
									dayData={day}
								/>
							))}
						</section>
						{renderSummaryLists()}
					</>
				)}
				{isEvent && (
					<ModalList
						extraClass='event'
						listType='included'
						data={modal.program}
					/>
				)}
				{isUpToDate && <h2 className='modal__attention-note'>{modal.note}</h2>}

				{renderFooter()}
			</div>
		</div>,
		document.getElementById('modal'),
	);
}

export default Modal;
