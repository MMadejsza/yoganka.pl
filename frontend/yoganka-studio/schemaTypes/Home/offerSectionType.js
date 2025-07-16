// schemas/offerSectionType.js.js

import {singleLine} from '../../utils/validations'
import {simpleTitle} from '../../utils/components.jsx'

export default {
  name: 'offer',
  title: 'GŁÓWNA - Oferta',
  type: 'document',
  fields: [
    {
      name: 'camps',
      title: 'Podsekcja wyjazdów',
      type: 'object',
      fields: [simpleTitle('', '', true)],
    },
    {
      name: 'classes',
      title: 'Podsekcja zajęć',
      type: 'object',
      fields: [simpleTitle('', '', true)],
    },
    {
      name: 'events',
      title: 'Podsekcja wydarzeń',
      type: 'object',
      fields: [
        simpleTitle('', '', true),
        {
          name: 'limit',
          title: 'Limit kafli',
          description: `Maksymalna liczba kafli wyświetlanych na stronie głównej`,
          type: 'number',
          options: {
            list: [
              {title: '9', value: 9},
              {title: '8', value: 8},
              {title: '7', value: 7},
              {title: '6', value: 6},
              {title: '5', value: 5},
              {title: '4', value: 4},
              {title: '3', value: 3},
            ],
          },
          initialValue: 3,
          validation: (Rule) =>
            Rule.required().integer().min(1).max(9).error('Podaj poprawną liczbę kafli'),
        },
      ],
    },
    {
      name: 'moreTitle',
      title: 'Tytuł kafla "więcej"',
      type: 'string',
      initialValue: 'Więcej...',
      validation: (Rule) => Rule.required().max(singleLine.maxLength).error(singleLine.errorMsg),
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Tytuły oferty',
      }
    },
  },
}
