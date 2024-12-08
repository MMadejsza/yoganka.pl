import {createPortal} from 'react-dom';
import GlideContainer from './GlideContainer.jsx';
import CampGlance from './ModalGlance.jsx';
import CampDay from './CampDay.jsx';
import ModalList from './ModalList.jsx';

function Modal({tile, singleImg, classy, onClose, today}) {
	let visibility = classy ? 'visible' : undefined;
	let isUpToDate = tile.date > today;
	let isCamp = tile.type === 'camp';
	let isEvent = tile.type === 'event';
	const modal = tile.modal;

	console.log(`modal ${tile.name} visible: ${visibility}`);

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
		<div className={`modal ${visibility}`}>
			<div className='modal__x-btn'>
				<a
					className='modal__close-btn'
					onClick={(e) => {
						e.stopPropagation();
						onClose();
					}}>
					<i className='fa-solid fa-xmark modal__icon'></i>
				</a>
			</div>
			<div className='modal__modal-body modal__modal-body--offer '>
				{/* <GlideContainer
					glideConfig={{
						type: 'carousel',
						// startAt: 0,
						perView: 5,
						focusAt: 'center',
						gap: 20,
						autoplay: 2200,
						animationDuration: 800,
					}}
					slides={{
						type: 'photo',
						path: tile.galleryPath,
						size: tile.gallerySize,
					}}
				/> */}

				{singleImg}
				<section
					className={`modal__full-desc--${tile.type} ${dynamicClass(
						'modal__full-desc',
						tile.extraClass,
					)}`}>
					{modal.fullDescTitle && <h3 className='modal__title'>{modal.fullDescTitle}</h3>}
					<p className='modal__full-desc-content'>{modal.fullDesc}</p>
				</section>

				{isCamp && (
					<>
						<header className={`modal__header`}>
							<CampGlance glance={modal.glance} />
						</header>
						<section className={dynamicClass('modal__desc', tile.extraClass)}>
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
