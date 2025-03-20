import {useNavigate} from 'react-router-dom';

function UserFeedbackBox({
	warnings,
	status,
	successMsg,
	isPending,
	isError,
	error,
	size,
	redirectTarget,
	onClose,
}) {
	// console.log('userFeedbackBox status', status);
	// console.log('userFeedbackBox isPending', isPending);
	// console.log('userFeedbackBox isError', isError);
	// console.log('userFeedbackBox error', error);
	// console.log('userFeedbackBox size', size);
	const navigate = useNavigate();

	const statusClass =
		warnings && warnings.length > 0
			? 'error'
			: isPending
			? 'neutral'
			: isError
			? 'error'
			: status == 1
			? 'success'
			: 'neutral';
	const sizeClass = size === 'small' ? 'feedback-box--small' : '';
	const readyClasses = `feedback-box feedback-box--${statusClass} ${sizeClass}`;

	let statusMsg;
	if (warnings && !error && !status) {
		statusMsg = (
			<>
				<h1 className='feedback-box__title'>
					{!!warnings ? 'To spowoduje także usunięcie:' : 'Czy na pewno?'}
				</h1>
				{warnings.map((msg) => (
					<p
						className='feedback-box__warning'
						key={msg}>
						❌ {msg}
					</p>
				))}{' '}
			</>
		);
	} else if (status == 1) {
		statusMsg = successMsg || 'Zmiany zatwierdzone';
		if (redirectTarget) {
			setTimeout(() => {
				statusMsg = null;
				navigate(redirectTarget);
				onClose();
			}, 1000);
		}
	} else if (status == 0) {
		statusMsg = error?.message || 'Brak zmian';
	} else if (isPending) {
		statusMsg = 'Wysyłanie...';
	} else if (isError) {
		if (error.code == 401) {
			statusMsg = 'Zaloguj się';
			console.log(error.message);
			setTimeout(() => {
				navigate('/login');
			}, 1000);
		} else if (error.code == 404) {
			setTimeout(() => {
				navigate('/login');
			}, 1000);
			console.log(error);
		} else {
			statusMsg = error.message;
		}
	}

	return <div className={readyClasses}>{statusMsg}</div>;
}

export default UserFeedbackBox;
