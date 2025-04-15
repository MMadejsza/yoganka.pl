import { formatIsoDateTime } from '../../../../utils/dateTime.js';
import GenericList from '../../../common/GenericList.jsx';

function DetailsListPayment({ paymentData, userAccountPage }) {
  const payment = paymentData;
  console.log(
    `📝
	    paymentData object from backend:`,
    paymentData
  );

  const title = userAccountPage ? 'Szczegoły płatności' : 'Szczegoły płatności'; //temp

  const details = [
    { label: 'Numer:', content: payment.paymentId },
    { label: 'Data:', content: formatIsoDateTime(payment.date) },
    { label: 'Kwota:', content: `${payment.amountPaid} zł` },
    { label: 'Metoda płatności:', content: payment.paymentMethod },
    {
      label: 'Opłacono:',
      content:
        payment.status.toUpperCase() === 'COMPLETED'
          ? 'Zrealizowana'
          : 'Niekompletna',
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
