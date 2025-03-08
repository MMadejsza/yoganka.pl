import {useNavigate} from 'react-router-dom';

function UserFeedbackBox({status, isPending, isError, error, size}) {
	// console.log('userFeedbackBox status', status);
	// console.log('userFeedbackBox isPending', isPending);
	// console.log('userFeedbackBox isError', isError);
	// console.log('userFeedbackBox error', error);
	// console.log('userFeedbackBox size', size);
	const navigate = useNavigate();

	const statusClass =
		isPending || status == 0
			? 'neutral'
			: isError
			? 'error'
			: status == 1
			? 'success'
			: 'neutral';
	const sizeClass = size === 'small' ? 'feedback-box--small' : '';
	const readyClasses = `feedback-box feedback-box--${statusClass} ${sizeClass}`;

	let statusMsg;
	if (status == 1) {
		statusMsg = 'Zmiany zatwierdzone';
	} else if (status == 0) {
		statusMsg = 'Brak zmian';
	} else if (isPending) {
		statusMsg = 'Wysyłanie...';
	} else if (isError) {
		if (error.code == 401) {
			statusMsg = 'Zaloguj się';
			console.log(error.message);
			setTimeout(() => {
				navigate('/login');
			}, 1000);
		} else {
			statusMsg = error.message;
		}
	}

	return <div className={readyClasses}>{statusMsg}</div>;
}

export default UserFeedbackBox;
