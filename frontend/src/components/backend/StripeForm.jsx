import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { mutateOnStripeInDbCheck, queryClient } from '../../utils/http.js';
import Loader from '../common/Loader.jsx';
import FeedbackBox from './FeedbackBox.jsx';
import WrapperForm from './WrapperForm.jsx';

const logsGloballyOn = false;
// initialize Stripe.js once
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
const failureLimit = 5;
const recheckIntervalMs = 1000;

export default function StripeForm({
  type,
  status,
  clientSecret,
  onClose,
  updateFeedback,
  resetFeedback,
  tosControl,
}) {
  if (!clientSecret) {
    // if we don't have a client secret yet, show loading
    return <Loader label={'Ładowanie'} />;
  }

  return (
    <>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'flat',
            variables: {
              colorPrimary: '#1c7993',
              // colorTextSecondary: 'red',
              iconColor: '#1c7993',
              // colorBackground: '#fff8f4',
              colorText: '#30313d',
              colorDanger: '#df1b41',
              fontFamily: 'Ideal Sans, system-ui, sans-serif',
              spacingUnit: '4px',
              accordionItemSpacing: '1rem',
              borderRadius: '25px',
              // See all possible variables below
            },
            rules: {
              '.Label': {
                marginBottom: '10px',
                marginTop: '12px',
              },
            },
          },
        }}
        key={clientSecret} // using key forces new Elements instance
      >
        <PaymentFormInner
          status={status}
          onClose={onClose}
          updateFeedback={updateFeedback}
          resetFeedback={resetFeedback}
          clientSecret={clientSecret}
          type={type}
          tosControl={tosControl}
        />
      </Elements>
    </>
  );
}

function PaymentFormInner({
  type,
  status,
  updateFeedback,
  resetFeedback,
  tosControl,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMsg, setErrorMsg] = useState(null);
  const target = type == 'booking' ? 'obecności' : 'karnetu';

  // define mutation to verify paymentIntent with retry logic
  const { mutate: confirmStripeInDb, isLoading } = useMutation({
    // call backend and throw if still pending
    mutationFn: async obj => {
      const data = await mutateOnStripeInDbCheck(
        status,
        obj,
        `/api/stripe/verify-stripe-session`
      );

      // if still pending, throw to trigger retry
      if (data.confirmation !== 1) {
        const err = new Error('PENDING');
        err.data = data; // keep payload for onError
        throw err;
      }
      // confirmation === 1 or -1 → resolve normally
      return data;
    },
    // only retry for our “pending” error and max 10 times
    retry: (failureCount, error) => {
      return error.data !== undefined && failureCount < failureLimit;
    },
    retryDelay: attempt => attempt * recheckIntervalMs, // backoff: 1s,2s,...
    onSuccess: data => {
      resetFeedback();
      updateFeedback(data);
      if (data.confirmed) queryClient.invalidateQueries(['authStatus']);
    },
    onError: error => {
      resetFeedback();
      if (error.data) {
        // after <failureLimit> retries still pending → show that state
        updateFeedback(error.data);
      } else {
        // real network/server error
        updateFeedback({
          confirmation: -1,
          message: `Błąd w weryfikacji aktywacji ${target} - ${error.message}`,
        });
      }
    },
  });

  const handleReset = () => {
    resetFeedback();
    tosControl.handleReset();
    setErrorMsg(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements || isLoading || tosControl.hasError) return;

    // confirm payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      updateFeedback({ confirmation: -1, message: error.message });
      return;
    }

    // momentary message "waiting for activation of the pass..."
    updateFeedback({
      confirmation: 0,
      message: `Pozostań na stronie - płatność przyjęta, czekam na aktywację ${target}…`,
    });

    // call backend to confirm webhook processing with retries if still not in db
    if (logsGloballyOn) console.log('✅✅✅paymentIntent', paymentIntent);
    const piId = paymentIntent.id;
    confirmStripeInDb({ sessionId: piId });
  };

  return (
    <>
      {errorMsg && (
        <FeedbackBox
          status={-1}
          error={{ message: errorMsg }}
          onCloseFeedback={() => setErrorMsg(null)}
          size='small'
        />
      )}
      <WrapperForm
        title={'Wybierz metodę płatności:'}
        onSubmit={handleSubmit}
        onReset={handleReset}
        submitLabel={'Zapłać'}
        resetLabel='Resetuj'
        disabled={isLoading}
      >
        <PaymentElement />
      </WrapperForm>
    </>
  );
}
