import { formatIsoDateTime } from '../../../../utils/dateTime.js';
import GenericList from '../../../common/GenericList.jsx';

function DetailsListPayment({ paymentData, userAccountPage }) {
  const payment = paymentData;
  console.log(
    `📝
	    paymentData object from backend:`,
    paymentData
  );
  const map = {
    1: 'Całkowicie',
    0: 'Częściowo',
    '-1': 'Płatność anulowana',
  };

  const title = userAccountPage ? 'Szczegoły płatności' : 'Szczegoły płatności'; //temp

  const tosContent = payment.TosVersion
    ? `${payment.TosVersion.version} (${payment.TosVersion.tosId})`
    : undefined;
  const stripeContent = payment.stripeSessionId
    ? `${payment.stripeSessionId}`
    : undefined;

  const details = [
    { label: 'Numer:', content: payment.paymentId },
    { label: 'Sesja Stripe:', content: stripeContent },
    { label: 'Regulamin (Id):', content: tosContent },
    { label: 'Data:', content: formatIsoDateTime(payment.date) },
    { label: 'Kwota:', content: `${payment.amountPaid} zł` },
    { label: 'Metoda płatności:', content: payment.paymentMethod },
    {
      label: 'Opłacono:',
      content: map[Number(payment.status)],
    },
    { label: 'Produkty:', content: payment.product },
  ];

  if (payment.amountDue && payment.amountDue !== '0.00') {
    details.push({
      label: 'Pozostało do zapłaty:',
      content: `${payment.amountDue} zł`,
      extraClass: 'danger',
    });
  }

  return (
    <GenericList title={title} details={details} classModifier='payment-view' />
  );
}

export default DetailsListPayment;
