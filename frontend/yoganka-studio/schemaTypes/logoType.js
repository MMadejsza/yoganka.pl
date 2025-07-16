// schemas/logoType.js
import * as components from '../utils/components.jsx'

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
        components.stringImgTitle('Yoganka - Logo'),
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
        components.stringImgTitle('Yoganka - Logo'),
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
        components.stringImgTitle('Yoganka - Logo'),
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
