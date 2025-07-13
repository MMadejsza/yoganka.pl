// schemas/EventType.js
import {singleLine, doubleLine, tripleLine, urlMaxLength} from '../utils/validations'
import {defaultBtnsSet, defaultGlanceSet} from '../utils/elements'

export default {
  name: 'event',
  title: 'Wydarzenie Yogowe',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Typ',
      type: 'string',
      hidden: true,
      initialValue: 'event',
    },
    {
      name: 'slug',
      title: 'Link (URL)',
      type: 'slug',
      description: 'Tylko końcówka, bez "/", np. "yoga-piknik-i-malowanie-ceramiki"',
      options: {source: 'name', maxLength: urlMaxLength},
      validation: (Rule) =>
        Rule.required().custom((slugObj) =>
          slugObj?.current && !slugObj.current.includes('/')
            ? true
            : 'Link jest wymagany i nie może zawierać "/"',
        ),
    },
    {
      name: 'date',
      title: 'Data wydarzenia',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    },
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
    {
      name: 'mainImage',
      title: 'Główne zdjęcie',
      type: 'image',
      options: {hotspot: true},
    },

    // --- Front (kafelek)
    {
      name: 'front',
      title: 'Dane frontu (kafla)',
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
        {
          name: 'dates',
          title: 'Daty (np. 05-10.08)',
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
            Windows: przytrzymaj Alt i na klawiaturze numerycznej wpisz 0160, puść Alt → wstawi się spacja nierozdzielająca (NBSP).
            macOS: naciśnij Option + Spacja → wstawi się NBSP.`,
        },
        {
          name: 'btnsContent',
          title: 'Przyciski frontu',
          type: 'array',
          of: [defaultBtnsSet],
        },
      ],
    },

    // --- Modal (okno szczegółów)
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
          title: 'Tytuł "szybkie info" - bullet-listy',
          type: 'string',
          validation: (Rule) => Rule.max(singleLine.maxLength).error(singleLine.errorMsg),
        },
        defaultGlanceSet,
        {
          name: 'fullDescTitle',
          title: 'Nagłówek opisu',
          type: 'string',
        },
        {
          name: 'fullDesc',
          title: 'Pełny opis',
          type: 'text',
          description: `Pełny - nie skrócony.
          Używaj twardych spacji (Unicode U+00A0) zamiast zwykłych spacji, żeby tekst się nie łamał.
            Windows: przytrzymaj Alt i na klawiaturze numerycznej wpisz 0160, puść Alt → wstawi się spacja nierozdzielająca (NBSP).
            macOS: naciśnij Option + Spacja → wstawi się NBSP.`,
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'program',
          title: 'Program (lista)',
          type: 'object',
          fields: [
            {
              name: 'listType',
              title: 'Typ listy',
              type: 'string',
              description: `Różnica tylko w ikonach`,
              options: {
                list: [
                  {title: 'Uwzględnione', value: 'included'},
                  {title: 'Dodatkowo płatne', value: 'excluded'},
                ],
              },
            },
            {
              name: 'title',
              title: 'Nagłówek sekcji programu',
              type: 'string',
              description: 'Tytuł sekcji programu',
              validation: (Rule) => Rule.max(singleLine.maxLength).error(doubleLine.errorMsg),
            },
            {
              name: 'list',
              title: 'Lista punktów',
              type: 'array',
              of: [{type: 'string'}],
            },
          ],
        },
        {
          name: 'note',
          title: 'Notatka',
          type: 'string',
        },
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
