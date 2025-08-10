import { seoDesc, seoKeywords, seoTitle } from '../../../utils/components';
import { seoMetaDescription, seoMetaTitle } from '../../../utils/validations';

export default {
  name: 'scheduleSeo',
  title: '📅 GRAFIK - 🌐 SEO',
  type: 'document',
  groups: [{ name: 'seo', title: 'SEO' }],
  fields: [
    seoTitle,
    {
      name: 'seoTitlePass',
      title: 'Meta tag title - karnety',
      description:
        'Karnety mają osobną podstronę, więc potrzebują osobnego tytułu SEO.',
      type: 'string',
      validation: Rule => Rule.custom(value => seoMetaTitle(value)),
    },
    seoDesc,
    {
      name: 'seoDescriptionPass',
      title: 'Meta description tag - karnety',
      type: 'text',
      validation: Rule => Rule.custom(value => seoMetaDescription(value)),
    },
    seoKeywords,
    {
      name: 'seoKeywordsPass',
      title: 'Meta tag keywords - karnety',
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
