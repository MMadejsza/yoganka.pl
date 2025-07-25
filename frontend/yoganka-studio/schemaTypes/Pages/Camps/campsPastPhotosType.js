// schemas/Camps/campsPastPhotosType.js

import { defaultGallerySectionSet } from '../../../utils/sets.jsx';

export default {
  name: 'campsPhotos',
  title: '🏕️ CAMPY - 📷 Galeria jak było',
  type: 'document',
  fields: defaultGallerySectionSet,

  preview: {
    select: {
      title: 'sectionTitle',
    },
  },
};
