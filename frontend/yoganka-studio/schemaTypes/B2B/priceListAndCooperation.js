// schemas/priceListAndCooperation.js

import {singleLine} from '../../utils/validations'
import * as components from '../../utils/components.jsx'
import {defaultBtnsSet} from '../../utils/sets'

export default {
  name: `b2bPriceListAndCooperation`,
  title: `B2B - Cennik i współpraca + główne przyciski`,
  type: `document`,
  fields: [
    {
      name: `sectionTitle`,
      title: `Tytuł sekcji`,
      type: `string`,
      validation: (Rule) => Rule.max(singleLine.maxLength).error(singleLine.errorMsg),
    },
    components.textList(true),
    defaultBtnsSet,
  ],
  preview: {
    select: {
      title: `sectionTitle`,
    },
  },
}
