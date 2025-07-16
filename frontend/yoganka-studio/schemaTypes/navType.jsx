// schemas/navType.js
import {stringSymbol} from '../utils/components.jsx'

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
                  validation: (Rule) => Rule.required().max(11).error('Maks. 11 znaków'),
                },
                {
                  name: 'link',
                  title: 'Link',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Wyjazdy', value: '/wyjazdy'},
                      {title: 'Wydarzenia', value: '/wydarzenia'},
                      {title: 'Grafik', value: '/grafik'},
                      {title: 'Dla firm', value: '/yoga-dla-firm'},
                    ],
                  },
                  validation: (Rule) => Rule.required(),
                },
                stringSymbol(),
              ],
              preview: {
                select: {title: 'label', subtitle: 'symbol'},
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
              fields: [
                {
                  name: 'link',
                  title: 'Pełny link',
                  description: 'Np. https://www.facebook.com/people/Yoganka/100094192084948/',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'icon',
                  title: 'Ikona',
                  description: (
                    <span>
                      Akceptuje tylko nazwy z{' '}
                      <a
                        href="https://fontawesome.com/search?ic=free"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        tej listy IKON
                      </a>
                      . Klikasz w ikonę i kopiujesz "Icon name"
                    </span>
                  ),
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
              ],
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
      }
    },
  },
}
