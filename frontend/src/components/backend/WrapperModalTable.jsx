function WrapperModalTable({
  content,
  title,
  noContentMsg,
  toggleBtn,
  form,
  children,
}) {
  const shouldDisplayContent = !!content && content.length > 0;
  // console.log('🚨 WrapperModalTable: content.length =', content?.length);
  // console.log('🚨 WrapperModalTable: typeof content =', typeof content);
  // console.log('🚨 WrapperModalTable: isArray =', Array.isArray(content));
  return (
    <>
      <h2 className='generic-details__title admin-action modal-table__title'>
        {`${title} ${content && content.length > 0 ? `(${content.length})` : ''}`}
        {toggleBtn}
      </h2>
      {form}
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
