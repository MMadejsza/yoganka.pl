// schemas/benefitsList.js

import {singleLine} from '../../utils/validations'
import {typesList, stringList} from '../../utils/components.jsx'

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
    typesList,
    stringList(true),
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
