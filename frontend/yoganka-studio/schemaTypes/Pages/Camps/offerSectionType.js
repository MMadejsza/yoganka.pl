// schemas/Camps/offerSectionType.js

import { simpleTitle } from '../../../utils/components.jsx';

export default {
  name: 'campsOffer',
  title: '🏕️ CAMPY - 🛒 Tytuł Oferty',
  type: 'document',
  fields: [simpleTitle({ required: true })],
  preview: {
    prepare() {
      return {
        title: '📋 Tytuł oferty',
      };
    },
  },
};
