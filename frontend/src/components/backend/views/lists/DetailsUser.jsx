import { useParams } from 'react-router-dom';
import { formatIsoDateTime } from '../../../../utils/dateTime.js';

//! Add authorisation that you can reset only your password
function DetailsUser({ userData, customerView, isUserAccountPage }) {
  // console.log(isUserAccountPage);
  const params = useParams();
  const title = isUserAccountPage
    ? `Dane konta:`
    : `Konto (ID ${userData.userId}):`;

  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>
        {title}
      </h2>

      <ul className='user-container__details-list modal-checklist__list'>
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>Utworzono:</p>
          <p className='user-container__section-record-content'>
            {formatIsoDateTime(userData.registrationDate)}
          </p>
        </li>
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>Email:</p>
          <p className='user-container__section-record-content'>
            {userData.email}
          </p>
        </li>

        {!isUserAccountPage && !customerView && !userData.Customer && (
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>Aktywność:</p>
            <p className='user-container__section-record-content'>
              Brak zakupów
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default DetailsUser;
