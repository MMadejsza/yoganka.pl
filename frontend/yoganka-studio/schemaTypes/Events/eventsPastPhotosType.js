// schemas/Events/eventsPastPhotosType.js

import { defaultGallerySectionSet } from '../../utils/sets';

export default {
  name: 'eventsPhotos',
  title: 'WYDARZENIA - Galeria jak było',
  type: 'document',
  fields: defaultGallerySectionSet,

  preview: {
    select: {
      title: 'sectionTitle',
    },
  },
};
