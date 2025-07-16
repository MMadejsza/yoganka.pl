// schemas/campBenefitsType.js
import {singleLine} from '../../utils/validations'
import {defaultTurningTilesSet} from '../../utils/sets'

export default {
  name: `benefits`,
  title: `CAMPY - Benefit'y kafle obrotowe`,
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
      subtitle: `symbol`,
    },
  },
}
