import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// const Clipboard = Quill.import('modules/clipboard');
// class PlainClipboard extends Clipboard {
//   onPaste(e) {
//     if (e.defaultPrevented || !this.quill.isEnabled()) return;
//     e.preventDefault();
//     const clipboardData = e.clipboardData || window.clipboardData;
//     const text = clipboardData.getData('text/plain') || '';
//     // split lines into paragraphs
//     const html = text
//       .split(/\r?\n/)
//       .filter(line => line !== '')
//       .map(line => `<p>${line}</p>`)
//       .join('');
//     const delta = this.convert(html);
//     this.quill.updateContents(delta, 'silent');
//     this.quill.setSelection(delta.length(), 'silent');
//   }
// }
// Quill.register('modules/clipboard', PlainClipboard, true);

// export default function QlEditor({
//   id,
//   name,
//   label,
//   value,
//   onChange,
//   onBlur,
//   validationResults,
//   didEdit,
//   required,
// }) {
//   const [content, setContent] = useState(value);

//   useEffect(() => {
//     setContent(value);
//   }, [value]);

//   const modules = {
//     toolbar: [
//       [{ font: [] }, { size: [] }], // font family & size
//       [{ header: [1, 2, 3, 4, 5, 6, false] }], // headers H1–H6
//       ['bold', 'italic', 'underline', 'strike'], // toggled buttons
//       [{ color: [] }, { background: [] }], // dropdown with defaults from theme
//       [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
//       ['blockquote', 'code-block'], // blocks
//       [{ list: 'ordered' }, { list: 'bullet' }], // lists
//       [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
//       [{ direction: 'rtl' }], // text direction
//       [{ align: [] }], // text align
//       ['link', 'image', 'video'], // media
//       ['clean'], // remove formatting
//     ],
//     clipboard: {
//       matchVisual: true, // preserve formatting on paste
//     },
//   };

//   const formats = [
//     'header',
//     'bold',
//     'italic',
//     'underline',
//     'link',
//     'image',
//     'list',
//     'bullet',
//     'code-block',
//   ];

//   return (
//     <div
//       className={`generic-details__item checklist__li ${
//         didEdit && validationResults.length ? 'has-error' : ''
//       }`}
//     >
//       <label htmlFor={id}>
//         {label} {required && '*'}
//       </label>
//       <ReactQuill
//         theme='snow'
//         id={id}
//         modules={modules}
//         formats={formats}
//         value={content}
//         onChange={val => {
//           setContent(val);
//           onChange({ target: { name, value: val } });
//         }}
//         onBlur={() => onBlur({ target: { name, value: content } })}
//       />
//       {didEdit &&
//         validationResults.map((v, i) =>
//           !v.valid ? (
//             <div key={i} className='error-message'>
//               {v.message}
//             </div>
//           ) : null
//         )}
//     </div>
//   );
// }
import 'react-quill/dist/quill.snow.css';

// student English comment: simple editor with full toolbar
export default function QlEditor(props) {
  const [content, setContent] = useState(props.value);

  useEffect(() => setContent(props.value), [props.value]);

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: true,
    },
  };

  const formats = [
    'font',
    'size',
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'direction',
    'align',
    'link',
    'image',
    'video',
  ];

  return (
    <ReactQuill
      theme='snow'
      modules={modules}
      formats={formats}
      value={content}
      onChange={val => {
        setContent(val);
        props.onChange({ target: { name: props.name, value: val } });
      }}
      onBlur={() =>
        props.onBlur({ target: { name: props.name, value: content } })
      }
    />
  );
}
