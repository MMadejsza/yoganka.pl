import React, {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import NewUserForm from './NewUserForm.jsx';

function ModalForm({visited, onClose}) {
	const [isVisible, setIsVisible] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

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
				<NewUserForm closeModal={handleClose} />
			</div>
		</>,
		document.getElementById('modal'),
	);
}

export default ModalForm;
