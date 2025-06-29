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
          {title: 'Grafik', value: 'grafik'},
          {title: 'Zewnętrzny link', value: 'external'},
        ],
      },
    },
    {
      name: 'text',
      title: 'Tekst przycisku',
      type: 'string',
      hidden: ({parent}) => parent.action !== 'external',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent.action === 'external') {
            return !!value || 'Wprowadź tekst przycisku'
          }
          return true
        }),
    },
    {
      name: 'title',
      title: 'Podpowiedź przy najechaniu (tooltip)',
      type: 'string',
      description: `Ma wartość UX - niech będzie faktycznie wskazówką dla przycisku. np. "Napisz do mnie na WhatsApp'ie":`,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL lub numer telefonu',
      type: 'string',
      description: `W przypadku URL grafiku - podaj np. "/grafik/3" - ze "/"`,
      initialValue: '48792891607',
      validation: (Rule) =>
        Rule.custom((value, {parent}) => {
          if (parent.action === 'whatsapp') {
            return /^\d+$/.test(value) || 'Numer telefonu musi być cyframi'
          }
          if (parent.action === 'external') {
            // zamiast Rule.required().validate(value)
            return value ? true : 'URL jest wymagany'
          }
          return true
        }),
    },
  ],
}
