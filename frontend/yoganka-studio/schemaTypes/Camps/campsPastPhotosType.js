// schemas/campsPastPhotosType.js

import {defaultGallerySection} from '../../utils/elements'

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
