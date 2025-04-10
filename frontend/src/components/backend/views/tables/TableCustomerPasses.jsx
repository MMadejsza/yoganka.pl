import ModalTable from '../../ModalTable.jsx';
import WrapperModalTable from '../../WrapperModalTable.jsx';

function TableCustomerPasses({
  customerPasses,
  keys,
  isAdminPage,
  isActive,
  onOpen,
}) {
  console.log('\TableCustomerPasses:');
  console.log('\nisAdminPage:', isAdminPage);
  console.log('\TableCustomerPasses customerPasses:', customerPasses);

  const title = 'Wszystkie zakupione karnety';

  const headers = isAdminPage
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

  const table = (
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
