// schemas/B2B/priceListAndCooperation.js

import * as components from '../../utils/components.jsx';
import { defaultBtnsSet } from '../../utils/sets';

export default {
  name: `b2bPriceListAndCooperation`,
  title: `B2B - 💲 Cennik i współpraca + główne przyciski`,
  type: `document`,
  fields: [
    components.sectionTitle,
    components.textList({ isRequired: true }),
    defaultBtnsSet,
  ],
  preview: {
    select: {
      title: `sectionTitle`,
    },
  },
};
