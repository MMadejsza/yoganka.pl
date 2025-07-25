// schemas/classType.js

import {
  date,
  hiddenType,
  isModal,
  mainImage,
  slug,
} from '../../utils/components.jsx';
import {
  defaultModalSet,
  defaultTileFrontSet,
  productGroups,
} from '../../utils/sets.jsx';

export default {
  name: 'class',
  title: '🛒 ***ZAJĘCIA YOGOWE***',
  type: 'document',
  groups: productGroups,
  initialValue: {
    type: 'class',
    date: null,
    modal: false,
  },
  fields: [
    hiddenType({ initialValue: 'class' }),
    slug,
    date({ isRequired: false }),
    { ...mainImage, group: 'generic' },
    defaultTileFrontSet,
    isModal,
    defaultModalSet(false, ({ document }) => !document.isModal),
  ],
  preview: {
    select: {
      title: `front.title`,
      media: 'mainImage',
    },
  },
};
