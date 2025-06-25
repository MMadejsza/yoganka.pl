import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// useCallback to prevent recreating the same function on every render, which helps keep the function's reference stable. This is important when passing the function to child components or dependencies in other hooks, as it prevents unnecessary re-renders and improves performance.
const logsGloballyOn = false;

export function useFeedback({
  getRedirectTarget = () => null,
  onClose = () => {},
} = {}) {
  if (logsGloballyOn) console.log('✅ updateFeedback został wywołany');
  // to trigger timeout cancellation after closing modal which feedback box is in
  const [modalClosedManually, setModalClosedManually] = useState(false);
  const [feedback, setFeedback] = useState({
    status: undefined, // 1 - success, 0 - neutral, -1 - error
    message: '',
    warnings: null,
  });
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const TIME = 3000;

  // clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const resetFeedback = useCallback(() => {
    if (logsGloballyOn) console.log(`timerRef.current`, timerRef.current);
    if (timerRef.current) {
      if (logsGloballyOn) console.log(`if (timerRef.current)`);
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setFeedback({ status: undefined, message: '', warnings: null });
    // setModalClosedManually(true);
  }, []);

  // Function to update feedback - for example after mutation
  const updateFeedback = useCallback(
    result => {
      // always clear previous timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setModalClosedManually(false);
      if (logsGloballyOn) console.log('updateFeedback res: ', result);
      // if warnings - don't redirect or close
      if (
        (result.confirmation === 0 || result.confirmation === -1) &&
        result.warnings &&
        result.warnings.length > 0
      ) {
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
      const counterOn = newStatus === 1; //|| newStatus === 0

      if (logsGloballyOn)
        console.log('🧩🧩🧩 setFeedback:', {
          status: newStatus,
          message: result.message,
          warnings:
            result.warnings ||
            (Array.isArray(result.errors)
              ? result.errors.map(e => e.msg)
              : null),
        });

      setFeedback({
        status: newStatus,
        message: result.message,
        warnings: Array.isArray(result.errors)
          ? result.errors.map(e => e.msg)
          : Array.isArray(result)
          ? result.map(e => e.message || JSON.stringify(e))
          : null,
      });

      // Optional navigation after feedback (closing modal)
      const redirectTarget = getRedirectTarget(result);
      if (redirectTarget !== null && !modalClosedManually) {
        timerRef.current = setTimeout(() => {
          if (!modalClosedManually) {
            setFeedback({ status: undefined, message: '', warnings: null });
            onClose();
            if (redirectTarget === -1) {
              navigate(-1);
            } else {
              navigate(redirectTarget, { replace: true });
            }
          }
        }, TIME);
      } else if (counterOn && !modalClosedManually) {
        // close only if success
        timerRef.current = setTimeout(() => {
          setFeedback({ status: undefined, message: '', warnings: null });
          onClose();
        }, TIME);
      }
    },
    [navigate, getRedirectTarget, onClose, modalClosedManually]
  );

  return { feedback, updateFeedback, resetFeedback };
}
