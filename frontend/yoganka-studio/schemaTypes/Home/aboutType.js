// schemas/aboutType.js

import {singleLine} from '../../utils/validations'
import {simpleTitle, mainImage} from '../../utils/components.jsx'

export default {
  name: 'about',
  title: 'GŁÓWNA - Bio',
  type: 'document',
  fields: [
    simpleTitle('O mnie', `Pojawia się tylko w wersji mobile`, true),
    {
      name: 'image',
      title: 'Zdjęcie portretowe',
      type: 'object',
      fields: [
        mainImage,
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
        simpleTitle('Cześć!', '', true),
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
      media: 'image.mainImage',
    },
  },
}
