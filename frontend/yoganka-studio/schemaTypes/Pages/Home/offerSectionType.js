// schemas/Home/offerSectionType.js

import { simpleTitle } from '../../../utils/components.jsx';
import { singleLine } from '../../../utils/validations';

export default {
  name: 'offer',
  title: '🏠 GŁÓWNA - 🛒 Tytuły Oferty',
  type: 'document',
  fields: [
    {
      name: 'camps',
      title: '🏕️ Podsekcja wyjazdów',
      type: 'object',
      fields: [simpleTitle({ required: true })],
    },
    {
      name: 'classes',
      title: '🧘 Podsekcja zajęć',
      type: 'object',
      fields: [simpleTitle({ required: true })],
    },
    {
      name: 'events',
      title: '🎉 Podsekcja wydarzeń',
      type: 'object',
      fields: [
        simpleTitle({ required: true }),
        {
          name: 'limit',
          title: '🔢 Limit kafli',
          description: `☝🏻 Maksymalna liczba kafli wyświetlanych na stronie głównej`,
          type: 'number',
          options: {
            list: [
              { title: '3️⃣', value: 3 },
              { title: '4️⃣', value: 4 },
              { title: '5️⃣', value: 5 },
              { title: '6️⃣', value: 6 },
              { title: '7️⃣', value: 7 },
              { title: '8️⃣', value: 8 },
              { title: '9️⃣', value: 9 },
            ],
          },
          initialValue: 3,
          validation: Rule =>
            Rule.required()
              .integer()
              .min(1)
              .max(9)
              .error('⚠️ Podaj poprawną liczbę kafli'),
        },
      ],
    },
    {
      name: 'moreTitle',
      title: '➕ Tytuł kafla "więcej"',
      type: 'string',
      initialValue: 'Więcej...',
      validation: Rule =>
        Rule.required().max(singleLine.maxLength).error(singleLine.errorMsg),
    },
  ],
  preview: {
    prepare() {
      return {
        title: '📋 Tytuły oferty',
      };
    },
  },
};
