import { useState } from 'react';
import { calculateAge } from '../../../../utils/statistics/statsUtils.js';
import ToggleEditButton from '../../../backend/ToggleEditButton.jsx';
import GenericList from '../../../common/GenericList.jsx';
import DetailsFormCustomer from './edit-forms/DetailsFormCustomer.jsx';

function DetailsListCustomer({
  customerData,
  isUserAccountPage,
  customerAccessed,
  adminAccessed,
  isPaymentView,
  classModifier,
}) {
  console.log('customerData', customerData);

  const [isEditing, setIsEditing] = useState(false);
  const handleStartEditing = () => setIsEditing(true);
  const handleCloseEditing = () => setIsEditing(false);

  const title = isUserAccountPage
    ? `Dane kontaktowe:`
    : `Uczestnik (Id ${customerData.customerId}):`;

  const details = [{ label: 'Numer telefonu:', content: customerData.phone }];
  if (!isUserAccountPage) {
    details.push(
      { label: 'Typ:', content: customerData.customerType },
      {
        label: 'Wiek:',
        content: `${calculateAge(customerData.dob)} | (${customerData.dob})`,
      },
      { label: 'Z polecenia:', content: customerData.referralSource }
    );
  }
  details.push({
    label: 'Kontaktuj się przez:',
    content: customerData.preferredContactMethod,
  });
  if (!isUserAccountPage) {
    details.push(
      { label: 'Lojalność:', content: customerData.loyalty },
      { label: 'Notatki:', content: customerData.notes }
    );
  }

  let content = isEditing ? (
    <DetailsFormCustomer
      title={title}
      customerData={customerData}
      customerAccessed={customerAccessed}
      adminAccessed={adminAccessed}
    />
  ) : (
    <GenericList
      title={title}
      details={details}
      classModifier={classModifier}
    />
  );
  return (
    <>
      <div className='generic-component-wrapper'>
        {content}
        {!isPaymentView && (
          <ToggleEditButton
            isEditing={isEditing}
            onStartEditing={handleStartEditing}
            onCloseEditing={handleCloseEditing}
          />
        )}
      </div>
    </>
  );
}

export default DetailsListCustomer;
