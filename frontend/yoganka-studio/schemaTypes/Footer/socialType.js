// schemas/Footer/socialType.js

import * as components from '../../utils/components.jsx';

export default {
  name: 'social',
  title: 'STOPKA - 📱 Social media',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: ' 🔤 Nazwa serwisu',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [
          components.btnsLinksOptions.instagram,
          components.btnsLinksOptions.facebook,
          components.btnsLinksOptions.whatsapp,
          components.btnsLinksOptions.phone,
          components.btnsLinksOptions.mail,
        ],
      },
    },
    components.link({
      description: `W przypadku ☝🏻 maila - podaj adres np."kontakt@yoganka.pl | ☝🏻 Whatsapp z kierunkowym bez '+': 48792891607. |
          ☝🏻 Telefon z kierunkowym : +48792891607. |  ☝🏻 Zewnętrzny link - pełny link`,
      isConditionalFnSet: { parentLabel: 'name' },
    }),
    components.stringImgTitle(),
    components.qrImage(),
    components.qrAlt({
      hiddenFn: undefined,
      initialValFn: document => `${document.name} QR Code`,
    }),
    {
      name: 'order',
      title: '🔢 Kolejność',
      type: 'number',
      options: {
        list: [
          { title: '1️⃣', value: 1 },
          { title: '2️⃣', value: 2 },
          { title: '3️⃣', value: 3 },
          { title: '4️⃣', value: 4 },
          { title: '5️⃣', value: 5 },
          { title: '6️⃣', value: 6 },
          { title: '7️⃣', value: 7 },
        ],
      },
    },
  ],
};
