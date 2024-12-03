const imgGroupPath = '/imgs/offer/regular/individual_and_group/front';
const imgB2BPath = '/imgs/offer/regular/commercial/front';

export const CLASSES_DATA = [
	// Created active classes so far
	{
		name: 'Grupowe i\u00A0Indywidualne',
		type: 'class',
		img: `${imgGroupPath}/480_group_0.jpg`,
		btnsContent: [{text: 'Skontaktuj się', link: `footer__socials`}],
		modal: false,
	},
	{
		name: 'Joga dla\u00A0firm',
		type: 'class',
		img: `${imgB2BPath}/480_commercial_0.jpg`,
		btnsContent: [{text: 'Poproś o ofertę', link: `mailto:kontakt@yoganka.pl `}],
		modal: false,
	},
];
