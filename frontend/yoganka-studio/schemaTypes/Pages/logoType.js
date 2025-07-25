// schemas/logoType.js
import * as components from '../../utils/components.jsx';
import { logoGroups } from '../../utils/sets.js';

export default {
  name: 'logotypes',
  title: '📷 LOGOTYPY',
  type: 'document',
  groups: logoGroups,
  fields: [
    {
      name: 'fullLogo',
      title: '📷 Pełne logo',
      type: 'object',
      group: 'main',
      fields: [
        components.logoImg(),
        components.stringImgTitle({ initialValue: 'Yoganka - Logo' }),
      ],
    },
    {
      name: 'justBody',
      title: '📷 Logo - sam kształt',
      type: 'object',
      group: 'figure',
      fields: [
        components.logoImg(),
        components.logoImg({ isActive: 'active' }),
        components.stringImgTitle({ initialValue: 'Yoganka - Logo' }),
      ],
    },
    {
      name: 'justSign',
      title: '📷 Logo - sam napis',
      type: 'object',
      group: 'sign',
      fields: [
        components.logoImg(),
        components.stringImgTitle({ initialValue: 'Yoganka - Logo' }),
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
