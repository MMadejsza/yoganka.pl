const imgGroupPath = '/imgs/offer/regular/individual_and_group/front';
const imgB2BPath = '/imgs/offer/regular/commercial/front';

export const CLASSES_DATA = [
	// Created active classes so far
	{
		id: 'CL01',
		name: 'Grupowe i\u00A0Indywidualne',
		type: 'class',
		fileName: 'group',
		imgPath: `${imgGroupPath}/480_group_0.jpg`,
		galleryPath: ``,
		gallerySize: ``,
		front: {
			title: `Grupowe i\u00A0Indywidualne`,
			dates: [],
			area: ``,
			btnsContent: [{text: 'Skontaktuj się', link: `footer__socials`}],
		},
		modal: false,
	},
	{
		id: 'CL02',
		name: 'Joga dla\u00A0firm',
		type: 'class',
		fileName: 'commercial',
		imgPath: `${imgB2BPath}/480_commercial_0.jpg`,
		galleryPath: ``,
		gallerySize: ``,
		front: {
			title: `Joga dla\u00A0firm`,
			dates: [],
			area: ``,
			btnsContent: [{text: 'Poproś o ofertę', link: `mailto:kontakt@yoganka.pl`}],
		},
		modal: false,
	},
];
