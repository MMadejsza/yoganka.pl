// schemas/offerSectionType.js

import {singleLine} from '../../utils/validations'
import {
  defaultTileFront,
  defaultTileModalPartially,
  bulletsList,
  defaultBtnsSet,
} from '../../utils/sets'
import {mainImage, note} from '../../utils/components'

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
            mainImage,
            defaultTileFront,
            {
              name: 'isModal',
              title: 'Czy ma modal?',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'modal',
              title: 'Zawartość modala/okna',
              type: 'object',
              hidden: ({document}) => !document.isModal,
              fields: [...defaultTileModalPartially(true), bulletsList(), note, defaultBtnsSet],
            },
          ],
          preview: {
            select: {
              title: `front.title`,
            },
          },
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
