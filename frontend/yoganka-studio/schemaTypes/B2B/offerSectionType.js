// schemas/B2B/offerSectionType.js
import {
  hiddenType,
  isModal,
  mainImage,
  sectionTitle,
} from '../../utils/components';
import {
  defaultModalSet,
  defaultTileFrontSet,
  productGroups,
} from '../../utils/sets';

export default {
  name: `b2bOffer`,
  title: `B2B - 🛒 Oferta`,
  type: `document`,
  fields: [
    sectionTitle,
    {
      name: 'list',
      title: `💼 Oferta dla firm`,
      description: `☝🏻 Kafle`,
      type: 'array',
      of: [
        {
          type: 'object',
          groups: productGroups,
          fields: [
            hiddenType({ initialValue: 'b2b' }),
            { ...mainImage, group: 'generic' },
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
