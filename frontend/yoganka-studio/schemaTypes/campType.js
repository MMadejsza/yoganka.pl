// schemas/campType.js

import { date, hiddenType, mainImage, slug } from '../utils/components.jsx';
import { defaultModalSet, defaultTileFrontSet } from '../utils/sets';

export default {
  name: 'camp',
  title: '🛒 ***CAMPY YOGOWE***',
  type: 'document',
  fields: [
    hiddenType({ initialValue: 'camp' }),
    slug,
    date(),
    mainImage,
    defaultTileFrontSet,
    defaultModalSet('Camp'),
  ],
  preview: {
    select: {
      title: `front.title`,
      subtitle: 'front.location',
      media: 'mainImage',
    },
  },
};
