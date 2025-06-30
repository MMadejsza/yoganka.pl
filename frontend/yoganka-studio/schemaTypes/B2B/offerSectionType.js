// schemas/offerSectionType.js

import {singleLine, doubleLine} from '../../utils/validations'
import {defaultBtnsSet} from '../../utils/elements'

export default {
  name: `b2bOffer`,
  title: `B2B - Oferta`,
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
      title: `Lista produktów dla firm`,
      description: `Kafle`,
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Typ',
              type: 'string',
              hidden: true,
              initialValue: 'b2b',
            },
            {
              name: 'mainImage',
              title: 'Główne zdjęcie',
              type: 'image',
              options: {hotspot: true},
            },
            {
              name: 'front',
              title: 'Front - dane kafla',
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Tytuł na kaflu',
                  type: 'string',
                  validation: (Rule) =>
                    Rule.required().max(doubleLine.maxLength).error(doubleLine.errorMsg),
                },
                {
                  name: 'dates',
                  title: 'Daty (np. 05-10.08)',
                  type: 'array',
                  of: [{type: 'string'}],
                  description: `Lub inne dane - struktura kafli jest zawsze taka sama`,
                },
                {
                  name: 'location',
                  title: 'Lokalizacja',
                  type: 'string',
                  description: `Lub inne dane - struktura kafli jest zawsze taka sama`,
                  validation: (Rule) => Rule.max(doubleLine.maxLength).error(doubleLine.errorMsg),
                },
                {
                  name: 'desc',
                  title: 'Opis na kaflu',
                  type: 'text',
                },
                {
                  name: 'btnsContent',
                  title: 'Przyciski',
                  type: 'array',
                  of: [defaultBtnsSet],
                },
              ],
            },
            {
              name: 'back',
              title: 'Opis po kliknięciu (jeśli dotyczy)',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: `sectionTitle`,
    },
  },
}
