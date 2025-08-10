// schemas/campType.js

import { date, hiddenType, mainImage, slug } from '../../utils/components.jsx';
import {
  defaultModalSet,
  defaultTileFrontSet,
  productGroups,
  productOrdering,
  seoSet,
} from '../../utils/sets.jsx';

export default {
  name: 'camp',
  title: '🛒 ***CAMPY YOGOWE***',
  type: 'document',
  groups: productGroups,
  fields: [
    hiddenType({ initialValue: 'camp' }),
    slug,
    date(),
    { ...mainImage, group: 'generic' },
    defaultTileFrontSet,
    defaultModalSet('Camp'),
    ...seoSet,
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
