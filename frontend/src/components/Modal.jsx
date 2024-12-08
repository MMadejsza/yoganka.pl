import {createPortal} from 'react-dom';
import GlideContainer from './GlideContainer.jsx';

function Modal({tile, classy, onClose}) {
	let visibility = classy ? 'visible' : undefined;

	console.log(`modal ${tile.front.title} visible: ${visibility}`);
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

				<section
					className={`modal__full-desc modal__full-desc--${tile.type} modal__full-desc--${
						tile.extraClass ? tile.extraClass : ''
					}`}>
					{tile.modal.fullDescTitle && (
						<h3 className='modal__title'>{tile.modal.fullDescTitle}</h3>
					)}
					<p className='modal__full-desc-content'>{tile.modal.fullDesc}</p>
				</section>
			</div>
			{tile.name}
		</div>,
		document.getElementById('modal'),
	);
}

export default Modal;
