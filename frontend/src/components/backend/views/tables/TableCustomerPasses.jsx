import ModalTable from '../../ModalTable.jsx';
import WrapperModalTable from '../../WrapperModalTable.jsx';

function TableCustomerPasses({
  customerPasses,
  keys,
  isAdminView,
  isAdminDash,
  isActive,
  onOpen,
}) {
  console.log('\TableCustomerPasses:');
  console.log('\nisAdminPage:', isAdminView);
  console.log('\TableCustomerPasses customerPasses:', customerPasses);

  const title = 'Wszystkie zakupione karnety';

  const headers = isAdminView
    ? [
        'Id',
        'Uczestnik',
        'Karnet',
        'Zakupiono',
        'Ważny od',
        'Ważny do',
        'Pozostało wejść',
        'Status',
      ]
    : [
        'Id',
        'Karnet',
        'Zakupiono',
        'Ważny od',
        'Ważny do',
        'Pozostało wejść',
        'Status',
      ];

  const table = isAdminDash ? (
    <ModalTable
      classModifier={'admin-view'}
      headers={headers}
      keys={keys}
      content={customerPasses}
      active={isActive}
      onOpen={onOpen}
    />
  ) : (
    <WrapperModalTable
      content={customerPasses}
      title={title}
      noContentMsg={'zakupionych karnetów'}
    >
      <ModalTable
        classModifier={'admin-view'}
        headers={headers}
        keys={keys}
        content={customerPasses}
        active={isActive}
        onOpen={onOpen}
      />
    </WrapperModalTable>
  );

  return <>{table}</>;
}

export default TableCustomerPasses;
