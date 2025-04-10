import ModalTable from '../../ModalTable.jsx';
import WrapperModalTable from '../../WrapperModalTable.jsx';

function TableCustomerPasses({ customerPasses, keys, isAdminPage }) {
  console.log('\TableCustomerPasses:');
  console.log('\nisAdminPage:', isAdminPage);
  console.log('\TableCustomerPasses customerPasses:', customerPasses);

  const title = 'Wszystkie karnety do dzisiaj';
  const headers = [
    'Id',
    'Uczestnik',
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
      noContentMsg={'wykupionych karnetów'}
    >
      <ModalTable
        classModifier={'admin-view'}
        headers={headers}
        keys={keys}
        content={customerPasses}
        active={false}
      />
    </WrapperModalTable>
  );

  return <>{table}</>;
}

export default TableCustomerPasses;
