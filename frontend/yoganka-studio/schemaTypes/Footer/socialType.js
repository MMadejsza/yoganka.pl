// schemas/socialType.js

const iconMap = {
  instagram: {iconClass: 'fa-brands fa-instagram', materialSymbol: ''},
  facebook: {iconClass: 'fa-brands fa-facebook', materialSymbol: ''},
  whatsapp: {iconClass: 'fa-brands fa-whatsapp', materialSymbol: ''},
  phone: {iconClass: '', materialSymbol: 'call'},
  email: {iconClass: '', materialSymbol: 'mail'},
}

export default {
  name: 'social',
  title: 'STOPKA - Social media',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nazwa serwisu',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Instagram', value: 'instagram'},
          {title: 'Facebook', value: 'facebook'},
          {title: 'WhatsApp', value: 'whatsapp'},
          {title: 'Telefon', value: 'phone'},
          {title: 'E-mail', value: 'email'},
        ],
      },
    },
    {
      name: 'link',
      title: 'Link',
      type: 'string',
      description: 'URL, tel: lub mailto:',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return 'Wartość jest wymagana'

          // WhatsApp numer: digits only
          if (/^\d{9,15}$/.test(value)) return true

          // tel:, mailto:, http(s)://
          if (/^(tel:|mailto:|https?:\/\/)/.test(value)) return true

          return 'Wprowadź poprawny numer (cyfry), lub link zaczynający się od tel:, mailto:, https://'
        }),
    },
    {
      name: 'title',
      title: 'Podpowiedź przy najechaniu (tooltip)',
      type: 'string',
      description: `Ma wartość UX - niech będzie faktycznie wskazówką dla przycisku. np. "Instagram Fanpage", "Zadzwoń"`,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'iconClass',
      title: 'Klasa ikony (FontAwesome)',
      type: 'string',
      hidden: true,
      initialValue: (document) => iconMap[document.name]?.iconClass || '',
    },
    {
      name: 'materialSymbol',
      title: 'Symbol Material',
      type: 'string',
      hidden: true,
      initialValue: (document) => iconMap[document.name]?.materialSymbol || '',
    },

    // ---- Kod QR jako asset w Sanity ----
    {
      name: 'qrImage',
      title: 'Obraz QR (kod)',
      type: 'image',
      options: {hotspot: true},
      description: 'Zuploaduj plik PNG/JPG z kodem QR',
    },
    {
      name: 'qrAlt',
      title: 'Tekst alternatywny dla QR',
      type: 'string',
      description: 'Np. "Instagram QR Code" - widoczny tylko jesli qr się nie wyświetla prawidłowo',
      initialValue: (document) => `${document.name} QR Code`,
      validation: (Rule) => Rule.required().error('Potrzebny tekst alt dla obrazu QR'),
    },
    {
      name: 'order',
      title: 'Kolejność',
      type: 'number',
      options: {
        list: [
          {title: '1', value: 1},
          {title: '2', value: 2},
          {title: '3', value: 3},
          {title: '4', value: 4},
          {title: '5', value: 5},
          {title: '6', value: 6},
          {title: '7', value: 7},
        ],
      },
    },
  ],
}
