// schemas/CampType.js
// Sanity schema for Yoga Camps, reflecting CAMPS_DATA.js with Polish titles and predefined options
import {singleLine, doubleLine, tripleLine, urlMaxLength} from '../utils/validations'
import {defaultBtnsSet} from '../utils/elements'

export default {
  name: 'camp',
  title: 'Obóz Yogowy',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nazwa obozu - dla sanity',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
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
      name: 'gallery',
      title: 'Galeria zdjęć',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    },
    {
      name: 'pastGallery',
      title: 'Jak było - galeria zdjęć',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
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
            Windows: przytrzymaj Alt i na klawiaturze numerycznej wpisz 0160, puść Alt → wstawi się spacja nierozdzielająca (NBSP).
            macOS: naciśnij Option + Spacja → wstawi się NBSP.`,
          initialValue: (document) => document.name || '',
          validation: (Rule) =>
            Rule.required().max(tripleLine.maxLength).error(tripleLine.errorMsg),
        },
        {name: 'dates', title: 'Daty (np. 05-10.08)', type: 'array', of: [{type: 'string'}]},
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
            Windows: przytrzymaj Alt i na klawiaturze numerycznej wpisz 0160, puść Alt → wstawi się spacja nierozdzielająca (NBSP).
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
          name: 'glanceTitle',
          title: 'Tytuł bullet-listy',
          type: 'string',
          validation: (Rule) => Rule.max(singleLine.maxLength).error(singleLine.errorMsg),
        },
        {
          name: 'glance',
          title: 'Szybkie info (glance)',
          type: 'object',
          fields: [
            {name: 'price', title: 'Cena', type: 'string'},
            {name: 'area', title: 'Lokalizacja', type: 'string'},
            {name: 'accommodation', title: 'Zakwaterowanie', type: 'string'},
            {
              name: 'capacity',
              title: 'Maks. liczba osób w grupie',
              type: 'number',
              validation: (Rule) =>
                Rule.custom((value) => {
                  if (value === undefined || value === null) return true
                  return value >= 1 || 'Podaj liczbę większą od 0'
                }),
            },
            {name: 'travel', title: 'Transport', type: 'string'},
          ],
        },
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
            Windows: przytrzymaj Alt i na klawiaturze numerycznej wpisz 0160, puść Alt → wstawi się spacja nierozdzielająca (NBSP).
            macOS: naciśnij Option + Spacja → wstawi się NBSP.`,
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'planTitle',
          title: 'Nagłówek planu wyjazdu',
          type: 'string',
          description: 'Tytuł sekcji planu wyjazdu',
          validation: (Rule) => Rule.max(doubleLine.maxLength).error(doubleLine.errorMsg),
        },
        {
          name: 'plan',
          title: 'Plan dnia',
          type: 'array',
          of: [
            {
              type: 'object',
              title: 'Dzień',
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
                  title: 'Zakres dni (np. Poniedziałek-Środa)',
                  type: 'string',
                  description: 'Wpisz nazwę kombinacji dni, np. „Poniedziałek–Środa”.',
                  // pokaż to pole tylko jeśli day === 'combo'
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
                  title: 'Godziny i opis',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        {name: 'time', title: 'Godzina (np. 17:00)', type: 'string'},
                        {name: 'desc', title: 'Opis aktywności', type: 'string'},
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'summary',
          title: 'Sekcja podsumowania - listy',
          type: 'object',
          fields: [
            {
              name: 'includedTitle',
              title: 'Nagłówek sekcji "W cenie"',
              type: 'string',
              validation: (Rule) => Rule.max(singleLine.maxLength).error(singleLine.errorMsg),
            },
            {
              name: 'included',
              title: 'Sekcja "W cenie" - elementy',
              type: 'array',
              of: [{type: 'string'}],
            },
            {
              name: 'optionalTitle',
              title: 'Nagłówek sekcji "Opcjonalnie płatne"',
              type: 'string',
              validation: (Rule) => Rule.max(singleLine.maxLength).error(singleLine.errorMsg),
            },
            {
              name: 'optional',
              title: 'Sekcja "Opcjonalnie płatne" - elementy',
              type: 'array',
              of: [{type: 'string'}],
            },
            {
              name: 'freeTimeTitle',
              title: 'Nagłówek sekcji "Czas wolny"',
              type: 'string',
              validation: (Rule) => Rule.max(singleLine.maxLength).error(singleLine.errorMsg),
            },
            {
              name: 'freeTime',
              title: 'Sekcja "Czas wolny" - aktywności',
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
                          {title: 'W cenie', value: 'included'},
                          {title: 'Opcjonalnie', value: 'optional'},
                        ],
                      },
                    },
                    {name: 'activity', title: 'Aktywność', type: 'string'},
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
}
