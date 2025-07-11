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
      title: `Lista akapitów sekcji`,
      description: `Dodaj akapit osobno - pojawia sie mała przerwa między nimi.`,
      type: 'array',
      of: [
        {
          type: 'text',
        },
      ],
      validation: (Rule) => Rule.required().min(1).error('Dodaj przynajmniej jeden akapit'),
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
