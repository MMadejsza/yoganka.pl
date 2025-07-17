// schemas/Home/partnerType.js

import { link, sectionTitle } from '../../utils/components.jsx';

export default {
  name: 'partners',
  title: 'GŁÓWNA - Partnerzy',
  type: 'document',
  fields: [
    sectionTitle,
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
              validation: Rule =>
                Rule.required()
                  .max(100)
                  .error('Podaj nazwę partnera (max 100 znaków)'),
            },
            {
              name: 'alt',
              title: 'Tekst alternatywny zdjęcia (title)',
              type: 'string',
              description: 'Krótki opis logo, np. „Yoga Flow Logo”',
              initialValue: `Logo`,
              validation: Rule =>
                Rule.required().error('Podaj tekst alt dla obrazka'),
            },
            link(),
            {
              name: 'logo',
              title: 'Logo partnera',
              type: 'image',
              options: { hotspot: true },
              description: 'Upload pliku PNG/SVG/JPG - najlepiej PNG lub SVG',
              validation: Rule => Rule.required().error('Logo jest wymagane'),
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
};
