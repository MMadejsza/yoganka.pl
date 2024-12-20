// function to replace the main contact btn's link
const whatsappTemplate = () => {
	const phoneNumber = '48792891607';
	const msgContact = `Hej! Piszę do Ciebie z yoganka.pl :)\n\nTu [imię] [Nazwisko]`;

	const linkContact = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msgContact)}`;

	return linkContact;
};
const qrsPath = 'imgs/qrs';

export const SOCIALS_DATA = [
	{
		name: 'Instagram',
		link: 'https://www.instagram.com/yoganka_bodyhealing/',
		title: 'Instagram Fanpage',
		iconClass: 'fa-brands fa-instagram',
		qr: `${qrsPath}/qrinsta.png`,
		qrAlt: function () {
			return `${this.name} QR Code`;
		},
	},
	{
		name: 'Facebook',
		link: 'https://www.facebook.com/profile.php?id=100094192084948',
		title: 'Facebook Fanpage',
		iconClass: 'fa-brands fa-square-facebook',
		qr: `${qrsPath}/qrfb.png`,
		qrAlt: function () {
			return `${this.name} QR Code`;
		},
	},
	{
		name: 'Phone',
		link: 'tel:+48792891607',
		title: 'Zadzwoń',
		iconClass: 'fa-solid fa-phone',
		qr: `${qrsPath}/qrphone.png`,
		qrAlt: function () {
			return `${this.name} QR Code`;
		},
	},
	{
		name: 'Email',
		link: 'mailto:kontakt@yoganka.pl?&body=Hej! Piszę do Ciebie z yoganka.pl',
		title: 'Wyślij maila',
		iconClass: 'fa-solid fa-envelope',
		qr: `${qrsPath}/qrmail.png`,
		qrAlt: function () {
			return `${this.name} QR Code`;
		},
	},
	{
		name: 'WhatsApp',
		link: whatsappTemplate(),
		title: 'Napisz!',
		iconClass: 'fab fa-whatsapp',
		qr: `${qrsPath}/qrwa.png`,
		qrAlt: function () {
			return `${this.name} QR Code`;
		},
	},
];
