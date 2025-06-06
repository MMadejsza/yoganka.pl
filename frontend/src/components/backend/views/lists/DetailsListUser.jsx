import { formatIsoDateTime } from '../../../../utils/dateTime.js';
import GenericList from '../../../common/GenericList.jsx';

function DetailsListUser({ userData, customerView, isUserAccountPage }) {
  // console.log(isUserAccountPage);

  const title = isUserAccountPage
    ? `Dane konta:`
    : `Konto (Id ${userData.userId}):`;

  const details = [
    {
      label: 'Utworzono:',
      content: formatIsoDateTime(userData.registrationDate),
    },
    { label: 'Email:', content: userData.email },
  ];

  if (!isUserAccountPage && !customerView && !userData.Customer) {
    details.push({ label: 'Aktywność:', content: 'Brak zakupów' });
  }

  return <GenericList title={title} details={details} />;
}

export default DetailsListUser;
