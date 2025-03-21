import {useState, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

// useCallback to prevent recreating the same function on every render, which helps keep the function's reference stable. This is important when passing the function to child components or dependencies in other hooks, as it prevents unnecessary re-renders and improves performance.

export function useFeedback({getRedirectTarget = () => null, onClose = () => {}} = {}) {
	const [feedback, setFeedback] = useState({
		status: undefined, // 1 - success, 0 - neutral, -1 - error
		message: '',
		warnings: null,
	});
	const navigate = useNavigate();

	// Function to update feedback - for example after mutation
	const updateFeedback = useCallback(
		(result) => {
			console.log('updateFeedback res: ', result);
			// if warnings - don't redirect or close
			if (result.confirmation === 0 && result.warnings && result.warnings.length > 0) {
				setFeedback({
					status: undefined, // to let box render warnings
					message: result.message,
					warnings: result.warnings,
				});
				return;
			}
			// Result must have confirmation, message, warnings
			const newStatus =
				result.confirmation === true || result.confirmation === 1
					? 1
					: result.confirmation === false || result.confirmation === 0
					? 0
					: result.confirmation === -1
					? -1
					: -1;
			setFeedback({
				status: newStatus,
				message: result.message,
				warnings: result.warnings || null,
			});
			// Optional navigation after feedback (closing modal)
			const redirectTarget = getRedirectTarget(result);
			if (redirectTarget !== null) {
				setTimeout(() => {
					setFeedback({status: undefined, message: '', warnings: null});
					onClose();
					if (redirectTarget === -1) {
						navigate(-1);
					} else {
						navigate(redirectTarget, {replace: true});
					}
				}, 1000);
			} else {
				onClose();
			}
		},
		[navigate, getRedirectTarget, onClose],
	);

	const resetFeedback = useCallback(() => {
		setFeedback({status: undefined, message: '', warnings: null});
	}, []);

	return {feedback, updateFeedback, resetFeedback};
}
