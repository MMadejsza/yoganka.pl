import { seoSet } from '../../../utils/sets';

export default {
  name: 'b2bSeo',
  title: '💼 B2B - 🌐 SEO',
  type: 'document',
  fields: seoSet,
  groups: [{ name: 'seo', title: 'SEO' }],
  preview: {
    prepare() {
      return {
        title: `Seo dla strony B2B`,
      };
    },
  },
};
