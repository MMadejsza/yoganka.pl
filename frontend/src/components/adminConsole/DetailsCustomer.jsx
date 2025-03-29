import { useState } from 'react';
import { calculateAge } from '../../utils/customerViewsUtils.js';
import DetailsCustomerForm from './DetailsCustomerForm.jsx';

function DetailsCustomer({
  customerData,
  isUserAccountPage,
  customerAccessed,
  adminAccessed,
  isPaymentView,
}) {
  console.log('customerData', customerData);
  const title = isUserAccountPage
    ? `Dane kontaktowe:`
    : `Uczestnik (ID ${customerData.customerId}):`;

  const [isEditing, setIsEditing] = useState(false);
  const handleStartEditing = () => {
    setIsEditing(true);
  };
  const handleCloseEditing = () => {
    setIsEditing(false);
  };

  let content = isEditing ? (
    <DetailsCustomerForm
      customerData={customerData}
      customerAccessed={customerAccessed}
      adminAccessed={adminAccessed}
    />
  ) : (
    <ul className='user-container__details-list modal-checklist__list'>
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>Numer telefonu:</p>
        <p className='user-container__section-record-content'>
          {customerData.phone}
        </p>
      </li>

      {!isUserAccountPage && (
        <>
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>Typ:</p>
            <p className='user-container__section-record-content'>{`${customerData.customerType}`}</p>
          </li>
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>Wiek:</p>
            <p className='user-container__section-record-content'>{`${calculateAge(
              customerData.dob
            )}   |  (${customerData.dob})`}</p>
          </li>
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>Z polecenia:</p>
            <p className='user-container__section-record-content'>
              {customerData.referralSource}
            </p>
          </li>
        </>
      )}
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>
          Kontaktuj się przez:
        </p>
        <p className='user-container__section-record-content'>
          {customerData.preferredContactMethod}
        </p>
      </li>
      {!isUserAccountPage && (
        <>
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>Notatki:</p>
            <p className='user-container__section-record-content'>
              {customerData.notes}
            </p>
          </li>
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>Lojalność:</p>
            <p className='user-container__section-record-content'>
              {customerData.loyalty}
            </p>
          </li>{' '}
        </>
      )}
    </ul>
  );
  return (
    <>
      <div className='user-container__main-details modal-checklist'>
        <h2 className='user-container__section-title modal__title--day'>
          {title}
        </h2>
        {content}

        {!isPaymentView && (
          <div className='user-container__action'>
            <button
              className='modal__btn'
              onClick={
                isEditing == false ? handleStartEditing : handleCloseEditing
              }
            >
              {isEditing == false ? (
                <>
                  <span className='material-symbols-rounded nav__icon'>
                    edit
                  </span>{' '}
                  Edytuj
                </>
              ) : (
                <>
                  <span className='material-symbols-rounded nav__icon'>
                    undo
                  </span>{' '}
                  Wróć
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default DetailsCustomer;
