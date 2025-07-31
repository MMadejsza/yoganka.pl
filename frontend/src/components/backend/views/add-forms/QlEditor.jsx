import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
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
