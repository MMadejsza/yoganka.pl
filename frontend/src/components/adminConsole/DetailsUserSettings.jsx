import DetailsUserSettingsForm from './DetailsUserSettingsForm.jsx';

function DetailsUserSettings({
	settingsData,
	isUserAccountPage,
	isEditing,
	customerAccessed,
	adminAccessed,
}) {
	let handedness, fontSize, notifications, animation, theme;
	const hasPrefs = !!settingsData;

	handedness = hasPrefs ? (settingsData.Handedness == 1 ? 'On' : 'Off') : 'Off';
	fontSize = settingsData?.FontSize || '12';
	notifications = hasPrefs ? (settingsData.Notifications == 1 ? 'On' : 'Off') : 'Off';
	animation = hasPrefs ? (settingsData.Animation == 1 ? 'On' : 'Off') : 'Off';
	theme = hasPrefs ? (settingsData.Theme == 1 ? 'On' : 'Off') : 'Off';

	const title = isUserAccountPage
		? `Preferencje:`
		: `Ustawienia strony  ${
				settingsData?.UserID ? '(ID ' + settingsData?.UserID + '):' : '(Domyślne)'
		  }`;

	const displayContent = (
		<ul className='user-container__details-list modal-checklist__list'>
			<li className='user-container__section-record modal-checklist__li'>
				<p className='user-container__section-record-label'>Menu po lewej:</p>
				<p className='user-container__section-record-content'>{handedness}</p>
			</li>
			<li className='user-container__section-record modal-checklist__li'>
				<p className='user-container__section-record-label'>Rozmiar czcionki:</p>
				<p className='user-container__section-record-content'>{fontSize}</p>
			</li>
			<li className='user-container__section-record modal-checklist__li'>
				<p className='user-container__section-record-label'>Powiadomienia:</p>
				<p className='user-container__section-record-content'>{notifications}</p>
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
			customerAccessed={customerAccessed}
			adminAccessed={adminAccessed}
		/>
	);

	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>{title}</h2>
			{isEditing ? onEditContent : displayContent}
		</>
	);
}

export default DetailsUserSettings;
