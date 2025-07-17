// schemas/Footer/socialType.js

import * as components from '../../utils/components.jsx';

export default {
  name: 'social',
  title: 'STOPKA - Social media',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nazwa serwisu',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [
          { title: 'Instagram', value: 'instagram' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'WhatsApp', value: 'whatsapp' },
          { title: 'Telefon', value: 'phone' },
          { title: 'E-mail', value: 'mail' },
        ],
      },
    },
    components.link({
      description: `W przypadku maila - podaj adres np."kontakt@yoganka.pl | Whatsapp z kierunkowym bez '+': 48792891607. |
          Telefon z kierunkowym : +48792891607. |  Zewnętrzny link - pełny link`,
      isConditionalFnSet: { parentLabel: 'name' },
    }),
    components.stringImgTitle(),

    // ---- Kod QR jako asset w Sanity ----
    {
      name: 'qrImage',
      title: 'Obraz QR (kod)',
      type: 'image',
      options: { hotspot: true },
      description: 'Zuploaduj plik PNG/JPG z kodem QR',
    },
    {
      name: 'qrAlt',
      title: 'Tekst alternatywny dla QR',
      type: 'string',
      description:
        'Np. "Instagram QR Code" - widoczny tylko jesli qr się nie wyświetla prawidłowo',
      initialValue: document => `${document.name} QR Code`,
      validation: Rule =>
        Rule.required().error('Potrzebny tekst alt dla obrazu QR'),
    },
    {
      name: 'order',
      title: 'Kolejność',
      type: 'number',
      options: {
        list: [
          { title: '1', value: 1 },
          { title: '2', value: 2 },
          { title: '3', value: 3 },
          { title: '4', value: 4 },
          { title: '5', value: 5 },
          { title: '6', value: 6 },
          { title: '7', value: 7 },
        ],
      },
    },
  ],
};
