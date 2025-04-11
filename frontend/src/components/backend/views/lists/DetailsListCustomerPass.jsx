import { formatIsoDateTime } from '../../../../utils/dateTime.js';
import GenericList from '../../../common/GenericList.jsx';

function DetailsListCustomerPass({ customerPass, userAccountPage }) {
  console.log(
    `📝
	    DetailsListCustomerPass object:`,
    customerPass
  );

  const title = userAccountPage
    ? 'Szczegóły Twojego karnetu'
    : 'Karnet uczestnika';

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
      content: `${customerPass.usesLeft} sesj(i/a/e)`,
    });
  }
  details.push({ label: 'Status:', content: customerPass.status });

  return (
    <GenericList
      title={title}
      details={details}
      classModifier='customer-pass'
    />
  );
}

export default DetailsListCustomerPass;
