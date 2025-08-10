import { seoDesc, seoKeywords, seoTitle } from '../../../utils/components';
import { seoMetaDescription, seoMetaTitle } from '../../../utils/validations';

export default {
  name: 'tosSeo',
  title: '🏛️ Regulaminy - 🌐 SEO',
  type: 'document',
  groups: [{ name: 'seo', title: 'SEO' }],
  fields: [
    seoTitle,
    {
      name: 'seoTitleGdpr',
      title: 'Meta tag title - RODO',
      description:
        'RODO mają osobną podstronę, więc potrzebują osobnego tytułu SEO.',
      type: 'string',
      validation: Rule => Rule.custom(value => seoMetaTitle(value)),
    },
    seoDesc,
    {
      name: 'seoDescriptionGdpr',
      title: 'Meta description tag - RODO',
      type: 'text',
      validation: Rule => Rule.custom(value => seoMetaDescription(value)),
    },
    seoKeywords,
    {
      name: 'seoKeywordsGdpr',
      title: 'Meta tag keywords - RODO',
      type: 'text',
    },
  ],
  preview: {
    prepare() {
      return {
        title: `Seo dla strony grafiku`,
      };
    },
  },
};
