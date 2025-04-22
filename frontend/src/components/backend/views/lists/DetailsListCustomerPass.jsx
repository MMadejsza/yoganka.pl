import { formatIsoDateTime } from '../../../../utils/dateTime.js';
import GenericList from '../../../common/GenericList.jsx';

function DetailsListCustomerPass({ customerPass, userAccountPage }) {
  console.log(
    `📝
	    DetailsListCustomerPass object:`,
    customerPass
  );
  const statusMap = {
    1: 'Aktywny',
    0: 'Zawieszony',
    '-1': 'Wygasły',
  };

  const passStatus = Number(customerPass.status);
  const title = userAccountPage
    ? 'Szczegóły Twojego karnetu'
    : 'Karnet uczestnika';

  const details = [
    {
      label: 'Numer:',
      content: customerPass.customerPassId,
    },
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
  details.push({
    label: 'Status:',
    content: statusMap[passStatus] || 'NIEZNANY',
  });

  return (
    <GenericList
      title={title}
      details={details}
      classModifier='customer-pass'
    />
  );
}

export default DetailsListCustomerPass;
