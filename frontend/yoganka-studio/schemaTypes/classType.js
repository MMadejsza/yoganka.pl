// schemas/classType.js

import {
  defaultBtnsSet,
  defaultTileFront,
  defaultTileModalPartially,
  bulletsList,
} from '../utils/sets'
import {note, mainImage, slug, date} from '../utils/components.jsx'

export default {
  name: 'class',
  title: '***ZAJĘCIA YOGOWE***',
  type: 'document',

  initialValue: {
    type: 'class',
    date: null,
    modal: false,
  },
  fields: [
    {
      name: 'name',
      title: 'Nazwa zajęć',
      type: 'string',
      description: 'np. „Grupowe i Indywidualne” lub „Online”',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'type',
      title: 'Typ',
      type: 'string',
      hidden: true,
      initialValue: 'class',
    },
    slug,
    date(false),
    mainImage,
    // --------------------
    // Front – kafelek
    // --------------------
    defaultTileFront,

    // --------------------
    // Modal – szczegóły
    // --------------------
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
      media: 'mainImage',
    },
  },
}
