import {useNavigate} from 'react-router-dom';

function UserFeedbackBox({
	warnings,
	status,
	successMsg,
	isPending,
	error,
	size,
	redirectTarget,
	onClose,
}) {
	const navigate = useNavigate();

	const statusClass =
		warnings && warnings.length > 0
			? 'error'
			: isPending
			? 'neutral'
			: status === 1
			? 'success'
			: status === 0
			? 'neutral'
			: status === -1
			? 'error'
			: 'neutral';
	const sizeClass = size === 'small' ? 'feedback-box--small' : '';
	const readyClasses = `feedback-box feedback-box--${statusClass} ${sizeClass}`;

	let statusMsg;

	if (isPending) {
		statusMsg = 'Wysyłanie...';
	} else if (status === 1) {
		statusMsg = successMsg || 'Zmiany zatwierdzone';
		if (redirectTarget) {
			setTimeout(() => {
				navigate(redirectTarget);
				onClose();
			}, 1000);
		}
	} else if (status === 0) {
		// Neutral result (e.g. no changes were made)
		statusMsg = successMsg || 'Brak zmian';
	} else if (status === -1) {
		// Error result
		statusMsg = error?.message || 'Wystąpił błąd';
	} else if (warnings && (status === undefined || status === null)) {
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
				))}
			</>
		);
	} else {
		statusMsg = null;
	}

	return <div className={readyClasses}>{statusMsg}</div>;
}

export default UserFeedbackBox;
