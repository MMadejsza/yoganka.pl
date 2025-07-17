// schemas/navType.js
import { link, stringIcon, stringSymbol } from '../utils/components.jsx';

export default {
  name: 'navs',
  title: 'MENU - zestawy',
  type: 'document',
  fields: [
    {
      name: 'mainNav',
      title: 'Menu Główne',
      type: 'object',
      fields: [
        {
          name: 'list',
          title: 'Zakładki',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'label',
                  title: 'Nazwa zakładki',
                  type: 'string',
                  validation: Rule =>
                    Rule.required().max(11).error('Maks. 11 znaków'),
                },
                {
                  name: 'link',
                  title: 'Link',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Wyjazdy', value: '/wyjazdy' },
                      { title: 'Wydarzenia', value: '/wydarzenia' },
                      { title: 'Grafik', value: '/grafik' },
                      { title: 'Dla firm', value: '/yoga-dla-firm' },
                    ],
                  },
                  validation: Rule => Rule.required(),
                },
                stringSymbol(),
              ],
              preview: {
                select: { title: 'label', subtitle: 'symbol' },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'sideNav',
      title: 'Menu małe',
      type: 'object',
      fields: [
        {
          name: 'list',
          title: 'Zakładki',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [link(), stringIcon],
            },
          ],
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: `MENU - zestawy`,
      };
    },
  },
};
