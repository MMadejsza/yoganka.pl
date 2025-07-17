// schemas/logoType.js
import * as components from '../utils/components.jsx';

export default {
  name: 'logotypes',
  title: 'LOGOTYPY',
  type: 'document',
  fields: [
    {
      name: 'fullLogo',
      title: 'Pełne logo',
      type: 'object',
      fields: [
        components.stringImgTitle('Yoganka - Logo'),
        components.logoImg(),
      ],
    },
    {
      name: 'justBody',
      title: 'Logo - sam kształt',
      type: 'object',
      fields: [
        components.stringImgTitle('Yoganka - Logo'),
        components.logoImg(),
        components.logoImg('active'),
      ],
    },
    {
      name: 'justSign',
      title: 'Logo - sam napis',
      type: 'object',
      fields: [
        components.stringImgTitle('Yoganka - Logo'),
        components.logoImg(),
      ],
    },
  ],
  preview: {
    select: { logo: 'fullLogo.img' },
    prepare({ logo }) {
      return {
        title: `Logotypy`,
        media: logo,
      };
    },
  },
};
