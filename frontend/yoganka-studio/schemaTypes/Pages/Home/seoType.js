import { seoSet } from '../../../utils/sets';

export default {
  name: 'homeSeo',
  title: '🏠 GŁÓWNA - 🌐 SEO',
  type: 'document',
  fields: seoSet,
  groups: [{ name: 'seo', title: 'SEO' }],
  preview: {
    prepare() {
      return {
        title: `Seo dla strony głównej`,
      };
    },
  },
};
