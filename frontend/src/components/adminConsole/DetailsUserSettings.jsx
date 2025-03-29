import { useState } from 'react';
import DetailsUserSettingsForm from './DetailsUserSettingsForm.jsx';

function DetailsUserSettings({
  settingsData,
  isUserAccountPage,
  customerAccessed,
  adminAccessed,
}) {
  let handedness, fontSize, notifications, animation, theme;
  const hasPrefs = !!settingsData;

  handedness = hasPrefs ? (settingsData.handedness == 1 ? 'On' : 'Off') : 'Off';
  fontSize = settingsData?.fontSize || '12';
  notifications = hasPrefs
    ? settingsData.notifications == 1
      ? 'On'
      : 'Off'
    : 'Off';
  animation = hasPrefs ? (settingsData.animation == 1 ? 'On' : 'Off') : 'Off';
  theme = hasPrefs ? (settingsData.theme == 1 ? 'On' : 'Off') : 'Off';

  const title = isUserAccountPage
    ? `Preferencje:`
    : `Ustawienia strony  ${
        settingsData?.userId
          ? '(ID ' + settingsData?.userPrefId + '):'
          : '(Domyślne)'
      }`;

  const [isEditing, setIsEditing] = useState(false);
  const handleStartEditing = () => {
    setIsEditing(true);
  };
  const handleCloseEditing = () => {
    setIsEditing(false);
  };

  const displayContent = (
    <ul className='user-container__details-list modal-checklist__list'>
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>Menu po lewej:</p>
        <p className='user-container__section-record-content'>{handedness}</p>
      </li>
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>
          Rozmiar czcionki:
        </p>
        <p className='user-container__section-record-content'>{fontSize}</p>
      </li>
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>Powiadomienia:</p>
        <p className='user-container__section-record-content'>
          {notifications}
        </p>
      </li>
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>Animacje:</p>
        <p className='user-container__section-record-content'>{animation}</p>
      </li>
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>Ciemny motyw:</p>
        <p className='user-container__section-record-content'>{theme}</p>
      </li>
    </ul>
  );

  const onEditContent = (
    <DetailsUserSettingsForm
      settingsData={settingsData}
      customerAccessed={customerAccessed}
      adminAccessed={adminAccessed}
    />
  );

  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>
        {title}
      </h2>
      {isEditing ? onEditContent : displayContent}

      <div className='user-container__action'>
        <button
          className='modal__btn'
          onClick={isEditing == false ? handleStartEditing : handleCloseEditing}
        >
          {isEditing == false ? (
            <>
              <span className='material-symbols-rounded nav__icon'>edit</span>{' '}
              Edytuj
            </>
          ) : (
            <>
              <span className='material-symbols-rounded nav__icon'>undo</span>{' '}
              Wróć
            </>
          )}
        </button>
      </div>
    </>
  );
}

export default DetailsUserSettings;
