import {doubleLine, singleLine, tripleLine, urlMaxLength} from './validations'

export const textList = (isRequired = false) => ({
  name: 'desc',
  title: `Lista akapitów`,
  description: `Dodaj akapit osobno - pojawia sie mała przerwa między nimi.`,
  type: 'array',
  of: [
    {
      type: 'text',
    },
  ],
  validation: isRequired
    ? (Rule) => Rule.required().min(1).error('Dodaj przynajmniej jeden akapit')
    : undefined,
})
export const stringList = (isRequired = false) => ({
  name: 'list',
  title: `Lista elementów`,
  type: 'array',
  of: [{type: 'string'}],
  validation: isRequired
    ? (Rule) => Rule.required().min(1).error('Dodaj przynajmniej jeden element')
    : undefined,
})
export const typesList = {
  name: 'listType',
  title: 'Typ listy',
  type: 'string',
  description: `Różnica tylko w ikonach`,
  options: {
    list: [
      {title: 'Uwzględnione', value: 'included'},
      {title: 'Dodatkowo płatne', value: 'excluded'},
    ],
  },
  initialValue: 'included',
}
export const stringImgTitle = (initialValue = '') => ({
  name: 'title',
  title: 'Podpowiedź przy najechaniu (tooltip)',
  type: 'string',
  description: `Ma wartość UX - niech będzie faktycznie wskazówką dla przycisku. np. "Napisz do mnie na WhatsApp'ie":`,
  initialValue: initialValue,
  validation: (Rule) => Rule.required(),
})
export const simpleTitle = (initialValue, description, required = false) => {
  return {
    name: 'title',
    title: 'Nagłówek',
    type: 'string',
    description,
    initialValue,
    validation: (Rule) =>
      required ? Rule.max(doubleLine.maxLength).error(doubleLine.errorMsg) : undefined,
  }
}
export const stringSymbol = (hiddenFn = undefined) => ({
  name: 'symbol',
  title: 'Symbol (Material Design Symbol)',
  type: 'string',
  hidden: hiddenFn,
  description: (
    <span>
      Nazwa ikony Material Symbols, np. "self_improvement", "park" dostępne na{' '}
      <a
        href="https://fonts.google.com/icons?icon.size=24&icon.color=%23e3e3e3&icon.style=Rounded"
        target="_blank"
        rel="noopener noreferrer"
      >
        tej stronie
      </a>
      . Klikasz w ikonę i kopiujesz "Icon name"
    </span>
  ),
  validation: (Rule) => {
    if (hiddenFn) {
      return Rule.custom((value, context) => {
        const parent = context?.parent
        if (parent?.action === 'external' && !value) {
          return 'Wybierz symbol'
        }
        return true
      })
    } else {
      return Rule.required()
    }
  },
})
export const note = {
  name: 'note',
  title: 'Notatka',
  type: 'string',
}
export const mainImage = {
  name: 'mainImage',
  title: 'Główne zdjęcie',
  type: 'image',
  options: {hotspot: true},
}
export const slug = {
  name: 'slug',
  title: 'Link (URL)',
  type: 'slug',
  description: 'Tylko końcówka, bez "/", np. "yoga-piknik-i-malowanie-ceramiki"',
  options: {source: 'name', maxLength: urlMaxLength},
  validation: (Rule) =>
    Rule.required().custom((slugObj) =>
      slugObj?.current && !slugObj.current.includes('/')
        ? true
        : 'Link jest wymagany i nie może zawierać "/"',
    ),
}
export const date = (required = true) => {
  return {
    name: 'date',
    title: 'Data wydarzenia/rozpoczęcia',
    type: 'datetime',
    validation: required ? (Rule) => Rule.required() : undefined,
  }
}
//sectionTitle
//typ
//name: 'icon',
//name: 'img', logo
//ismodal
//modal jako set?
//link?
//emotki
