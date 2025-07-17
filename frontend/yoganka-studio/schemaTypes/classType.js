// schemas/classType.js

import {
  date,
  hiddenType,
  isModal,
  mainImage,
  slug,
} from '../utils/components.jsx';
import { defaultModalSet, defaultTileFrontSet } from '../utils/sets';

export default {
  name: 'class',
  title: '***ZAJĘCIA YOGOWE***',
  type: 'document',

  initialValue: {
    type: 'class',
    date: null,
    modal: false,
  },
  fields: [
    {
      name: 'name',
      title: 'Nazwa zajęć',
      type: 'string',
      description: 'np. „Grupowe i Indywidualne” lub „Online”',
      validation: Rule => Rule.required(),
    },
    hiddenType('class'),
    slug,
    date(false),
    mainImage,
    // --------------------
    // Front – kafelek
    // --------------------
    defaultTileFrontSet,

    // --------------------
    // Modal – szczegóły
    // --------------------
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
