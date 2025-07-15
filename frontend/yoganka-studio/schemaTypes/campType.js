// schemas/CampType.js
import {singleLine, doubleLine, tripleLine, urlMaxLength} from '../utils/validations'
import {defaultBtnsSet, defaultGlanceSet} from '../utils/elements'

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
    {
      name: 'slug',
      title: 'Link (URL)',
      type: 'slug',
      description: `Tylko końcówka, bez "/". np. "camp-peak-yoga"`,
      options: {source: 'name', maxLength: urlMaxLength},
      validation: (Rule) =>
        Rule.required().custom((text) =>
          text.current.includes('/') ? 'Link nie może zawierać znaku "/"' : true,
        ),
    },
    {
      name: 'date',
      title: 'Data rozpoczęcia',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'mainImage',
      title: 'Główne zdjęcie',
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'front',
      title: 'Dane kafla (front)',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Tytuł',
          type: 'string',
          description: `Używaj twardych spacji zamiast zwykłych, żeby tekst się nie łamał nieoczekiwanie.
            Windows: kopiuj spację z między a i b - > a b.
            macOS: naciśnij Option + Spacja → wstawi się NBSP.`,
          initialValue: (document) => document.name || '',
          validation: (Rule) =>
            Rule.required().max(tripleLine.maxLength).error(tripleLine.errorMsg),
        },
        {
          name: 'dates',
          title: 'Daty (np. 05-10.08) - wizualnie',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'location',
          title: 'Lokalizacja',
          type: 'string',
          validation: (Rule) => Rule.max(doubleLine.maxLength).error(doubleLine.errorMsg),
        },
        {
          name: 'desc',
          title: 'Opis skrócony',
          type: 'text',
          description: `Używaj twardych spacji (Unicode U+00A0) zamiast zwykłych spacji, żeby tekst się nie łamał.
            Windows: Windows: kopiuj spację z między a i b - > a b.
            macOS: naciśnij Option + Spacja → wstawi się NBSP.`,
        },
        {
          name: 'btnsContent',
          title: 'Przyciski kafla',
          type: 'array',
          of: [defaultBtnsSet],
        },
      ],
    },
    {
      name: 'modal',
      title: 'Zawartość modala/okna',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Tytuł modala/okna',
          type: 'string',
          initialValue: (document) => document.front?.title || '',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'gallery',
          title: 'Galeria zdjęć',
          type: 'array',
          of: [{type: 'image', options: {hotspot: true}}],
        },
        {
          name: 'glanceTitle',
          title: 'Tytuł bullet-listy',
          type: 'string',
          validation: (Rule) => Rule.max(singleLine.maxLength).error(singleLine.errorMsg),
        },
        defaultGlanceSet,
        {
          name: 'fullDescTitle',
          title: 'Tytuł opisu',
          type: 'string',
        },
        {
          name: 'fullDesc',
          title: 'Treść opisu',
          type: 'text',
          description: `Pełny - nie skrócony.
          Używaj twardych spacji (Unicode U+00A0) zamiast zwykłych spacji, żeby tekst się nie łamał.
             Windows: Windows: kopiuj spację z między a i b - > a b.
            macOS: naciśnij Option + Spacja → wstawi się NBSP.`,
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'plan',
          title: 'Plan dnia',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Nagłówek planu',
              type: 'string',
              validation: (Rule) => Rule.max(doubleLine.maxLength).error(doubleLine.errorMsg),
              initialValue: 'Slow menu:',
            },
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
              title: 'W cenie',
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Nagłówek',
                  type: 'string',
                  description: 'W cenie: (✔️)',
                  initialValue: 'W cenie:',
                },
                {
                  name: 'list',
                  title: 'Lista elementów',
                  type: 'array',
                  of: [{type: 'string'}],
                },
              ],
            },
            {
              name: 'excluded',
              title: 'Dodatkowo płatne ',
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Nagłówek',
                  type: 'string',
                  description: 'Dodatkowo płatne: (👉)',
                  initialValue: 'Dodatkowo płatne:',
                },
                {
                  name: 'list',
                  title: 'Lista elementów',
                  type: 'array',
                  of: [{type: 'string'}],
                },
              ],
            },
            {
              name: 'optional',
              title: 'Opcjonalne',
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Nagłówek',
                  type: 'string',
                  description: 'Poszerz swoje menu: (➕)',
                  initialValue: 'Poszerz swoje menu:',
                },
                {
                  name: 'list',
                  title: 'Lista elementów',
                  type: 'array',
                  of: [{type: 'string'}],
                },
              ],
            },
            {
              name: 'freeTime',
              title: 'W czasie wolnym',
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Nagłówek',
                  type: 'string',
                  description: 'W czasie wolnym:',
                  initialValue: 'W czasie wolnym:',
                },
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
        {name: 'note', title: 'Notatka', type: 'string'},
        {
          name: 'btnsContent',
          title: 'Przyciski modala',
          type: 'array',
          of: [defaultBtnsSet],
        },
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
