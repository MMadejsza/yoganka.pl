import { formatIsoDateTime } from '../../../../utils/dateTime.js';
import GenericList from '../../../common/GenericList.jsx';

function DetailsListCustomerPass({ customerPass }) {
  console.log(
    `📝
	    DetailsListCustomerPass object:`,
    customerPass
  );

  const details = [
    {
      label: 'Zakupiono:',
      content: formatIsoDateTime(customerPass.purchaseDate),
    },
    { label: 'Ważny od:', content: formatIsoDateTime(customerPass.validFrom) },
  ];

  if (customerPass.validUntil) {
    details.push({
      label: 'Ważny do:',
      content: formatIsoDateTime(customerPass.validUntil),
    });
  }
  if (customerPass.usesLeft) {
    details.push({
      label: 'Pozostało:',
      content: `${customerPass.usesLeft} sesji(a/e)`,
    });
  }
  details.push({ label: 'Status:', content: customerPass.status });

  return (
    <GenericList
      title='Karnet uczestnika:'
      details={details}
      classModifier='customer-pass'
    />
  );
}

export default DetailsListCustomerPass;
