import { seoSet } from '../../../utils/sets';

export default {
  name: 'campsSeo',
  title: '🏕️ CAMPY - 🌐 SEO',
  type: 'document',
  fields: seoSet,
  groups: [{ name: 'seo', title: 'SEO' }],
  preview: {
    prepare() {
      return {
        title: `Seo dla strony wyjazdów`,
      };
    },
  },
};
