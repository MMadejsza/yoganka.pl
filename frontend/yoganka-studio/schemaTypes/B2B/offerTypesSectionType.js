// schemas/offerTypesSectionType.js

import {singleLine, doubleLine} from '../../utils/validations'
import {turningTiles} from '../../utils/elements'

export default {
  name: `b2bOfferTypes`,
  title: `B2B - Typy zajęć kafle obrotowe`,
  type: `document`,
  fields: [
    {
      name: `sectionTitle`,
      title: `Tytuł sekcji`,
      type: `string`,
      validation: (Rule) => Rule.max(singleLine.maxLength).error(singleLine.errorMsg),
      initialValue: (document) => document.name || '',
    },
    turningTiles,
  ],
  preview: {
    select: {
      title: `sectionTitle`,
    },
  },
}
