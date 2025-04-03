import ModalTableContent from '../../ModalTableContent';
import WrapperModalTable from '../../WrapperModalTable';

function DetailsCustomerInvoices({ invoicesArray, noInvoices }) {
  const headers = [
    'ID',
    'ID Płatności',
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
        <ModalTableContent
          headers={headers}
          keys={keys}
          content={invoicesArray}
          active={false}
        />
      </WrapperModalTable>
    </>
  );
}

export default DetailsCustomerInvoices;
