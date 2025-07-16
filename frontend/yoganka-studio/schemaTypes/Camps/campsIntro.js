// schemas/priceListAndCooperation.js

import {defaultIntroSet} from '../../utils/sets'

export default {
  name: `campsIntro`,
  title: `CAMPY - Intro`,
  type: `document`,
  fields: defaultIntroSet,
  preview: {
    select: {
      title: `sectionTitle`,
      media: 'backgroundImage',
    },
  },
}
