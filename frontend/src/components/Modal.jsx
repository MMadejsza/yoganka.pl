import {createPortal} from 'react-dom';
import GlideContainer from './GlideContainer.jsx';
import CampGlance from './ModalGlance.jsx';
import CampDay from './CampDay.jsx';
import ModalList from './ModalList.jsx';

function Modal({tile, classy, onClose, today}) {
	let visibility = classy ? 'visible' : undefined;
	let upToDate = true; //tile.date > today;

	console.log(`modal ${tile.name} visible: ${visibility}`);

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
			{tile.type === 'camp' && (
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
					<img
						className='tile__img'
						src={tile.imgPath}
					/>

					<header className={`modal__header`}>
						<CampGlance glance={tile.modal.glance} />
					</header>

					<section
						className={`modal__full-desc modal__full-desc--${tile.type} ${
							tile.extraClass ? 'modal__full-desc--' + tile.extraClass : ''
						}`}>
						{tile.modal.fullDescTitle && (
							<h3 className='modal__title'>{tile.modal.fullDescTitle}</h3>
						)}
						<p className='modal__full-desc-content'>{tile.modal.fullDesc}</p>
					</section>

					<section
						className={`modal__desc ${
							tile.extraClass ? `modal__desc--` + tile.extraClass : ''
						}`}>
						<h3 className='modal__title'>{tile.modal.plan.title}</h3>
						{tile.modal.plan.schedule.map((day, index) => (
							<CampDay
								key={index}
								dayData={day}
							/>
						))}
					</section>

					{Object.entries(tile.modal.summary).map(([listType, content], index) => (
						<ModalList
							key={index}
							listType={listType}
							data={content}
						/>
					))}

					{upToDate && <h2 className='modal__attention-note'>{tile.modal.note}</h2>}

					{upToDate && (
						<footer className='modal__user-action'>
							<a
								href={tile.modal.formLink}
								className={`modal__btn modal__sign-up`}
								target='_blank'>
								Dołączam
							</a>
						</footer>
					)}
				</div>
			)}
		</div>,
		document.getElementById('modal'),
	);
}

export default Modal;
