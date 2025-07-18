// schemas/eventType.js

import { date, hiddenType, mainImage, slug } from '../utils/components.jsx';
import { defaultModalSet, defaultTileFrontSet } from '../utils/sets';

export default {
  name: 'event',
  title: '🛒 ***WYDARZENIA YOGOWE***',
  type: 'document',
  fields: [
    hiddenType({ initialValue: 'event' }),
    slug,
    date(),
    {
      name: 'order',
      title: '🔢 Kolejność wyświetlania',
      type: 'number',
      description: `☝🏻 Tylko jesli ma się wyłamać z chronologicznej kolejności`,
    },
    {
      name: 'eventType',
      title: '🧮 Typ wydarzenia',
      type: 'string',
      options: {
        list: [
          { title: '1️⃣ Jednorazowe', value: 'fixed' },
          { title: '🔄 Cykliczne', value: 'repetitive' },
        ],
      },
      initialValue: 'fixed',
      description: `⚠️ Ma wpływ na automatyczne sortowanie kafli - jednorazowe mają pierwszeństwo`,
    },
    mainImage,
    defaultTileFrontSet,
    defaultModalSet(),
  ],
  preview: {
    select: {
      title: `front.title`,
      subtitle: 'front.location',
      media: 'mainImage',
    },
  },
};
