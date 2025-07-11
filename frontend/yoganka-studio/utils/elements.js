export const defaultBtnsSet = {
  type: 'object',
  fields: [
    {
      name: 'action',
      title: 'Typ przycisku',
      type: 'string',
      options: {
        list: [
          {title: 'WhatsApp', value: 'whatsapp'},
          {title: 'Telefon', value: 'phone'},
          {title: 'Grafik', value: 'grafik'},
          {title: 'Mail', value: 'mail'},
          {title: 'Zewnętrzny link', value: 'external'},
        ],
      },
    },
    {
      name: 'title',
      title: 'Podpowiedź przy najechaniu (tooltip)',
      type: 'string',
      description: `Ma wartość UX - niech będzie faktycznie wskazówką dla przycisku. np. "Napisz do mnie na WhatsApp'ie":`,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'symbol',
      title: 'Ikona (material symbol)',
      type: 'string',
      hidden: ({parent}) => parent.action !== 'external',
      description: `Nazwa ikony Material Symbols, np. "self_improvement", "park" dostępne na https://fonts.google.com/icons`,
      validation: (Rule) => Rule.required().error(`Wybierz symbol`),
    },
    {
      name: 'text',
      title: 'Tekst przycisku',
      type: 'string',
      hidden: ({parent}) => parent.action !== 'external',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent.action === 'external') {
            return value ? true : 'Wprowadź tekst przycisku dla linku zewnętrznego'
          }
          return true
        }),
    },
    {
      name: 'emailTitle',
      title: 'Domyślny tytuł przychodzącego maila',
      type: 'string',
      description: `Cześć użytkowników i tak zmieni ale część nie, co poprawi Ci porządek w skrzynce`,
      hidden: ({parent}) => parent.action !== 'mail',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent.action === 'mail') {
            return value ? true : 'Wprowadź domyślny tytuł maila'
          }
          return true
        }),
    },
    {
      name: 'qrImage',
      title: 'Obraz QR (kod)',
      type: 'image',
      options: {hotspot: true},
      description: 'Zuploaduj plik PNG/JPG z kodem QR',
      hidden: ({parent}) => parent.action !== 'phone',
    },
    {
      name: 'qrAlt',
      title: 'Tekst alternatywny dla QR',
      type: 'string',
      description: 'Np. "Instagram QR Code" - widoczny tylko jesli qr się nie wyświetla prawidłowo',
      hidden: ({parent}) => parent.action !== 'phone',
      initialValue: `Kod QR z numerem telefonu`,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent.action === 'phone') {
            return !!value || 'Tekst alternatywny nie może być pusty'
          }
          return true
        }),
    },
    {
      name: 'link',
      title: 'URL lub numer telefonu',
      type: 'string',
      description: `W przypadku URL grafiku - podaj np. "/grafik/3" - ze "/"
      W przypadku maila - podaj adres np. "kontakt@yoganka.pl
      Telefon: 48792891607`,
      initialValue: '48792891607',
      validation: (Rule) =>
        Rule.custom((value, {parent}) => {
          const act = parent.action

          // WhatsApp: wymagany i tylko cyfry
          if (act === 'whatsapp') {
            if (!value) return 'Numer WhatsApp jest wymagany'
            return /^\d+$/.test(value) ? true : 'Numer telefonu musi być cyframi bez + i spacji'
          }

          // Telefon: wymagany i cyfry/znaki kierunkowe
          if (act === 'phone') {
            if (!value) return 'Numer telefonu jest wymagany'
            return /^[+\d\s()-]+$/.test(value)
              ? true
              : 'Numer telefonu musi zawierać cyfry i ewentualnie +, spacje, -, ()'
          }

          // Mail: wymagany i podstawowy format
          if (act === 'mail') {
            if (!value) return 'Email jest wymagany'
            return /\S+@\S+\.\S+/.test(value)
              ? true
              : 'Podaj poprawny adres e-mail (np. kontakt@domena.pl)'
          }

          // Zewnętrzny link: wymagany
          if (act === 'external') {
            return value ? true : 'URL jest wymagany dla zewnętrznego linku'
          }

          // Dla pozostałych akcji (np. grafik) nie walidujemy
          return true
        }),
    },
  ],
}
