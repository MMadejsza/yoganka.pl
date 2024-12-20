import React, {useState} from 'react';

function Burger() {
	const [isOpen, setIsOpen] = useState(false);

	function handleClick() {
		const nextState = isOpen ? false : true;
		setIsOpen(nextState);
	}

	let isActive = isOpen ? `active` : undefined;

	return (
		<div
			className={`burger ${isActive}`}
			id='burger'
			onClick={handleClick}>
			<div className='burger__bar burger__bar--top'></div>
			<div className='burger__bar burger__bar--middle'></div>
			<div className='burger__bar burger__bar--bottom'></div>
		</div>
	);
}

export default Burger;
