import { memo, useEffect, useState } from 'react';
import { protectWordBreaks } from '../../utils/validation';
import Loader from '../common/Loader.jsx';
import SymbolOrIcon from '../common/SymbolOrIcon';
const logsGloballyOn = true;

function FeedbackBox({
  warnings,
  status,
  successMsg,
  isPending,
  error,
  size,
  onCloseFeedback,
  counter,
}) {
  if (logsGloballyOn)
    console.log('🧩🧩🧩 FeedbackBox props:', {
      status,
      successMsg,
      error,
      warnings,
    });
  // Initialize countdown timer with 3 seconds
  const [countdown, setCountdown] = useState(3);
  const counterOn = status === 1; //|| status === 0

  // reset counter if at every feedback reset
  useEffect(() => {
    if (status !== undefined) {
      setCountdown(3);
    }
  }, [status]);

  // Start the countdown when the status is success (status === 1) and not pending
  useEffect(() => {
    if (!isPending && counterOn) {
      const intervalId = setInterval(() => {
        setCountdown(prev => {
          // counter reaches 1 - stop further counting
          if (prev <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isPending, status]);

  useEffect(() => {
    if (countdown === 0) {
      onCloseFeedback();
    }
  }, [countdown, onCloseFeedback]);

  // Determine CSS class based on the feedback status and warnings
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
    statusMsg = <Loader label={'Wysyłanie...'} />;
  } else if (status === 1) {
    statusMsg = successMsg || 'Zmiany zatwierdzone';
    // Auto navigation handled in useFeedback hook, so here we just show the message
  } else if (status === 0) {
    // Neutral result (e.g. no changes were made)
    statusMsg = successMsg || 'Brak zmian';
  } else if (status === -1) {
    // Error result
    statusMsg = error?.message || 'Wystąpił błąd';
  } else if (warnings && (status === undefined || status === null)) {
    // If there are warnings and no explicit status, display them with a title
    statusMsg = (
      <>
        <h1 className='feedback-box__title'>
          {!!warnings ? 'To spowoduje także usunięcie:' : 'Czy na pewno?'}
        </h1>
        {warnings.map(msg => (
          <p className='feedback-box__warning' key={msg}>
            ❌ {msg}
          </p>
        ))}
      </>
    );
  } else {
    statusMsg = null;
  }

  return (
    <div className={readyClasses}>
      <button
        className='feedback-box__close-btn'
        onClick={() => {
          if (onCloseFeedback) onCloseFeedback();
        }}
      >
        <span className='feedback-box__counter'>
          {counterOn && !isPending ? `(${countdown} s...)` : ''}
        </span>
        <SymbolOrIcon specifier={`close`} extraClass={'feedback-box__x'} />
      </button>
      {protectWordBreaks(statusMsg)}
    </div>
  );
}

export default memo(FeedbackBox);
