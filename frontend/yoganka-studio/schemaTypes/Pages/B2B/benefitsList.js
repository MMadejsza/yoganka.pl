// schemas/B2B/benefitsList.js

import {
  sectionTitle,
  stringList,
  typesList,
} from '../../../utils/components.jsx';

export default {
  name: `b2bBenefits`,
  title: `💼 B2B - ☑️ Benefit'y lista`,
  type: `document`,
  fields: [sectionTitle, typesList, stringList({ isRequired: true })],
  preview: {
    select: {
      title: `sectionTitle`,
      list: 'list',
    },
    prepare({ title, list }) {
      const count = list.length;
      return {
        title,
        subtitle: `Wpisano: ${count}`,
      };
    },
  },
};
