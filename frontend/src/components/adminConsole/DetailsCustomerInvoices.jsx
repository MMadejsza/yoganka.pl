import ModalTable from './ModalTable';

function DetailsCustomerInvoices({ invoicesArray, noInvoices }) {
  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>
        Faktury:
      </h2>

      {!noInvoices ? (
        <ModalTable
          headers={[
            'ID',
            'ID Rezerwacji',
            'Wystawiona',
            'Termin płatności',
            'Kwota całkowita',
            'Status',
          ]}
          keys={['id', 'bId', 'date', 'due', 'totalValue', 'status']}
          content={invoicesArray}
          active={false}
        />
      ) : (
        <div style={{ fontWeight: 'bold', fontSize: '2rem' }}>Brak</div>
      )}
    </>
  );
}

export default DetailsCustomerInvoices;
