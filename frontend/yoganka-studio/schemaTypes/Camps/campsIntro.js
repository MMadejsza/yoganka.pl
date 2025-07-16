// schemas/priceListAndCooperation.js

import {defaultIntroSet} from '../../utils/elements'

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
