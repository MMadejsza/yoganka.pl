// schemas/logoType.js

export default {
  name: 'logotypes',
  title: 'LOGOTYPY',
  type: 'document',
  fields: [
    {
      name: 'fullLogo',
      title: 'Pełne logo',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Podpowiedź przy najechaniu (tooltip)',
          type: 'string',
          initialValue: 'Yoganka - Logo',
        },
        {
          name: 'img',
          title: 'Plik Logo',
          type: 'image',
          options: {hotspot: true},
          description: 'Zuploaduj plik PNG/JPG/SVG',
        },
      ],
    },
    {
      name: 'justBody',
      title: 'Logo - sam kształt',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Podpowiedź przy najechaniu (tooltip)',
          type: 'string',
          initialValue: 'Yoganka - Logo',
        },
        {
          name: 'img',
          title: 'Plik Logo',
          type: 'image',
          options: {hotspot: true},
          description: 'Zuploaduj plik PNG/JPG/SVG',
        },
        {
          name: 'imgActive',
          title: 'Plik Logo - wersja aktywna (kolor akcentowy)',
          type: 'image',
          options: {hotspot: true},
          description: 'Zuploaduj plik PNG/JPG/SVG',
        },
      ],
    },
    {
      name: 'justSign',
      title: 'Logo - sam napis',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Podpowiedź przy najechaniu (tooltip)',
          type: 'string',
          initialValue: 'Yoganka - Logo',
        },
        {
          name: 'img',
          title: 'Plik Logo',
          type: 'image',
          options: {hotspot: true},
          description: 'Zuploaduj plik PNG/JPG/SVG',
        },
      ],
    },
  ],
  preview: {
    select: {logo: 'fullLogo.img'},
    prepare({logo}) {
      return {
        title: `Logotypy`,
        media: logo,
      }
    },
  },
}
