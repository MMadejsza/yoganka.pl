// schemas/B2B/offerSectionType.js
import {
  hiddenType,
  isModal,
  mainImage,
  sectionTitle,
} from '../../utils/components';
import { defaultModalSet, defaultTileFrontSet } from '../../utils/sets';

export default {
  name: `b2bOffer`,
  title: `B2B - Oferta`,
  type: `document`,
  fields: [
    sectionTitle,
    {
      name: 'list',
      title: `Lista produktów dla firm`,
      description: `Kafle`,
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            hiddenType('b2b'),
            mainImage,
            defaultTileFrontSet,
            isModal,
            defaultModalSet(false, ({ parent }) => !parent.isModal),
          ],
          preview: {
            select: {
              title: `front.title`,
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: `sectionTitle`,
    },
  },
};
