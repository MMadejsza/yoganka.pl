// schemas/Events/eventsIntro.js

import { defaultIntroSet } from '../../utils/sets';

export default {
  name: `eventsIntro`,
  title: `WYDARZENIA - Intro`,
  type: `document`,
  fields: defaultIntroSet,
  preview: {
    select: {
      title: `sectionTitle`,
      media: 'backgroundImage',
    },
  },
};
