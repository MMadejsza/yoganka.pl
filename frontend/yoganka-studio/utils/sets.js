import * as components from './components.jsx';
import { doubleLine, singleLine, tripleLine } from './validations';

export const defaultIntroSet = [
  {
    name: 'backgroundImage',
    title: '🌄 Zdjęcie w tle',
    type: 'image',
    options: { hotspot: true },
  },
  components.sectionTitle,
  components.textList(),
];

export const defaultBtnsSet = {
  name: 'btnsContent',
  title: '🚀 Przyciski',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'action',
          title: '🧮 Typ przycisku',
          type: 'string',
          options: {
            list: [
              components.btnsLinksOptions.whatsapp,
              components.btnsLinksOptions.phone,
              components.btnsLinksOptions.scheduleRecord,
              components.btnsLinksOptions.schedule,
              components.btnsLinksOptions.mail,
              components.btnsLinksOptions.external,
            ],
          },
        },
        components.stringImgTitle(),
        components.stringSymbol(({ parent }) => parent.action !== 'external'),
        {
          name: 'text',
          title: '✏️ Tekst przycisku',
          type: 'string',
          hidden: ({ parent }) =>
            !(parent.action === 'external' || parent.action === 'schedule'),
          validation: Rule =>
            Rule.custom((value, context) => {
              if (context.parent.action === 'external') {
                return value ? true : '⚠️ Wprowadź tekst przycisku';
              }
              return true;
            }),
        },
        {
          name: 'emailTitle',
          title: '✨ Domyślny tytuł przychodzącego maila',
          type: 'string',
          description: `☝🏻 Część użytkowników i tak zmieni ale część nie, co poprawi Ci porządek w skrzynce`,
          hidden: ({ parent }) => parent.action !== 'mail',
          validation: Rule =>
            Rule.custom((value, context) => {
              if (context.parent.action === 'mail') {
                return value ? true : '⚠️ Wprowadź domyślny tytuł maila';
              }
              return true;
            }),
        },
        {
          name: 'scheduleId',
          title: '🪪 ID terminu',
          type: 'number',
          description: `☝🏻 Identyfikator konkretnego terminu`,
          hidden: ({ parent }) => parent.action !== 'scheduleRecord',
          validation: Rule =>
            Rule.custom((value, context) => {
              if (context.parent.action === 'scheduleRecord') {
                return value ? true : '⚠️ Wprowadź ID';
              }
              return true;
            }),
        },
        components.link({
          isConditionalFnSet: {
            parentLabel: 'action',
            fn: ({ parent }) =>
              parent.action === 'schedule' ||
              parent.action === 'scheduleRecord',
          },
          isHeavilyRequired: false,
        }),
        components.qrImage(({ parent }) => parent.action !== 'phone'),
        components.qrAlt({
          hiddenFn: undefined,
          initialValFn: document => `${document.name} QR Code`,
        }),
      ],
      preview: {
        select: {
          action: 'action',
          text: 'text',
          title: 'title',
          link: 'link',
        },
        prepare({ action, text, title, link }) {
          const textLabel = text ? `Tytuł: ${text} |` : '';
          const actionLabel = action.toUpperCase();

          return {
            title: `${actionLabel}: ${textLabel} Podpowiedź: ${title} | Link: ${link}`,
          };
        },
      },
    },
  ],
};

export const defaultGlanceSet = {
  name: 'glance',
  title: '📌 Szybkie info',
  type: 'object',
  fields: [
    { name: 'price', title: '💰 Cena', type: 'string' },
    { name: 'area', title: '📍 Lokalizacja', type: 'string' },
    { name: 'accommodation', title: '🏠 Zakwaterowanie', type: 'string' },
    {
      name: 'capacity',
      title: '👥 Maks. liczba osób w grupie',
      type: 'number',
      validation: Rule =>
        Rule.custom(value => {
          if (value === undefined || value === null) return true;
          return value >= 1 || 'Podaj liczbę większą od 0';
        }),
    },
    { name: 'travel', title: '🚗 Transport', type: 'string' },
  ],
};

export const defaultTurningTilesSet = {
  name: 'list',
  title: '🧮 Typy oferty (kafelki obrotowe)',
  type: 'array',
  of: [
    {
      type: 'object',
      title: '🧮 Typ oferty',
      fields: [
        components.stringSymbol(),
        components.simpleTitle('', '', true),
        {
          name: `text`,
          title: `Opis`,
          type: `text`,
          description: `📝Szczegółowy opis na tyle (po obrocie)`,
          rows: 4,
          validation: Rule =>
            Rule.required()
              .max(265)
              .warning(`⚠️ Za długi opis. maks 265 znaków.`),
        },
      ],
    },
  ],
};

export const defaultGallerySectionSet = [
  components.sectionTitle,
  components.galleryList,
];

export const defaultTileFrontSet = {
  name: 'front',
  title: '🟪 Dane frontu (kafla)',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: '🟨 Tytuł',
      type: 'string',
      description: `☝🏻 Używaj twardych spacji zamiast zwykłych, żeby tekst się nie łamał nieoczekiwanie.
      🔹Windows: przytrzymaj Alt i na klawiaturze numerycznej wpisz 0160, puść Alt → wstawi się spacja nierozdzielająca (NBSP).
      🔹macOS: naciśnij Option + Spacja → wstawi się NBSP.`,
      initialValue: document => document.name || '',
      validation: Rule =>
        Rule.required().max(tripleLine.maxLength).error(tripleLine.errorMsg),
    },
    {
      name: 'dates',
      title: '📅 Daty (np. 05-10.08)',
      type: 'array',
      of: [{ type: 'string' }],
      description: `☝🏻 Lub inne dane - struktura kafli jest zawsze taka sama`,
    },
    {
      name: 'location',
      title: '📍 Lokalizacja',
      type: 'string',
      validation: Rule =>
        Rule.max(doubleLine.maxLength).error(doubleLine.errorMsg),
      description: `☝🏻 Lub inne dane - struktura kafli jest zawsze taka sama`,
    },
    {
      name: 'desc',
      title: '📝 Opis skrócony',
      type: 'text',
      description: `☝🏻 Używaj twardych spacji (Unicode U+00A0) zamiast zwykłych spacji, żeby tekst się nie łamał.
            🔹Windows: przytrzymaj Alt i na klawiaturze numerycznej wpisz 0160, puść Alt → wstawi się spacja nierozdzielająca (NBSP).
            🔹macOS: naciśnij Option + Spacja → wstawi się NBSP.`,
    },
    defaultBtnsSet,
  ],
};

export const defaultTileModalPartiallySet = (hiddenFn = undefined) => {
  return [
    {
      name: 'title',
      title: '🟨 Tytuł modala/okna',
      type: 'string',
      initialValue: document => document.front?.title || '',
      validation: Rule => {
        if (hiddenFn) {
          Rule.custom((value, context) => {
            if (!value && context.document.modal) {
              return '⚠️ Tytuł okna obowiązkowy';
            }
            return true;
          });
        } else {
          return Rule.required();
        }
      },
    },
    components.galleryList,
    {
      name: 'glanceTitle',
      title: '📌 Tytuł "szybkie info" - bullet-listy',
      type: 'string',
      validation: Rule =>
        Rule.max(singleLine.maxLength).error(singleLine.errorMsg),
    },
    defaultGlanceSet,
    {
      name: 'fullDescTitle',
      title: '🟨 Nagłówek opisu',
      type: 'string',
    },
    {
      name: 'fullDesc',
      title: '📝 Pełny opis',
      type: 'text',
      description: `☝🏻 Pełny - nie skrócony.
          ☝🏻 Używaj twardych spacji (Unicode U+00A0) zamiast zwykłych spacji, żeby tekst się nie łamał.
           🔹Windows: przytrzymaj Alt i na klawiaturze numerycznej wpisz 0160, puść Alt → wstawi się spacja nierozdzielająca (NBSP).
           🔹macOS: naciśnij Option + Spacja → wstawi się NBSP.`,
      validation: Rule => Rule.required(),
    },
  ];
};

export const bulletsListSet = () => ({
  name: 'program',
  title: '✏️ Program (lista)',
  type: 'object',
  fields: [
    components.typesList,
    components.simpleTitle('', '', true),
    components.stringList(),
  ],
});

export const defaultModalSet = (isCamp = false, isHidden = undefined) => {
  const outcomeArr = [...defaultTileModalPartiallySet(isCamp)];
  if (!isCamp) outcomeArr.push(bulletsListSet());

  //#region @ IF CAMP START ________________________________________________
  if (isCamp) {
    outcomeArr.push({
      name: 'plan',
      title: '📋 Plan dnia',
      type: 'object',
      fields: [
        components.simpleTitle('Slow menu:'),
        {
          name: 'schedule',
          title: '🗓️ Dni i aktywności',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'day',
                  title: '🔹 Dzień tygodnia',
                  type: 'string',
                  options: {
                    list: [
                      { title: '🔹Poniedziałek', value: 'Poniedziałek:' },
                      { title: '🔹Wtorek', value: 'Wtorek:' },
                      { title: '🔹Środa', value: 'Środa:' },
                      { title: '🔹Czwartek', value: 'Czwartek:' },
                      { title: '🔹Piątek', value: 'Piątek:' },
                      { title: '🔹Sobota', value: 'Sobota:' },
                      { title: '🔹Niedziela', value: 'Niedziela:' },
                      { title: '🔸Combo', value: 'combo' },
                    ],
                  },
                  validation: Rule => Rule.required(),
                },
                {
                  name: 'comboLabel',
                  title: '✏️ Zakres dni (np. Piątek-Niedziela)',
                  type: 'string',
                  hidden: ({ parent }) => parent.day !== 'combo',
                  validation: Rule =>
                    Rule.custom(value => {
                      // jeśli nie combo, OK
                      if (!value && parent?.day === 'combo') {
                        return '⚠️ Musisz podać zakres dni dla opcji Combo';
                      }
                      return true;
                    }),
                },
                {
                  name: 'entries',
                  title: '🏄 Godziny i opisy aktywności',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        {
                          name: 'time',
                          title: '🕑 Godzina (np. 16:00)',
                          type: 'string',
                          validation: Rule => Rule.required(),
                        },
                        {
                          name: 'activity',
                          title: '🚴 Opis aktywności',
                          type: 'string',
                          validation: Rule => Rule.required(),
                        },
                      ],
                      preview: {
                        select: {
                          time: 'time',
                          activity: 'activity',
                        },
                        prepare({ time, activity }) {
                          return {
                            title: `${time} ${activity}`,
                          };
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
                prepare({ day, combo, entries }) {
                  const title = combo || day;
                  const subtitle = entries?.length
                    ? `Aktywności: ${entries.length}`
                    : 'Brak aktywności';
                  return {
                    title,
                    subtitle,
                  };
                },
              },
            },
          ],
        },
      ],
    });
    outcomeArr.push({
      name: 'summary',
      title: '📈 Sekcja podsumowania',
      description: 'Różnią się tylko emotikonem',
      type: 'object',
      fields: [
        {
          name: 'included',
          title: '✔️ W cenie',
          type: 'object',
          fields: [components.simpleTitle(`W cenie:`), components.stringList()],
        },
        {
          name: 'excluded',
          title: '👉🏻 Dodatkowo płatne',
          type: 'object',
          fields: [
            components.simpleTitle('Dodatkowo płatne:'),
            components.stringList(),
          ],
        },
        {
          name: 'optional',
          title: '➕ Opcjonalne',
          type: 'object',
          fields: [
            components.simpleTitle('Poszerz swoje menu:'),
            components.stringList(),
          ],
        },
        {
          name: 'freeTime',
          title: '🌿 W czasie wolnym',
          type: 'object',
          fields: [
            components.simpleTitle(`W czasie wolnym:`),
            {
              name: 'list',
              title: '🏄 Lista aktywności',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'status',
                      title: '🧮 Status',
                      type: 'string',
                      options: {
                        list: [
                          { title: '✔️ W cenie', value: 'free' },
                          { title: '➕ Opcjonalnie', value: 'optional' },
                        ],
                      },
                    },
                    {
                      name: 'activity',
                      title: '🚴 Aktywność',
                      type: 'string',
                    },
                  ],
                  preview: {
                    select: {
                      status: 'status',
                      activity: 'activity',
                    },
                    prepare({ status, activity }) {
                      const icon = status === 'optional' ? '💰' : '✅';
                      return {
                        title: `${icon} ${activity || '(brak)'}`,
                      };
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  }
  //#endregion @ IF CAMP END ________________________________________________

  outcomeArr.push(components.note, defaultBtnsSet);

  return {
    name: 'modal',
    title: '🟪 Zawartość modala/okna',
    hidden: isHidden ?? undefined,
    type: 'object',
    fields: outcomeArr,
  };
};
