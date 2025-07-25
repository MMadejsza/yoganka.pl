// schemas/eventType.js

import { date, hiddenType, mainImage, slug } from '../../utils/components.jsx';
import {
  defaultModalSet,
  defaultTileFrontSet,
  productGroups,
  productOrdering,
} from '../../utils/sets.jsx';

export default {
  name: 'event',
  title: '🛒 ***WYDARZENIA YOGOWE***',
  type: 'document',
  groups: productGroups,
  fields: [
    hiddenType({ initialValue: 'event' }),
    slug,
    date(),
    {
      name: 'order',
      title: '🔢 Kolejność wyświetlania',
      type: 'number',
      group: 'generic',
      description: `☝🏻 Tylko jesli ma się wyłamać z chronologicznej kolejności`,
    },
    {
      name: 'eventType',
      title: '🧮 Typ wydarzenia',
      type: 'string',
      group: 'generic',
      options: {
        list: [
          { title: '1️⃣ Jednorazowe', value: 'fixed' },
          { title: '🔄 Cykliczne', value: 'repetitive' },
        ],
      },
      initialValue: 'fixed',
      description: `⚠️ Ma wpływ na automatyczne sortowanie kafli - jednorazowe mają pierwszeństwo`,
    },
    { ...mainImage, group: 'generic' },
    defaultTileFrontSet,
    defaultModalSet(),
  ],
  orderings: productOrdering,
  preview: {
    select: {
      title: `front.title`,
      subtitle: 'front.location',
      media: 'mainImage',
    },
  },
};
