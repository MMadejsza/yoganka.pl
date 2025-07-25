// schemas/Home/aboutType.js

import { mainImage, simpleTitle } from '../../../utils/components.jsx';
import { aboutGroups } from '../../../utils/sets.jsx';
import { singleLine } from '../../../utils/validations';

export default {
  name: 'about',
  title: '🏠 GŁÓWNA - 👤 Bio',
  type: 'document',
  groups: aboutGroups,
  fields: [
    simpleTitle({
      initialValue: 'O mnie',
      description: `Pojawia się tylko w wersji mobile. Twarda spacja do skopiowania - miedzy gwiazdkami: ** **`,
      required: true,
    }),
    {
      name: 'image',
      title: '📸 Zdjęcie portretowe',
      type: 'object',
      group: 'media',
      fields: [
        mainImage,
        {
          name: 'stamped',
          title: '🏷️ Czy ma zdjęcia "znaczki/stamps"?',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'stamp1',
          title: '🖼️ Pierwsze logo-zdjęcie "stamp"',
          description: `☝🏻 Pojawia się tylko w wersji mobile`,
          type: 'image',
          hidden: ({ document }) => !document.image.stamped,
          options: { hotspot: true },
          validation: Rule => {
            Rule.custom((value, context) => {
              if (!value && context.document.image.stamped) {
                return '⚠️ Albo 2x logo albo 0';
              }
              return true;
            });
          },
        },
        {
          name: 'stamp2',
          title: '🖼️ Drugie logo-zdjęcie "stamp"',
          description: `☝🏻 Pojawia się tylko w wersji mobile`,
          type: 'image',
          hidden: ({ document }) => !document.image.stamped,
          options: { hotspot: true },
          validation: Rule => {
            Rule.custom((value, context) => {
              if (!value && context.document.image.stamped) {
                return '⚠️ Albo 2x logo albo 0';
              }
              return true;
            });
          },
        },
      ],
    },
    {
      name: 'bio',
      title: '📖 Biografia',
      type: 'object',
      group: 'bio',
      fields: [
        simpleTitle({ initialValue: 'Cześć!', required: true }),
        {
          name: 'paragraphs',
          title: '✍️ Akapity',
          type: 'array',
          of: [{ type: 'text' }],
        },
        {
          name: 'signature',
          title: '🖊️ Podpis',
          type: 'string',
          validation: Rule =>
            Rule.max(singleLine.maxLength).error(singleLine.errorMsg),
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
};
