// schemas/Events/offerSectionType.js

import { simpleTitle } from '../../../utils/components.jsx';

export default {
  name: 'eventsOffer',
  title: '🎭 WYDARZENIA - 🛒 Tytuł Oferty',
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
