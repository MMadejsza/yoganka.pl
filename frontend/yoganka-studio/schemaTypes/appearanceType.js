// ./schemas/appearanceType.js
import { colorGroups } from '../utils/sets.jsx';

export default {
  name: 'appearance',
  title: '🎨 WYGLĄD',
  type: 'document',
  fields: [
    {
      name: 'colors',
      title: '🎨 Kolory (UI)',
      type: 'object',
      groups: colorGroups,
      fields: [
        {
          group: 'bcg',
          name: 'base',
          title: '⚪ Tło bazowe',
          type: 'simplerColor',
          initialValue: '#fff8f4',
        },
        {
          group: 'bcg',
          name: 'nav',
          title: '🟠 Nawigacja / menu',
          description: `☝🏻 oraz ten ciemniejszy 'bazowy kolor', czyli też stopka itp.`,
          type: 'simplerColor',
          initialValue: '#f6e0c8',
        },
        {
          group: ['bcg', 'muted'],
          name: 'navMuted',
          title: '🟠 Nawigacja wytłumiona',
          description: `☝🏻 Np. kafel 'Zobacz więcej...'`,
          type: 'simplerColor',
          initialValue: 'rgba(78, 69, 59, 0.5)',
          options: {
            colorFormat: 'rgba',
          },
        },
        {
          group: 'bcg',
          name: 'tile',
          title: '🟤 Tło kafla - karty produktu',
          description: `☝🏻 Ale nie dotyczy kafla 'Zobacz więcej...'`,
          type: 'simplerColor',
          initialValue: '#f5ece5',
        },
        {
          group: 'text',
          name: 'tileTitle',
          title: '🟤 Nagłówki',
          type: 'simplerColor',
          description: '☝🏻 Także te w kaflach',
          initialValue: '#805346',
        },
        {
          group: 'text',
          name: 'baseText',
          title: '⚫ Tekst bazowy',
          type: 'simplerColor',
          initialValue: '#1e1b18',
        },
        {
          group: 'text',
          name: 'tileText',
          title: `⚫ Tekst bazowy w modal'ach i kaflach`,
          description:
            '☝🏻 Oryginalnie taki sam jak kolor ogólnego tekstu bazowego',
          type: 'simplerColor',
          initialValue: '#1e1b18',
        },
        {
          group: ['text', 'muted'],
          name: 'tileTextMuted',
          title: '🟣 Tekst poboczny',
          description: '☝🏻 Np. Lokacja i opis skrócony na froncie w kaflach',
          type: 'simplerColor',
          initialValue: '#4e453b',
        },
        {
          group: ['bcg', 'text'],
          name: 'accentBcg',
          title: '🔴 Kolor akcentowy',
          description: '☝🏻 Przyciski CTA, podświetlenia, ikony',
          type: 'simplerColor',
          initialValue: '#1c7993',
        },
        {
          group: 'text',
          name: 'accentText',
          title: '🔴 Kolor tekstu na tle koloru akcentowego',
          type: 'simplerColor',
          initialValue: '#ffffff',
        },
        {
          group: ['text', 'muted'],
          name: 'genericListContent',
          title: '🟣 Lista / Treści pomocnicze',
          description:
            '☝🏻 Delikatnie bardziej wyciszony niż poboczny - w grafiku w listach i kartach, żeby nie robił ściany tekstu',
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
