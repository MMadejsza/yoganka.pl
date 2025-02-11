import ModalFrame from './ModalFrame';

function UserDetails({visited, onClose}) {
	return (
		<ModalFrame
			visited={visited}
			onClose={onClose}>
			User
		</ModalFrame>
	);
}

export default UserDetails;
