import { useState } from 'react';
import ToggleEditButton from '../../../backend/ToggleEditButton.jsx';
import GenericList from '../../../common/GenericList.jsx';
import DetailsFormUserSettings from './edit-forms/DetailsFormUserSettings.jsx';

function DetailsListUserSettings({
  settingsData,
  isUserAccountPage,
  customerAccessed,
  adminAccessed,
}) {
  const hasPrefs = !!settingsData;
  const handedness = hasPrefs
    ? settingsData.handedness == 1
      ? 'On'
      : 'Off'
    : 'Off';
  const fontSize = settingsData?.fontSize || 'M';
  const notifications = hasPrefs
    ? settingsData.notifications == 1
      ? 'On'
      : 'Off'
    : 'Off';
  const animation = hasPrefs
    ? settingsData.animation == 1
      ? 'On'
      : 'Off'
    : 'Off';
  const theme = hasPrefs ? (settingsData.theme == 1 ? 'On' : 'Off') : 'Off';

  const title = isUserAccountPage
    ? 'Preferencje:'
    : `Ustawienia strony ${
        settingsData?.userPrefId
          ? `(Id ${settingsData?.userPrefId}):`
          : '(Domyślne)'
      }`;

  const details = [
    { label: 'Menu po lewej:', content: handedness },
    { label: 'Powiadomienia:', content: notifications },
    { label: 'Rozmiar czcionki:', content: fontSize },
    { label: 'Animacje:', content: animation, status: 0 },
    { label: 'Ciemny motyw:', content: theme, status: 0 },
  ];

  const [isEditing, setIsEditing] = useState(false);
  const handleStartEditing = () => setIsEditing(true);
  const handleCloseEditing = () => setIsEditing(false);

  const content = isEditing ? (
    <DetailsFormUserSettings
      title={title}
      settingsData={settingsData}
      customerAccessed={customerAccessed}
      adminAccessed={adminAccessed}
      classModifier='settings'
    />
  ) : (
    <GenericList title={title} details={details} classModifier='settings' />
  );

  return (
    <>
      <div className='generic-component-wrapper'>
        {content}
        <ToggleEditButton
          isEditing={isEditing}
          onStartEditing={handleStartEditing}
          onCloseEditing={handleCloseEditing}
        />
      </div>
    </>
  );
}

export default DetailsListUserSettings;
