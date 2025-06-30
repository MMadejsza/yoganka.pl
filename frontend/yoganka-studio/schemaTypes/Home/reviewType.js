// schemas/ReviewType.js
import {singleLine, doubleLine} from '../../utils/validations'

export default {
  name: 'review',
  title: 'GŁÓWNA - Recenzje',
  type: 'document',
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
      title: `Lista recenzji`,
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Imię i nazwisko',
              type: 'string',
              validation: (Rule) =>
                Rule.required().max(100).error('Podaj imię i nazwisko (max 100 znaków)'),
            },
            {
              name: 'productName',
              title: 'Typ produktu',
              type: 'string',
              description: 'Dla czego jest ta recenzja',
              options: {
                list: [
                  {title: 'Zajęcia', value: 'Zajęcia'},
                  {title: 'Wyjazdy', value: 'Wyjazdy'},
                  {title: 'Zajęcia dla firm', value: 'Zajęcia dla firm'},
                  {title: 'Yoga & Sound', value: 'Yoga & Sound'},
                  {title: 'Ogólna', value: 'Ogólna'},
                ],
              },
              validation: (Rule) => Rule.required().error('Wybierz typ produktu'),
            },
            {
              name: 'link',
              title: 'Link (opcjonalnie)',
              type: 'url',
              description: 'np. link do Google Maps lub inny URL',
              validation: (Rule) =>
                Rule.uri({
                  allowRelative: false,
                  scheme: ['http', 'https'],
                }),
            },
            {
              name: 'review',
              title: 'Treść recenzji',
              type: 'text',
              rows: 5,
              description: 'Dłuższy tekst – proszę wklejać bez limitu znaków',
              validation: (Rule) => Rule.required().error('Recenzja nie może być pusta'),
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'sectionTitle',
      subtitle: 'productName',
      media: 'photo',
    },
  },
}
