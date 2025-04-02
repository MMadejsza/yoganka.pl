import { useState } from 'react';
import { calculateAge } from '../../../../utils/statistics/statsUtils.js';
import GenericList from '../../../common/GenericList.jsx';
import ToggleEditButton from '../../../common/ToggleEditButton.jsx';
import DetailsCustomerForm from './forms/DetailsCustomerForm.jsx';

function DetailsCustomer({
  customerData,
  isUserAccountPage,
  customerAccessed,
  adminAccessed,
  isPaymentView,
}) {
  console.log('customerData', customerData);

  const [isEditing, setIsEditing] = useState(false);
  const handleStartEditing = () => setIsEditing(true);
  const handleCloseEditing = () => setIsEditing(false);

  const title = isUserAccountPage
    ? `Dane kontaktowe:`
    : `Uczestnik (ID ${customerData.customerId}):`;

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
      { label: 'Notatki:', content: customerData.notes },
      { label: 'Lojalność:', content: customerData.loyalty }
    );
  }

  let content = isEditing ? (
    <DetailsCustomerForm
      customerData={customerData}
      customerAccessed={customerAccessed}
      adminAccessed={adminAccessed}
    />
  ) : (
    <GenericList title={title} details={details} />
  );
  return (
    <>
      <div className='user-container__main-details modal-checklist'>
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

export default DetailsCustomer;
