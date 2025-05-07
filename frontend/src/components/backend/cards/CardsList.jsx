import CardWrapper from './CardWrapper.jsx';

//Simply maps an array of rows to CardWrappers choosing proper card type.
export default function CardsList({
  content,
  active,
  onOpen,
  onQuickAction,
  status,
  isAdminPage,
  adminActions,
  notToArchive,
}) {
  return (
    <div className='cards-container'>
      {content.map((row, idx) => (
        <CardWrapper
          key={idx}
          row={row}
          index={idx}
          active={active}
          onOpen={onOpen}
          onQuickAction={onQuickAction}
          status={status}
          isAdminPage={isAdminPage}
          adminActions={adminActions}
          notToArchive={notToArchive}
        />
      ))}
    </div>
  );
}
