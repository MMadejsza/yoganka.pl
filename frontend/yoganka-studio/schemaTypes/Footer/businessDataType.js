// schemas/businessDataType.js
import {tripleLine} from '../../utils/validations'

export default {
  name: 'businessData',
  title: 'STOPKA - Dane kontaktowe',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nazwa firmy',
      type: 'string',
      validation: (Rule) => Rule.max(tripleLine.maxLength).error(tripleLine.errorMsg),
    },
    {
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      description: 'z kierunkowym',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!/^\+48\d{9}$/.test(value)) {
            return 'Numer musi mieć format +48XXXXXXXXX (dokładnie 9 cyfr po +48, bez spacji)'
          }

          return true
        }),
    },

    {
      name: 'mail',
      title: 'Email',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value.includes('@')) 'Musi zawierać "@"'

          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) 'Być w formacie jan@domena.com'

          return true
        }),
    },
    {
      name: 'nip',
      title: 'NIP',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (/^\d{10}$/.test(value)) return true
          return 'Wprowadź poprawny NIP'
        }),
    },
  ],
}
