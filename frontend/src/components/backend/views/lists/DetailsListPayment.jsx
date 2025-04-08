import { formatIsoDateTime } from '../../../../utils/dateTime.js';
import GenericList from '../../../common/GenericList.jsx';

function DetailsListPayment({ paymentData }) {
  const payment = paymentData;
  console.log(
    `📝
	    Schedule object from backend:`,
    paymentData
  );

  const details = [
    { label: 'Data płatności:', content: formatIsoDateTime(payment.date) },
    { label: 'Kwota:', content: `${payment.amountPaid} zł` },
    { label: 'Metoda płatności:', content: payment.paymentMethod },
    { label: 'Opłacono:', content: payment.status },
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
    <GenericList
      title='Szczegóły:'
      details={details}
      classModifier='payment-view'
    />
  );
}

export default DetailsListPayment;
