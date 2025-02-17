import React, {useState} from 'react';
import {useParams, useLocation} from 'react-router-dom';

import {fetchItem} from '../../utils/http.js';
import {useQuery} from '@tanstack/react-query';
import ModalFrame from './ModalFrame.jsx';
import DetailsUser from './DetailsUser.jsx';
import DetailsCustomer from './DetailsCustomer.jsx';
import UserForm from './UserForm.jsx';

function DetailsFrame({modifier, visited, onClose}) {
	const params = useParams();
	const location = useLocation();
	const callPath = location.pathname;
	const {data, isPending, isError, error} = useQuery({
		queryKey: ['user', params.id],
		queryFn: ({signal}) => fetchItem(callPath, {signal}),
		staleTime: 0,
		refetchOnMount: true,
		enabled: !!params.id,
	});
	const [editingState, setEditingState] = useState(false);

	const handleStartEditing = () => {
		setEditingState(true);
	};
	const handleCloseEditing = () => {
		setEditingState(false);
	};
	const resolveModifier = (data) => {
		let controller = {};
		switch (modifier) {
			case 'user':
				controller.recordDisplay = <DetailsUser data={data} />;
				controller.recordEditor = <UserForm />;
				return controller;
			case 'customer':
				controller.recordDisplay = <DetailsCustomer data={data} />;
				controller.recordEditor = '';
				return controller;
			default:
				break;
		}
	};

	let dataDisplay;
	let dataEditor;

	if (isPending) {
		dataDisplay = 'Loading...';
	}
	if (isError) {
		dataDisplay = 'Error in UserDetails fetch...';
	}
	if (data) {
		const {recordDisplay, recordEditor} = resolveModifier(data);
		dataDisplay = recordDisplay;
		dataEditor = recordEditor;
	}

	return (
		<ModalFrame
			visited={visited}
			onClose={onClose}>
			<div className='user-container modal__summary'>
				<div className='user-container__actions-block'>
					<button
						className='user-container__action modal__btn'
						onClick={editingState == false ? handleStartEditing : handleCloseEditing}>
						{editingState == false ? 'Edytuj' : 'Wróć'}
					</button>
					{!editingState && (
						<button className='user-container__action modal__btn'>Usuń</button>
					)}
				</div>
				{editingState == false ? dataDisplay : dataEditor}
			</div>
		</ModalFrame>
	);
}

export default DetailsFrame;
