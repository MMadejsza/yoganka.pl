function WrapperModalTable({
  content,
  title,
  noContentMsg,
  toggleBtn,
  form,
  children,
  shouldShowForm,
}) {
  const shouldDisplayContent = !!content && content.length > 0;

  return (
    <>
      <h2 className='generic-details__title admin-action modal-table__title'>
        {`${title} ${
          content && content.length > 0 ? `(${content.length})` : ''
        }`}
        {toggleBtn}
      </h2>
      {shouldShowForm && form}
      {shouldDisplayContent && children}

      {!shouldDisplayContent && (
        <div className='modal-table__no-table-note dimmed'>
          Brak {noContentMsg}
        </div>
      )}
    </>
  );
}

export default WrapperModalTable;
