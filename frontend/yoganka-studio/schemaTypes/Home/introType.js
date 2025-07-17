// schemas/Home/introType.js

import { singleLine } from '../../utils/validations';

export default {
  name: 'intro',
  title: 'GŁÓWNA - Intro',
  type: 'document',
  fields: [
    {
      name: 'bcgImage',
      title: 'Zdjęcie w tle',
      description: `Pojawia się tylko w wersji mobile`,
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'frontLogo',
      title: 'Główne logo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'motto',
      title: 'Motto',
      type: 'string',
      validation: Rule =>
        Rule.required().max(singleLine.maxLength).error(singleLine.errorMsg),
    },
  ],
  preview: {
    select: {
      title: `motto`,
      media: 'bcgImage',
    },
  },
};
