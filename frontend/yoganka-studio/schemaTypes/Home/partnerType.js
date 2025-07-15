// schemas/PartnerType.js

import {singleLine} from '../../utils/validations'

export default {
  name: 'partners',
  title: 'GŁÓWNA - Partnerzy',
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
      title: `Lista partnerów`,
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Nazwa partnera',
              type: 'string',
              validation: (Rule) =>
                Rule.required().max(100).error('Podaj nazwę partnera (max 100 znaków)'),
            },
            {
              name: 'alt',
              title: 'Tekst alternatywny zdjęcia (title)',
              type: 'string',
              description: 'Krótki opis logo, np. „Yoga Flow Logo”',
              initialValue: `Logo`,
              validation: (Rule) => Rule.required().error('Podaj tekst alt dla obrazka'),
            },
            {
              name: 'link',
              title: 'Link do partnera',
              type: 'url',
              description: 'Pełny URL do strony partnera, np. https://misyoga.pl/',
              validation: (Rule) =>
                Rule.required()
                  .uri({scheme: ['http', 'https']})
                  .error('Podaj poprawny URL (http[s]://…)'),
            },
            {
              name: 'logo',
              title: 'Logo partnera',
              type: 'image',
              options: {hotspot: true},
              description: 'Upload pliku PNG/SVG/JPG - najlepiej PNG lub SVG',
              validation: (Rule) => Rule.required().error('Logo jest wymagane'),
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'link',
              media: 'logoImage',
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
