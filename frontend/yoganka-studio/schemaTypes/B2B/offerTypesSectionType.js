// schemas/offerTypesSectionType.js

import {singleLine, doubleLine} from '../../utils/validations'
import {defaultTurningTilesSet} from '../../utils/elements'

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
    defaultTurningTilesSet,
  ],
  preview: {
    select: {
      title: `sectionTitle`,
    },
  },
}
