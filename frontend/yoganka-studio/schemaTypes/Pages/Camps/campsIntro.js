// schemas/Camps/campsIntro.js

import { defaultIntroPreview } from '../../../utils/previews';
import { defaultIntroSet } from '../../../utils/sets';

export default {
  name: `campsIntro`,
  title: `🏕️ CAMPY - ▶️ Intro`,
  type: `document`,
  fields: defaultIntroSet,
  preview: defaultIntroPreview,
};
