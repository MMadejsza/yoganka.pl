// schemas/CampType.js
import {singleLine, doubleLine, tripleLine, urlMaxLength} from '../utils/validations'
import {defaultBtnsSet, defaultTileFront, defaultTileModalPartially} from '../utils/sets'
import {note, mainImage, slug, date, stringList, simpleTitle} from '../utils/components.jsx'

export default {
  name: 'camp',
  title: '***CAMPY YOGOWE***',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Typ',
      type: 'string',
      hidden: true,
      initialValue: 'camp',
    },
    slug,
    date(),
    mainImage,
    defaultTileFront,
    {
      name: 'modal',
      title: 'Zawartość modala/okna',
      type: 'object',
      fields: [
        ...defaultTileModalPartially(true),
        {
          name: 'plan',
          title: 'Plan dnia',
          type: 'object',
          fields: [
            simpleTitle('Slow menu:'),
            {
              name: 'schedule',
              title: 'Dni i aktywności',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'day',
                      title: 'Dzień tygodnia',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Poniedziałek', value: 'Poniedziałek:'},
                          {title: 'Wtorek', value: 'Wtorek:'},
                          {title: 'Środa', value: 'Środa:'},
                          {title: 'Czwartek', value: 'Czwartek:'},
                          {title: 'Piątek', value: 'Piątek:'},
                          {title: 'Sobota', value: 'Sobota:'},
                          {title: 'Niedziela', value: 'Niedziela:'},
                          {title: 'Combo', value: 'combo'},
                        ],
                      },
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'comboLabel',
                      title: 'Zakres dni (np. Piątek-Niedziela)',
                      type: 'string',
                      hidden: ({parent}) => parent.day !== 'combo',
                      validation: (Rule) =>
                        Rule.custom((value) => {
                          // jeśli nie combo, OK
                          if (!value && parent?.day === 'combo') {
                            return 'Musisz podać zakres dni dla opcji Combo'
                          }
                          return true
                        }),
                    },
                    {
                      name: 'entries',
                      title: 'Godziny i opisy aktywności',
                      type: 'array',
                      of: [
                        {
                          type: 'object',
                          fields: [
                            {
                              name: 'time',
                              title: 'Godzina (np. 16:00)',
                              type: 'string',
                              validation: (Rule) => Rule.required(),
                            },
                            {
                              name: 'activity',
                              title: 'Opis aktywności',
                              type: 'string',
                              validation: (Rule) => Rule.required(),
                            },
                          ],
                          preview: {
                            select: {
                              time: 'time',
                              activity: 'activity',
                            },
                            prepare({time, activity}) {
                              return {
                                title: `${time} ${activity}`,
                              }
                            },
                          },
                        },
                      ],
                    },
                  ],
                  preview: {
                    select: {
                      day: 'day',
                      combo: 'comboLabel',
                      entries: 'entries',
                    },
                    prepare({day, combo, entries}) {
                      const title = combo || day
                      const subtitle = entries?.length
                        ? `Aktywności: ${entries.length}`
                        : 'Brak aktywności'
                      return {
                        title,
                        subtitle,
                      }
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'summary',
          title: 'Sekcja podsumowania',
          description: 'Różnią się tylko emotikonem',
          type: 'object',
          fields: [
            {
              name: 'included',
              title: 'W cenie (✔️)',
              type: 'object',
              fields: [simpleTitle(`W cenie:`), stringList()],
            },
            {
              name: 'excluded',
              title: 'Dodatkowo płatne (👉)',
              type: 'object',
              fields: [simpleTitle('Dodatkowo płatne:'), stringList()],
            },
            {
              name: 'optional',
              title: 'Opcjonalne (➕)',
              type: 'object',
              fields: [simpleTitle('Poszerz swoje menu:'), stringList()],
            },
            {
              name: 'freeTime',
              title: 'W czasie wolnym',
              type: 'object',
              fields: [
                simpleTitle(`W czasie wolnym:`),
                {
                  name: 'list',
                  title: 'Lista aktywności',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        {
                          name: 'status',
                          title: 'Status',
                          type: 'string',
                          options: {
                            list: [
                              {title: 'W cenie', value: 'free'},
                              {title: 'Opcjonalnie', value: 'optional'},
                            ],
                          },
                        },
                        {name: 'activity', title: 'Aktywność', type: 'string'},
                      ],
                      preview: {
                        select: {
                          status: 'status',
                          activity: 'activity',
                        },
                        prepare({status, activity}) {
                          const icon = status === 'optional' ? '💰' : '✅'
                          return {
                            title: `${icon} ${activity || '(brak)'}`,
                          }
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        note,
        defaultBtnsSet,
      ],
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
