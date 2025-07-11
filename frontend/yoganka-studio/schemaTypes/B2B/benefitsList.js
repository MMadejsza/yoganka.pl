// schemas/benefitsList.js

import {singleLine} from '../../utils/validations'

export default {
  name: `b2bBenefits`,
  title: `B2B - Benefit'y lista`,
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
      name: 'listType',
      title: 'Typ listy',
      type: 'string',
      description: `Różnica tylko w ikonach`,
      options: {
        list: [
          {title: 'Uwzględnione', value: 'included'},
          {title: 'Dodatkowo płatne', value: 'excluded'},
        ],
      },
      initialValue: 'included',
    },
    {
      name: 'list',
      title: `Lista benefit'ów dla firm`,
      description: `Dodaj każdy punkt jako osobny wiersz`,
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      validation: (Rule) => Rule.required().min(1).error('Dodaj przynajmniej jeden benefit'),
    },
  ],
  preview: {
    select: {
      title: `sectionTitle`,
      list: 'list',
    },
    prepare({title, list}) {
      const count = list.length
      return {
        title,
        subtitle: `Wpisano: ${count}`,
      }
    },
  },
}
