import ModalTable from '../../ModalTable';
import WrapperModalTable from '../../WrapperModalTable';

function TableCustomerInvoices({ invoicesArray, noInvoices }) {
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
  return (
    <>
      <WrapperModalTable
        content={invoicesArray}
        title={'Faktury:'}
        noContentMsg={'faktur'}
      >
        <ModalTable
          classModifier={'admin-view'}
          headers={headers}
          keys={keys}
          content={invoicesArray}
          active={false}
        />
      </WrapperModalTable>
    </>
  );
}

export default TableCustomerInvoices;
