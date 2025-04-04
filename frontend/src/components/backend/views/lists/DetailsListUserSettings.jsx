import { useState } from 'react';
import GenericList from '../../../common/GenericList.jsx';
import ToggleEditButton from '../../../common/ToggleEditButton.jsx';
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
  const fontSize = settingsData?.fontSize || '12';
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
    : `Ustawienia strony ${settingsData?.userId ? `(ID ${settingsData?.userPrefId}):` : '(Domyślne)'}`;

  const details = [
    { label: 'Menu po lewej:', content: handedness },
    { label: 'Rozmiar czcionki:', content: fontSize },
    { label: 'Powiadomienia:', content: notifications },
    { label: 'Animacje:', content: animation, status: 0 },
    { label: 'Ciemny motyw:', content: theme, status: 0 },
  ];

  const [isEditing, setIsEditing] = useState(false);
  const handleStartEditing = () => setIsEditing(true);
  const handleCloseEditing = () => setIsEditing(false);

  const content = isEditing ? (
    <DetailsFormUserSettings
      settingsData={settingsData}
      customerAccessed={customerAccessed}
      adminAccessed={adminAccessed}
    />
  ) : (
    <GenericList title={title} details={details} />
  );

  return (
    <>
      {content}
      <ToggleEditButton
        isEditing={isEditing}
        onStartEditing={handleStartEditing}
        onCloseEditing={handleCloseEditing}
      />
    </>
  );
}

export default DetailsListUserSettings;
