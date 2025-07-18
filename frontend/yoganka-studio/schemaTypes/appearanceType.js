// ./schemas/appearanceType.js
export default {
  name: 'appearance',
  title: '🎨 WYGLĄD',
  type: 'document',
  fields: [
    {
      name: 'colors',
      title: '🎨 Kolory (UI)',
      type: 'object',
      fields: [
        {
          name: 'base',
          title: '🟠 Tło bazowe',
          type: 'simplerColor',
          initialValue: '#fff8f4',
        },
        {
          name: 'baseText',
          title: '⚫ Tekst bazowy',
          type: 'simplerColor',
          initialValue: '#1e1b18',
        },
        {
          name: 'tile',
          title: '🟤 Tło kafla- karty produktu',
          type: 'simplerColor',
          initialValue: '#f5ece5',
        },
        {
          name: 'tileTitle',
          title: '🟠 Nagłówki kafla',
          type: 'simplerColor',
          initialValue: '#805346',
        },
        {
          name: 'tileText',
          title: `⚫ Główny tekst w modal'ach i kaflach`,
          type: 'simplerColor',
          initialValue: '#1e1b18',
        },
        {
          name: 'tileTextMuted',
          title: '🟤 Tekst poboczny',
          type: 'simplerColor',
          initialValue: '#4e453b',
        },
        {
          name: 'accentBcg',
          title: '🔵 Kolor akcentowy',
          type: 'simplerColor',
          initialValue: '#1c7993',
        },
        {
          name: 'accentText',
          title: '⚪ Kolor tekstu na tle koloru akcentowego',
          type: 'simplerColor',
          initialValue: '#ffffff',
        },
        {
          name: 'nav',
          title: '🟠 Nawigacja / menu',
          type: 'simplerColor',
          initialValue: '#f6e0c8',
        },
        {
          name: 'navMuted',
          title: '🟤 Nawigacja wytłumiona',
          type: 'simplerColor',
          initialValue: 'rgba(78, 69, 59, 0.5)',
          options: {
            colorFormat: 'rgba',
          },
        },
        {
          name: 'genericListContent',
          title: '⚙️ Lista / Treści pomocnicze',
          type: 'simplerColor',
          initialValue: '#6c757d',
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: '🎨 Kolory UI',
      };
    },
  },
};
