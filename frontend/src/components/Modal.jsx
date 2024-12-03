import {createPortal} from 'react-dom';

function Modal({tile, classy}) {
	return createPortal(
		<div className={`modal ${classy}`}>{tile.name}</div>,
		document.getElementById('modal'),
	);
}

export default Modal;
