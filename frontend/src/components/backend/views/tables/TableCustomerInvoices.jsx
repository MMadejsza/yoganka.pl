import ModalTable from '../../ModalTable';
import WrapperModalTable from '../../WrapperModalTable';

function TableCustomerInvoices({ invoicesArray, noInvoices }) {
  let map = {
    1: 'Opłacona',
    0: 'Częściowo',
    '-1': 'Anulowana',
  };
  const headers = [
    'Id',
    'Id Płatności',
    'Wystawiona',
    'Termin płatności',
    'Kwota całkowita',
    'Status',
  ];
  const keys = [
    'invoiceId',
    'paymentId',
    'invoiceDate',
    'dueDate',
    'totalAmount',
    'paymentStatus',
  ];
  const content = invoicesArray.map(inv => {
    return {
      ...inv,
      paymentStatus: map[Number(inv.paymentStatus)],
    };
  });
  return (
    <>
      <WrapperModalTable
        content={content}
        title={'Faktury:'}
        noContentMsg={'faktur'}
      >
        <ModalTable
          classModifier={'admin-view'}
          headers={headers}
          keys={keys}
          content={content}
          active={false}
        />
      </WrapperModalTable>
    </>
  );
}

export default TableCustomerInvoices;
