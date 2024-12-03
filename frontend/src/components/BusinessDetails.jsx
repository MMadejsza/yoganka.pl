const config = {
	name: {
		name: 'BodyHealing Anna Madejsza',
		address: 'Gdańsk, Polska',
		NIP: 'NIP 9532546276',
	},
	phone: {
		number: '+48792891607',
		displayed: '+48 792 891 607',
		link: 'tel:+48792891607',
		aTitle: 'Zadzwoń',
	},
	email: {
		address: 'kontakt@yoganka.pl',
		displayed: 'kontakt@yoganka.pl',
		link: 'mailto:kontakt@yoganka.pl',
		aTitle: 'Wyślij maila',
	},
};

function BusinessDetails({leadingClass}) {
	return (
		<div className={`${leadingClass}__company-details`}>
			<p className={`${leadingClass}__company-name`}>{config.name.name}</p>
			<p className={`${leadingClass}__company-location`}>{config.name.address}</p>
			<a
				className={`${leadingClass}__company-phone`}
				href={config.phone.link}
				title={config.phone.aTitle}>
				{config.phone.displayed}
			</a>
			<a
				className={`${leadingClass}__company-email`}
				href={config.email.link}
				title={config.email.aTitle}>
				{config.email.displayed}
			</a>
			<p className={`${leadingClass}__company-nip`}>{config.name.NIP}</p>
		</div>
	);
}

export default BusinessDetails;
