import ModalFrame from './ModalFrame.jsx';

import UserForm from './UserForm.jsx';

function NewUser({visited, onClose}) {
	return (
		<ModalFrame
			visited={visited}
			onClose={onClose}>
			<UserForm closeModal={true} />
		</ModalFrame>
	);
}

export default NewUser;
