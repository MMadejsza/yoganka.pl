// schemas/EventType.js
const singleLineMaxLength = 22
const singleLineMaxLengthError = `Maks 1 linijka - znaków: ${singleLineMaxLength} `
const doubleLineMaxLength = 45
const doubleLineMaxLengthError = `Maks 2 linijki -  znaków: ${doubleLineMaxLength}`

const urlMaxLength = 96

export default {
  name: 'event',
  title: 'Wydarzenie Yogowe',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nazwa wydarzenia',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
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
      options: {source: 'name', maxLength: 96},
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
    {
      name: 'gallery',
      title: 'Galeria zdjęć',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
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
          validation: (Rule) => Rule.required().max(68).error('Max 68 znaków'),
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
          validation: (Rule) => Rule.max(doubleLineMaxLength).error(doubleLineMaxLengthError),
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
                      {title: 'Grafik', value: 'grafik'},
                      {title: 'Zewnętrzny link', value: 'external'},
                    ],
                  },
                },
                {
                  name: 'text',
                  title: 'Tekst przycisku',
                  type: 'string',
                  hidden: ({parent}) => parent.action !== 'external',
                  validation: (Rule) =>
                    Rule.custom((val, ctx) => {
                      if (ctx.parent.action === 'external') {
                        return val ? true : 'Wprowadź tekst przycisku'
                      }
                      return true
                    }),
                },
                {
                  name: 'title',
                  title: 'Podpowiedź przy najechaniu (tooltip)',
                  description: `Ma wartość UX - niech będzie faktycznie wskazówką dla przycisku. np. "Napisz do mnie na WhatsApp'ie":`,
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'url',
                  title: 'URL lub numer telefonu',
                  type: 'string',
                  description: `W przypadku URL grafiku - podaj np. "/grafik/3" - ze "/"`,
                  initialValue: '48792891607',
                  validation: (Rule) =>
                    Rule.custom((val, ctx) => {
                      const act = ctx.parent.action
                      if (act === 'whatsapp') {
                        return /^\d+$/.test(val) || 'Numer telefonu musi być cyframi bez + i spacji'
                      }
                      if (act === 'external') {
                        return val ? true : 'URL jest wymagany'
                      }
                      return true
                    }),
                },
              ],
            },
          ],
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
          name: 'glanceTitle',
          title: 'Tytuł "szybkie info" - bullet-listy',
          type: 'string',
          validation: (Rule) => Rule.max(singleLineMaxLength).error(singleLineMaxLengthError),
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
          name: 'programTitle',
          title: 'Nagłówek sekcji programu',
          type: 'string',
          description: 'Tytuł sekcji programu',
          validation: (Rule) => Rule.max(singleLineMaxLength).error(doubleLineMaxLengthError),
        },
        {
          name: 'program',
          title: 'Program (lista)',
          type: 'object',
          fields: [
            {
              name: 'listType',
              title: 'Typ listy - różnica w ikonach',
              type: 'string',
              options: {
                list: [
                  {title: 'Uwzględnione', value: 'included'},
                  {title: 'Dodatkowo płatne', value: 'excluded'},
                ],
              },
            },
            {
              name: 'title',
              title: 'Nagłówek konkretnego programu',
              type: 'string',
              validation: (Rule) => Rule.max(singleLineMaxLength).error(singleLineMaxLengthError),
            },
            {
              name: 'list',
              title: 'Punkty programu',
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
                      {title: 'Grafik', value: 'grafik'},
                      {title: 'Zewnętrzny link', value: 'external'},
                    ],
                  },
                },
                {
                  name: 'text',
                  title: 'Tekst przycisku',
                  type: 'string',
                  hidden: ({parent}) => parent.action !== 'external',
                  validation: (Rule) =>
                    Rule.custom((value, context) => {
                      if (context.parent.action === 'external') {
                        return !!value || 'Wprowadź tekst przycisku'
                      }
                      return true
                    }),
                },
                {
                  name: 'title',
                  title: 'Podpowiedź przy najechaniu (tooltip)',
                  type: 'string',
                  description: `Ma wartość UX - niech będzie faktycznie wskazówką dla przycisku. np. "Napisz do mnie na WhatsApp'ie":`,
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'url',
                  title: 'URL lub numer telefonu',
                  type: 'string',
                  description: `W przypadku URL grafiku - podaj np. "/grafik/3" - ze "/"`,
                  initialValue: '48792891607',
                  validation: (Rule) =>
                    Rule.custom((value, context) => {
                      const action = context.parent.action
                      if (action === 'whatsapp') {
                        return /^\d+$/.test(value) || 'Numer telefonu musi być cyframi bez znaku +'
                      }
                      if (action === 'external') {
                        return Rule.required().validate(value) || 'URL jest wymagany'
                      }
                      return true
                    }),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
