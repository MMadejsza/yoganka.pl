// schemas/Camps/campBenefitsType.js
import { sectionTitle } from '../../../utils/components.jsx';
import { defaultTurningTilesSet } from '../../../utils/sets';

export default {
  name: `benefits`,
  title: `CAMPY - ☑️ Benefit'y kafle obrotowe`,
  type: `document`,
  fields: [sectionTitle, defaultTurningTilesSet],
  preview: {
    select: {
      title: `sectionTitle`,
      subtitle: `symbol`,
    },
  },
};
