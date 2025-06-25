import ReactQuill from 'react-quill';

function LegalDocument({ title, doc }) {
  return (
    <main className={`doc`}>
      <header className={`doc__header`}>
        <h1
          className={`doc__title generic-details__title admin-action modal-table__title`}
        >
          {title}
        </h1>
        <h3 className={`doc__subtitle modal-table__no-table-note dimmed`}>
          Wersja: {doc.version}
        </h3>
      </header>

      <section className={`doc__content`}>
        <ReactQuill
          value={doc.content}
          readOnly
          theme='snow'
          modules={{ toolbar: false }}
        />
      </section>
    </main>
  );
}

export default LegalDocument;
