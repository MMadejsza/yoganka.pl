import React, {useRef, useEffect} from 'react';

export default function MdSwitchWrapper({checked, onChange, ...props}) {
	const ref = useRef(null);

	useEffect(() => {
		const node = ref.current;
		const handleInput = (e) => onChange?.(e.target.selected);
		node.addEventListener('input', handleInput);
		return () => node.removeEventListener('input', handleInput);
	}, [onChange]);

	useEffect(() => {
		if (ref.current) ref.current.selected = checked;
	}, [checked]);

	return (
		<md-switch
			ref={ref}
			{...props}
		/>
	);
}
