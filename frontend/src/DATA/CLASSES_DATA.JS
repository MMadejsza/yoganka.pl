const imgGroupPath = `/imgs/offer/regular/individual_and_group/front`;
const imgB2BPath = `/imgs/offer/regular/commercial/front`;

export const CLASSES_DATA = [
	{
		id: `CL01`,
		name: `Grupowe i\u00A0Indywidualne`,
		type: `class`,
		date: ``,
		fileName: `group`,
		imgPath: `${imgGroupPath}/480_group_0.jpg`,
		galleryPath: ``,
		gallerySize: ``,
		eventType: ``,
		extraClass: ``,
		front: {
			title: `Grupowe i\u00A0Indywidualne`,
			dates: [],
			location: ``,
			desc: ``,
			btnsContent: [{text: `Skontaktuj się`, link: `#footer__socials`}],
		},
		modal: false,
	},
	{
		id: `CL02`,
		name: `Joga dla\u00A0firm`,
		type: `class`,
		date: ``,
		fileName: `commercial`,
		imgPath: `${imgB2BPath}/480_commercial_0.jpg`,
		galleryPath: ``,
		gallerySize: ``,
		eventType: ``,
		extraClass: ``,
		front: {
			title: `Joga dla\u00A0firm`,
			dates: [],
			location: ``,
			desc: ``,
			btnsContent: [{text: `Poproś o ofertę`, link: `mailto:kontakt@yoganka.pl`}],
		},
		modal: false,
	},
];
