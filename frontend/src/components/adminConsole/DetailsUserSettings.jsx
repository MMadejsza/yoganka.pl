import DetailsUserSettingsForm from './DetailsUserSettingsForm.jsx';

function DetailsUserSettings({settingsData, isUserAccountPage, isEditing}) {
	let handedness, fontSize, notifications, animation, theme;
	const hasPrefs = !!settingsData;

	handedness = hasPrefs
		? settingsData.Handedness == 'Left'
			? 'Po lewej'
			: 'Po prawej'
		: 'Po prawej';
	fontSize = settingsData?.FontSize || '12';
	notifications = hasPrefs ? (settingsData.Notifications == 1 ? 'On' : 'Off') : 'Włączone';
	animation = hasPrefs ? (settingsData.Animation == 1 ? 'On' : 'Off') : 'Włączone';
	theme = hasPrefs ? (settingsData.Theme == 'Dark' ? 'Ciemny' : 'Jasny') : 'Jasny';

	const title = isUserAccountPage
		? `Preferencje:`
		: `Ustawienia strony  ${
				settingsData?.UserID ? '(ID ' + settingsData?.UserID + '):' : '(Domyślne)'
		  }`;

	const displayContent = (
		<ul className='user-container__details-list modal-checklist__list'>
			<li className='user-container__section-record modal-checklist__li'>
				<p className='user-container__section-record-label'>Pozycja menu:</p>
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
				<p className='user-container__section-record-label'>Motyw:</p>
				<p className='user-container__section-record-content'>{theme}</p>
			</li>
		</ul>
	);

	const onEditContent = <DetailsUserSettingsForm />;

	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>{title}</h2>
			{isEditing ? onEditContent : displayContent}
		</>
	);
}

export default DetailsUserSettings;
