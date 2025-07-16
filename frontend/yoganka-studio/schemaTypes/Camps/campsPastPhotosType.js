// schemas/campsPastPhotosType.js

import {defaultGallerySection} from '../../utils/sets'

export default {
  name: 'campsPhotos',
  title: 'CAMPY - Galeria jak było',
  type: 'document',
  fields: defaultGallerySection,

  preview: {
    select: {
      title: 'sectionTitle',
    },
  },
}
