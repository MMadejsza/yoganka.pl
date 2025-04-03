function WrapperModalTable({
  content,
  title,
  noContentMsg,
  toggleBtn,
  form,
  children,
}) {
  const shouldDisplayContent = !!content && content.length > 0;
  return (
    <>
      <h2 className='user-container__section-title modal__title--day admin-action'>
        {`${title} ${content && content.length > 0 ? `(${content.length})` : ''}`}
        {toggleBtn}
      </h2>
      {form}
      {shouldDisplayContent && children}

      {!shouldDisplayContent && (
        <div
          className='user-container__section-title dimmed'
          style={{ fontSize: '2rem', marginBottom: '3re m' }}
        >
          Brak {noContentMsg}
        </div>
      )}
    </>
  );
}

export default WrapperModalTable;
