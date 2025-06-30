// schemas/priceListAndCooperation.js

import {singleLine} from '../../utils/validations'
import {defaultBtnsSet} from '../../utils/elements'

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
      initialValue: (document) => document.name || '',
    },
    {
      name: 'desc',
      title: 'Treść sekcji',
      type: 'text',
    },
    {
      name: 'btnsContent',
      title: 'Przyciski',
      type: 'array',
      of: [defaultBtnsSet],
    },
  ],
  preview: {
    select: {
      title: `sectionTitle`,
    },
  },
}
