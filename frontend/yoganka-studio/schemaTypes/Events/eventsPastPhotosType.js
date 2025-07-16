// schemas/eventsPastPhotosType.js

import {defaultGallerySection} from '../../utils/sets'

export default {
  name: 'eventsPhotos',
  title: 'WYDARZENIA - Galeria jak było',
  type: 'document',
  fields: defaultGallerySection,

  preview: {
    select: {
      title: 'sectionTitle',
    },
  },
}
