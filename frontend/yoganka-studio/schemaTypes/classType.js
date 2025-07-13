// schemas/ClassType.js

import {singleLine, doubleLine, tripleLine, urlMaxLength} from '../utils/validations'
import {defaultBtnsSet} from '../utils/elements'

export default {
  name: 'class',
  title: 'Zajęcia Yogowe',
  type: 'document',

  initialValue: {
    type: 'class',
    date: null,
    modal: false,
  },
  fields: [
    {
      name: 'name',
      title: 'Nazwa zajęć',
      type: 'string',
      description: 'np. „Grupowe i Indywidualne” lub „Online”',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'type',
      title: 'Typ',
      type: 'string',
      hidden: true,
      initialValue: 'class',
    },
    {
      name: 'slug',
      title: 'Link (slug)',
      type: 'slug',
      description: 'Tylko końcówka, bez "/", np. "yoga-piknik-i-malowanie-ceramiki"',
      options: {source: 'name', maxLength: urlMaxLength},
      validation: (Rule) =>
        Rule.custom((slugObj) =>
          slugObj?.current && !slugObj.current.includes('/')
            ? true
            : 'Link jest wymagany i nie może zawierać "/"',
        ),
    },
    {
      name: 'date',
      title: 'Data - jeśli dotyczy',
      type: 'datetime',
      description: 'Zostaw puste, jeśli brak daty',
    },
    {
      name: 'mainImage',
      title: 'Główne zdjęcie',
      type: 'image',
      options: {hotspot: true},
    },
    // --------------------
    // Front – kafelek
    // --------------------
    {
      name: 'front',
      title: 'Dane frontu (kafla)',
      type: 'object',
      initialValue: {
        dates: [],
        btnsContent: [],
      },
      fields: [
        {
          name: 'title',
          title: 'Tytuł frontu',
          type: 'string',
          description: 'np. „Stacjonarne Gdańsk”',
          initialValue: (document) => document.name || '',
          validation: (Rule) =>
            Rule.required().max(tripleLine.maxLength).error(tripleLine.errorMsg),
        },
        {
          name: 'dates',
          title: 'Daty (lista)',
          type: 'array',
          of: [{type: 'string'}],
          description: 'np. puste dla zajęć ciągłych',
        },
        {
          name: 'location',
          title: 'Lokalizacja',
          type: 'string',
          description: 'np. „Gdańsk” lub puste',
          validation: (Rule) => Rule.max(doubleLine.maxLength).error(doubleLine.errorMsg),
        },
        {
          name: 'desc',
          title: 'Opis skrócony',
          type: 'text',
          description: `Krótki opis wyświetlany pod tytułem.
          Używaj twardych spacji (Unicode U+00A0) zamiast zwykłych spacji, żeby tekst się nie łamał.
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

    // --------------------
    // Modal – szczegóły
    // --------------------
    {
      name: 'modal',
      title: 'Czy ma modal?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'modalContent',
      title: 'Dane modala (jeśli istnieje)',
      type: 'object',
      hidden: ({document}) => !document.modal,
      fields: [
        {
          name: 'title',
          title: 'Tytuł modala',
          type: 'string',
          initialValue: (document) => document.front?.title || '',
          validation: (Rule) => {
            Rule.custom((value, context) => {
              if (!value && context.document.modal) {
                return 'Tytuł okna obowiązkowy'
              }
              return true
            })
          },
        },
        {
          name: 'gallery',
          title: 'Galeria zdjęć',
          type: 'array',
          of: [{type: 'image', options: {hotspot: true}}],
        },
        {
          name: 'fullDesc',
          title: 'Pełny opis',
          type: 'text',
        },
        {
          name: 'program',
          title: 'Program (lista punktów)',
          type: 'array',
          of: [{type: 'string'}],
        },
        {
          name: 'glance',
          title: 'Szybkie info (glance)',
          type: 'object',
          fields: [
            {name: 'symbol', title: 'Symbol', type: 'string'},
            {name: 'text', title: 'Tekst', type: 'string'},
          ],
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
      media: 'mainImage',
    },
  },
}
