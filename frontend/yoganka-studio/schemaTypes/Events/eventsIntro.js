// schemas/eventsIntro.js

import {defaultIntroSet} from '../../utils/elements'

export default {
  name: `eventsIntro`,
  title: `WYDARZENIA - Intro`,
  type: `document`,
  fields: defaultIntroSet,
  preview: {
    select: {
      title: `sectionTitle`,
    },
  },
}
