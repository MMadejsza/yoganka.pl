// schemas/campBenefitsType.js
import {singleLine, doubleLine} from '../../utils/validations'

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
    {
      name: 'list',
      title: `Lista benefit'ów`,
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: `symbol`,
              title: `Symbol (Material Icon)`,
              type: `string`,
              description: `Nazwa ikony Material Symbols, np. "self_improvement", "park" dostępne na https://fonts.google.com/icons`,
              validation: (Rule) => Rule.required().error(`Wybierz symbol`),
            },
            {
              name: `title`,
              title: `Nagłówek benefit'u`,
              type: `string`,
              description: `Krótki tytuł benefit'u, max. ${doubleLine.maxLength} znaków`,
              validation: (Rule) =>
                Rule.required().max(doubleLine.maxLength).error(doubleLine.errorMsg),
            },
            {
              name: `text`,
              title: `Opis benefit'u`,
              type: `text`,
              description: `Szczegółowy opis benefit'u`,
              rows: 4,
              validation: (Rule) =>
                Rule.required().max(175).warning(`Za długi opis. maks 175 znaków.`),
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: `sectionTitle`,
      subtitle: `symbol`,
    },
  },
}
