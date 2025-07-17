import { doubleLine, urlMaxLength } from './validations';

export const note = {
  name: 'note',
  title: 'Notatka',
  type: 'string',
};
export const mainImage = {
  name: 'mainImage',
  title: 'Główne zdjęcie',
  type: 'image',
  options: { hotspot: true },
};
export const date = (required = true) => {
  return {
    name: 'date',
    title: 'Data wydarzenia/rozpoczęcia',
    type: 'datetime',
    validation: required ? Rule => Rule.required() : undefined,
  };
};
export const slug = {
  name: 'slug',
  title: 'Link (URL)',
  type: 'slug',
  description:
    'Tylko końcówka, bez "/", np. "yoga-piknik-i-malowanie-ceramiki"',
  options: { source: 'name', maxLength: urlMaxLength },
  validation: Rule =>
    Rule.required().custom(slugObj =>
      slugObj?.current && !slugObj.current.includes('/')
        ? true
        : 'Link jest wymagany i nie może zawierać "/"'
    ),
};
export const textList = (isRequired = false) => ({
  name: 'list',
  title: `Lista akapitów`,
  description: `Dodaj akapit osobno - pojawia sie mała przerwa między nimi.`,
  type: 'array',
  of: [
    {
      type: 'text',
    },
  ],
  validation: isRequired
    ? Rule => Rule.required().min(1).error('Dodaj przynajmniej jeden akapit')
    : undefined,
});
export const stringList = (isRequired = false) => ({
  name: 'list',
  title: `Lista elementów`,
  type: 'array',
  of: [{ type: 'string' }],
  validation: isRequired
    ? Rule => Rule.required().min(1).error('Dodaj przynajmniej jeden element')
    : undefined,
});
export const typesList = {
  name: 'listType',
  title: 'Typ listy',
  type: 'string',
  description: `Różnica tylko w ikonach`,
  options: {
    list: [
      { title: 'Uwzględnione', value: 'included' },
      { title: 'Dodatkowo płatne', value: 'excluded' },
    ],
  },
  initialValue: 'included',
};
export const hiddenType = initialValue => ({
  name: 'type',
  title: 'Typ',
  type: 'string',
  hidden: true,
  initialValue,
});
export const sectionTitle = {
  name: `sectionTitle`,
  title: `Tytuł sekcji`,
  type: `string`,
  validation: Rule => Rule.max(doubleLine.maxLength).error(doubleLine.errorMsg),
  initialValue: document => document.name || '',
};
export const stringImgTitle = (initialValue = '') => ({
  name: 'title',
  title: 'Podpowiedź przy najechaniu (tooltip)',
  type: 'string',
  description: `Ma wartość UX - niech będzie faktycznie wskazówką dla przycisku. np. "Napisz do mnie na WhatsApp'ie":`,
  initialValue: initialValue,
  validation: Rule => Rule.required(),
});
export const simpleTitle = (initialValue, description, required = false) => {
  return {
    name: 'title',
    title: 'Nagłówek',
    type: 'string',
    description,
    initialValue,
    validation: Rule =>
      required
        ? Rule.max(doubleLine.maxLength).error(doubleLine.errorMsg)
        : undefined,
  };
};
export const stringSymbol = (hiddenFn = undefined) => ({
  name: 'symbol',
  title: 'Symbol (Material Design Symbol)',
  type: 'string',
  hidden: hiddenFn,
  description: (
    <span>
      Nazwa ikony Material Symbols, np. "self_improvement", "park" dostępne na{' '}
      <a
        href='https://fonts.google.com/icons?icon.size=24&icon.color=%23e3e3e3&icon.style=Rounded'
        target='_blank'
        rel='noopener noreferrer'
      >
        tej stronie
      </a>
      . Klikasz w ikonę i kopiujesz "Icon name"
    </span>
  ),
  validation: Rule => {
    if (hiddenFn) {
      return Rule.custom((value, context) => {
        const parent = context?.parent;
        if (parent?.action === 'external' && !value) {
          return 'Wybierz symbol';
        }
        return true;
      });
    } else {
      return Rule.required();
    }
  },
});
export const stringIcon = {
  name: 'icon',
  title: 'Ikona',
  description: (
    <span>
      Nazwa ikony Font Awesome, np. "fa-brands[...]"{' '}
      <a
        href='https://fontawesome.com/search?ic=free'
        target='_blank'
        rel='noopener noreferrer'
      >
        z tej listy IKON
      </a>
      {`. Klikasz w ikonę i kopiujesz zielony tekst z cudzysłowie bez tego
      cudzysłowie.      
      Np. <i class="fa-solid fa-bell"> ? ➡️ fa-solid fa-bell`}
    </span>
  ),
  type: 'string',
  validation: Rule => Rule.required(),
};
export const logoImg = (isActive = false) => ({
  name: !isActive ? 'img' : 'imgActive',
  title: `Plik Logo${!isActive ? ' - wersja aktywna (kolor akcentowy)' : ''}`,
  type: 'image',
  options: { hotspot: true },
  description: `Załaduj plik PNG/JPG/SVG${!isActive ? ' .Wersję aktywyną nalezy stworzyć samemu - pokolorować logo w kolorze akcentu. Chyba, że z czasem będziesz wrzucać tylko svg to one się kolorują odpowiednio same (daj znać jeśli nie)' : ''}`,
});
export const isModal = {
  name: 'isModal',
  title: 'Czy ma modal?',
  type: 'boolean',
  initialValue: false,
};
export const link = ({
  description = 'Pełny link - np. https://www.facebook.com/people/Yoganka/100094192084948/',
  isConditionalFnSet = { parentLabel: false, fn: undefined },
  isHeavilyRequired = true,
} = {}) => {
  if (isConditionalFnSet.fn) {
    description = `W przypadku maila - podaj adres np."kontakt@yoganka.pl | Whatsapp z kierunkowym bez '+': 48792891607. |
          Telefon z kierunkowym : +48792891607. |  Zewnętrzny link - pełny link`;
  }

  return {
    name: 'link',
    title: 'Link',
    type: 'string',
    description,
    hidden: isConditionalFnSet.fn ?? undefined,
    validation: Rule =>
      Rule.custom((value, { parent = undefined }) => {
        if (isHeavilyRequired && !value) return 'Link jest wymagany';

        const act = parent[isConditionalFnSet.parentLabel];

        if (act === 'whatsapp') {
          return /^\d{11}$/.test(value)
            ? true
            : 'Numer telefonu musi być cyframi bez + i spacji';
        }

        if (act === 'phone') {
          return /^\+\d{11}$/.test(value)
            ? true
            : 'Numer telefonu musi być w formacie +48xxxxxxxxx';
        }

        if (act === 'mail') {
          return /\S+@\S+\.\S+/.test(value)
            ? true
            : 'Podaj poprawny adres e-mail (np. kontakt@yoanka.pl)';
        }

        if (act === 'external') {
          return /^https:\/\//.test(value)
            ? true
            : 'URL jest wymagany dla zewnętrznego linku';
        }

        if (isHeavilyRequired && !/^https:\/\//.test(value))
          return 'Podaj poprawny URL (https://…)';

        return true;
      }),
  };
};

//emotki

//sets.js
