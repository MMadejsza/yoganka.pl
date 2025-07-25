// schemas/Home/certificateType.js
import { sectionTitle } from '../../../utils/components.jsx';
import { doubleLine, singleLine } from '../../../utils/validations';

export default {
  name: 'certificates',
  title: '🏠 GŁÓWNA - 📜 Certyfikaty',
  type: 'document',
  fields: [
    sectionTitle,
    {
      name: 'list',
      title: '🗂️ Lista certyfikatów',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: '📄 Nazwa certyfikatu',
              type: 'string',
              description:
                '☝🏻 Pełna nazwa, np. „RYT200” lub „Instruktor Hatha Jogi”',
              validation: Rule =>
                Rule.required()
                  .max(doubleLine.maxLength)
                  .error(doubleLine.errorMsg),
            },
            {
              name: 'instructor',
              title: '🏛️ Instytucja / prowadzący',
              type: 'string',
              description: '☝🏻 Np. „House of OM” lub „prof. Szopa”',
              validation: Rule =>
                Rule.required()
                  .max(singleLine.maxLength)
                  .error(singleLine.errorMsg),
            },
            {
              name: 'duration',
              title: '⏱️ Czas trwania',
              type: 'string',
              description:
                '☝🏻 Np. „200h”, „25h”; zostaw puste jeśli brak informacji',
            },
            {
              name: 'themes',
              title: '🧘 Tematy / moduły',
              type: 'array',
              of: [{ type: 'string' }],
              description: '☝🏻 Lista głównych tematów, np. Vinyasa, Hatha',
              initialValue: [],
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'instructor',
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'sectionTitle',
    },
  },
};
