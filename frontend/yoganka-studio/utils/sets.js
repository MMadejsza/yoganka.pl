import {tripleLine, doubleLine, singleLine} from './validations'
import * as components from './components.jsx'

export const defaultIntroSet = [
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
  },
  components.textList(),
]

export const defaultBtnsSet = {
  name: 'btnsContent',
  title: 'Przyciski',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'action',
          title: 'Typ przycisku',
          type: 'string',
          options: {
            list: [
              {title: 'WhatsApp', value: 'whatsapp'},
              {title: 'Telefon', value: 'phone'},
              {title: 'Grafik', value: 'grafik'},
              {title: 'Mail', value: 'mail'},
              {title: 'Zewnętrzny link', value: 'external'},
            ],
          },
        },
        components.stringImgTitle(),
        components.stringSymbol(({parent}) => parent.action !== 'external'),
        {
          name: 'text',
          title: 'Tekst przycisku',
          type: 'string',
          hidden: ({parent}) => !(parent.action === 'external' || parent.action === 'grafik'),
          validation: (Rule) =>
            Rule.custom((value, context) => {
              if (context.parent.action === 'external' || context.parent.action === 'grafik') {
                return value ? true : 'Wprowadź tekst przycisku'
              }
              return true
            }),
        },
        {
          name: 'emailTitle',
          title: 'Domyślny tytuł przychodzącego maila',
          type: 'string',
          description: `Cześć użytkowników i tak zmieni ale część nie, co poprawi Ci porządek w skrzynce`,
          hidden: ({parent}) => parent.action !== 'mail',
          validation: (Rule) =>
            Rule.custom((value, context) => {
              if (context.parent.action === 'mail') {
                return value ? true : 'Wprowadź domyślny tytuł maila'
              }
              return true
            }),
        },
        {
          name: 'qrImage',
          title: 'Obraz QR (kod)',
          type: 'image',
          options: {hotspot: true},
          description: 'Zuploaduj plik PNG/JPG z kodem QR',
          hidden: ({parent}) => parent.action !== 'phone',
        },
        {
          name: 'qrAlt',
          title: 'Tekst alternatywny dla QR',
          type: 'string',
          description:
            'Np. "Instagram QR Code" - widoczny tylko jesli qr się nie wyświetla prawidłowo',
          hidden: ({parent}) => parent.action !== 'phone',
          initialValue: `Kod QR z numerem telefonu`,
          validation: (Rule) =>
            Rule.custom((value, context) => {
              if (context.parent.action === 'phone') {
                return !!value || 'Tekst alternatywny nie może być pusty'
              }
              return true
            }),
        },
        {
          name: 'link',
          title: 'URL lub numer telefonu',
          type: 'string',
          description: `W przypadku URL grafiku - podaj np. "/grafik/3" - ze "/" | W przypadku maila - podaj adres np."kontakt@yoganka.pl | Telefon: 48792891607. | Zewnętrzny link - pełny link`,
          initialValue: '48792891607',
          validation: (Rule) =>
            Rule.custom((value, {parent}) => {
              const act = parent.action

              // WhatsApp: wymagany i tylko cyfry
              if (act === 'whatsapp') {
                if (!value) return 'Numer WhatsApp jest wymagany'
                return /^\d+$/.test(value) ? true : 'Numer telefonu musi być cyframi bez + i spacji'
              }

              // Telefon: wymagany i cyfry/znaki kierunkowe
              if (act === 'phone') {
                if (!value) return 'Numer telefonu jest wymagany'
                return /^[+\d\s()-]+$/.test(value)
                  ? true
                  : 'Numer telefonu musi zawierać cyfry i ewentualnie +, spacje, -, ()'
              }

              // Mail: wymagany i podstawowy format
              if (act === 'mail') {
                if (!value) return 'Email jest wymagany'
                return /\S+@\S+\.\S+/.test(value)
                  ? true
                  : 'Podaj poprawny adres e-mail (np. kontakt@domena.pl)'
              }

              // Zewnętrzny link: wymagany
              if (act === 'external') {
                return value ? true : 'URL jest wymagany dla zewnętrznego linku'
              }

              // Dla pozostałych akcji (np. grafik) nie walidujemy
              return true
            }),
        },
      ],
      preview: {
        select: {
          action: 'action',
          text: 'text',
          title: 'title',
          link: 'link',
        },
        prepare({action, text, title, link}) {
          const textLabel = text ? `Tytuł: ${text} |` : ''
          const actionLabel = action.toUpperCase()

          return {
            title: `${actionLabel}: ${textLabel} Podpowiedź: ${title} | Link: ${link}`,
          }
        },
      },
    },
  ],
}

export const defaultGlanceSet = {
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
}

export const defaultTurningTilesSet = {
  name: 'list',
  title: 'Typy oferty (kafelki obrotowe)',
  type: 'array',
  of: [
    {
      type: 'object',
      title: 'Typ oferty',
      fields: [
        components.stringSymbol(),
        {
          name: 'title',
          title: 'Nagłówek',
          type: 'string',
          description: `Krótki tytuł benefit'u, max. ${doubleLine.maxLength} znaków`,
          validation: (Rule) =>
            Rule.required().max(doubleLine.maxLength).error(doubleLine.errorMsg),
        },
        {
          name: `text`,
          title: `Opis`,
          type: `text`,
          description: `Szczegółowy opis na tyle (po obrocie)`,
          rows: 4,
          validation: (Rule) => Rule.required().max(265).warning(`Za długi opis. maks 265 znaków.`),
        },
      ],
    },
  ],
}

export const defaultGallerySection = [
  {
    name: `sectionTitle`,
    title: `Tytuł sekcji`,
    type: `string`,
    validation: (Rule) => Rule.max(doubleLine.maxLength).error(doubleLine.errorMsg),
  },
  {
    name: 'list',
    title: `Galeria zdjęć`,
    type: 'array',
    of: [
      {
        type: 'image',
      },
    ],
  },
]

export const defaultTileFront = {
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
      validation: (Rule) => Rule.required().max(tripleLine.maxLength).error(tripleLine.errorMsg),
    },
    {
      name: 'dates',
      title: 'Daty (np. 05-10.08)',
      type: 'array',
      of: [{type: 'string'}],
      description: `Lub inne dane - struktura kafli jest zawsze taka sama`,
    },
    {
      name: 'location',
      title: 'Lokalizacja',
      type: 'string',
      validation: (Rule) => Rule.max(doubleLine.maxLength).error(doubleLine.errorMsg),
      description: `Lub inne dane - struktura kafli jest zawsze taka sama`,
    },
    {
      name: 'desc',
      title: 'Opis skrócony',
      type: 'text',
      description: `Używaj twardych spacji (Unicode U+00A0) zamiast zwykłych spacji, żeby tekst się nie łamał.
            Windows: przytrzymaj Alt i na klawiaturze numerycznej wpisz 0160, puść Alt → wstawi się spacja nierozdzielająca (NBSP).
            macOS: naciśnij Option + Spacja → wstawi się NBSP.`,
    },
    defaultBtnsSet,
  ],
}

// ({document}) => !document.modal
export const defaultTileModalPartially = (hiddenFn = undefined) => {
  return [
    {
      name: 'title',
      title: 'Tytuł modala/okna',
      type: 'string',
      initialValue: (document) => document.front?.title || '',
      validation: (Rule) => {
        if (hiddenFn) {
          Rule.custom((value, context) => {
            if (!value && context.document.modal) {
              return 'Tytuł okna obowiązkowy'
            }
            return true
          })
        } else {
          return Rule.required()
        }
      },
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
  ]
}

export const bulletsList = () => ({
  name: 'program',
  title: 'Program (lista)',
  type: 'object',
  fields: [components.typesList, components.simpleTitle('', '', true), components.stringList()],
})
