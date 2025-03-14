import ModalFrame from './ModalFrame.jsx';

import NewUserForm from './NewUserForm.jsx';

function NewUser({visited, onClose}) {
	return (
		<ModalFrame
			visited={visited}
			onClose={onClose}>
			<NewUserForm onClose={onClose} />
		</ModalFrame>
	);
}

export default NewUser;
