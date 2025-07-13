// schemas/reviewsSectionType.js
import {singleLine, urlMaxLength} from '../../utils/validations'

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
              description: 'Czego dotyczy recenzja',
              options: {
                list: [
                  {title: 'Zajęcia', value: 'Zajęcia'},
                  {title: 'Wyjazdy', value: 'Wyjazdy'},
                  {title: 'Wydarzenia', value: 'Wydarzenia'},
                  {title: 'Zajęcia dla firm', value: 'Yoga dla firm'},
                  {title: 'Yoga & Sound', value: 'Yoga & Sound'},
                  {title: 'Ogólna', value: 'Ogólna'},
                ],
              },
              validation: (Rule) => Rule.required().error('Wybierz typ produktu'),
            },
            {
              name: 'review',
              title: 'Treść recenzji',
              type: 'text',
              rows: 5,
              description: 'Dłuższy tekst – proszę wklejać bez limitu znaków',
              validation: (Rule) => Rule.required().error('Recenzja nie może być pusta'),
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
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'productName',
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'sectionTitle',
    },
  },
}
