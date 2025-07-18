import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { simplerColorInput } from 'sanity-plugin-simpler-color-input';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'yoganka',

  projectId: 'b7wo2my9',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    simplerColorInput({
      // Note: These are all optional
      defaultColorFormat: 'hex',
      defaultColorList: [
        { label: '▶️▶️ Wybierz własny', value: 'custom' },
        { label: '🌄🌄 Tło bazowe', value: '#fff8f4' },
        { label: '🌄✏️ Tekst bazowy', value: '#1e1b18' },
        { label: '🌄❔ Tekst poboczny', value: '#4e453b' },
        { label: '⚙️❔ Lista / Treści pomocnicze', value: '#6c757d' },
        { label: '🛒🛒 Tło kafla - karty produktu', value: '#f5ece5' },
        { label: '🛒🟥 Nagłówki kafla', value: '#805346' },
        { label: '🛒✏️ Główny tekst w modalach i kaflach', value: '#1e1b18' },
        { label: '✨✨ Kolor akcentowy', value: '#1c7993' },
        {
          label: '✨✏️ Kolor tekstu na tle koloru akcentowego',
          value: '#ffffff',
        },
        { label: '🧩🧩 Nawigacja / menu', value: '#f6e0c8' },
        { label: '🧩❔ Nawigacja wytłumiona', value: 'rgba(78, 69, 59, 0.5)' },
      ],
      enableSearch: true,
      showColorValue: true,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
