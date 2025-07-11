// schemas/priceListAndCooperation.js

import {singleLine} from '../../utils/validations'

export default {
  name: `b2bIntro`,
  title: `B2B - Intro`,
  type: `document`,
  fields: [
    {
      name: 'backgroundImage',
      title: 'Zdjęcie w tle',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: `sectionTitle`,
      title: `Tytuł sekcji - na tle`,
      type: `string`,
      validation: (Rule) => Rule.max(singleLine.maxLength).error(singleLine.errorMsg),
      initialValue: (document) => document.name || '',
    },
    {
      name: 'list',
      title: `Lista akapitów`,
      description: `Dodaj akapit osobno - pojawia sie mała przerwa między nimi.`,
      type: 'array',
      of: [
        {
          type: 'text',
        },
      ],
      validation: (Rule) => Rule.required().min(1).error('Dodaj przynajmniej jeden akapit'),
    },
  ],
  preview: {
    select: {
      title: `sectionTitle`,
    },
  },
}
