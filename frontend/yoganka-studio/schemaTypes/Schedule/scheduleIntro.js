// schemas/eventsIntro.js

import {defaultIntroSet} from '../../utils/elements'

export default {
  name: `scheduleIntro`,
  title: `GRAFIK - Intro`,
  type: `document`,
  fields: defaultIntroSet,
  preview: {
    select: {
      title: `sectionTitle`,
      media: 'backgroundImage',
    },
  },
}
