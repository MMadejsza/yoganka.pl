// schemas/B2B/offerTypesSectionType.js

import { sectionTitle } from '../../utils/components.jsx';
import { defaultTurningTilesSet } from '../../utils/sets';

export default {
  name: `b2bOfferTypes`,
  title: `B2B - Typy zajęć kafle obrotowe`,
  type: `document`,
  fields: [sectionTitle, defaultTurningTilesSet],
  preview: {
    select: {
      title: `sectionTitle`,
    },
  },
};
