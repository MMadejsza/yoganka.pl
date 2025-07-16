// schemas/EventType.js
import {singleLine, doubleLine, tripleLine, urlMaxLength} from '../utils/validations'
import {
  defaultBtnsSet,
  defaultTileFront,
  defaultTileModalPartially,
  bulletsList,
} from '../utils/sets'
import {note, mainImage, slug, date} from '../utils/components.jsx'

export default {
  name: 'event',
  title: '***WYDARZENIA YOGOWE***',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Typ',
      type: 'string',
      hidden: true,
      initialValue: 'event',
    },
    slug,
    date(),
    {
      name: 'order',
      title: 'Kolejność wyświetlania',
      type: 'number',
      description: `Tylko jesli ma się wyłamać z chronologicznej kolejności`,
    },
    {
      name: 'eventType',
      title: 'Typ wydarzenia',
      type: 'string',
      options: {
        list: [
          {title: 'Jednorazowe', value: 'fixed'},
          {title: 'Cykliczne', value: 'repetitive'},
        ],
      },
      initialValue: 'fixed',
      description: `Ma wpływ na automatyczne sortowanie kafli - jednorazowe mają pierwszeństwo`,
    },

    // --- Obrazy
    mainImage,

    // --- Front (kafelek)
    defaultTileFront,

    // --- Modal (okno szczegółów)
    {
      name: 'modal',
      title: 'Zawartość modala/okna',
      type: 'object',
      fields: [...defaultTileModalPartially(), bulletsList(), note, defaultBtnsSet],
    },
  ],
  preview: {
    select: {
      title: `front.title`,
      subtitle: 'front.location',
      media: 'mainImage',
    },
  },
}
