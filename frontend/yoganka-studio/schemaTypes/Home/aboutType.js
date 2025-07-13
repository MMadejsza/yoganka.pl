// schemas/aboutType.js

import {singleLine} from '../../utils/validations'

export default {
  name: 'about',
  title: 'GŁÓWNA - Bio',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tytuł',
      description: `Pojawia się tylko w wersji mobile`,
      initialValue: 'O mnie',
      type: 'string',
      validation: (Rule) => Rule.required().max(singleLine.maxLength).error(singleLine.errorMsg),
    },
    {
      name: 'image',
      title: 'Zdjęcie portretowe',
      type: 'object',
      fields: [
        {
          name: 'portraitImage',
          title: 'Zdjęcie główne',
          type: 'image',
          options: {hotspot: true},
        },
        {
          name: 'stamped',
          title: 'Czy ma zdjęcia "znaczki/stamps"?',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'stamp1',
          title: 'Pierwsze logo-zdjęcie "stamp"',
          description: `Pojawia się tylko w wersji mobile`,
          type: 'image',
          hidden: ({document}) => !document.image.stamped,
          options: {hotspot: true},
          validation: (Rule) => {
            Rule.custom((value, context) => {
              if (!value && context.document.image.stamped) {
                return 'Albo 2x logo albo 0'
              }
              return true
            })
          },
        },
        {
          name: 'stamp2',
          title: 'Drugie logo-zdjęcie "stamp"',
          description: `Pojawia się tylko w wersji mobile`,
          type: 'image',
          hidden: ({document}) => !document.image.stamped,
          options: {hotspot: true},
          validation: (Rule) => {
            Rule.custom((value, context) => {
              if (!value && context.document.image.stamped) {
                return 'Albo 2x logo albo 0'
              }
              return true
            })
          },
        },
      ],
    },
    {
      name: 'bio',
      title: 'Biografia',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Nagłówek',
          type: 'string',
          initialValue: 'Cześć!',
          validation: (Rule) =>
            Rule.required().max(singleLine.maxLength).error(singleLine.errorMsg),
        },
        {
          name: 'paragraphs',
          title: 'Akapity',
          type: 'array',
          of: [{type: 'text'}],
        },
        {
          name: 'signature',
          title: 'Podpis',
          type: 'string',
          validation: (Rule) => Rule.max(singleLine.maxLength).error(singleLine.errorMsg),
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'bio.signature',
      media: 'image.portraitImage',
    },
  },
}
