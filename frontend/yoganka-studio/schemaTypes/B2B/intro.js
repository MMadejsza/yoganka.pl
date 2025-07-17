// schemas/B2b/intro.js

import { defaultIntroSet } from '../../utils/sets';

export default {
  name: `b2bIntro`,
  title: `B2B - Intro`,
  type: `document`,
  fields: defaultIntroSet,
  preview: {
    select: {
      title: `sectionTitle`,
      media: 'backgroundImage',
    },
  },
};
