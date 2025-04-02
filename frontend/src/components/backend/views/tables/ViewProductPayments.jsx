import ModalTable from '../../ModalTable.jsx';

function DetailsProductPayments({ type, stats, isAdminPage }) {
  console.log('\n✅✅✅DetailsProductPayments:');
  console.log('\nisAdminPage:', isAdminPage);

  let paymentsArray = stats.totalPayments;

  const table = (
    <ModalTable
      headers={['ID', 'Data', 'Uczestnik', 'Zadatek', 'Metoda płatności']}
      keys={[
        'paymentId',
        'date',
        'customerFullName',
        'amountPaid',
        'paymentMethod',
      ]}
      content={paymentsArray}
      active={false}
    />
  );

  const title =
    type === 'Camp' || type === 'Event'
      ? 'Płatności bezpośrednie'
      : 'Wszystkie płatności bezpośrednie - bezzwrotne';
  return (
    <>
      <h2 className='user-container__section-title modal__title--day admin-action'>
        {`${title} (${paymentsArray.length}):`}
      </h2>
      {table}
    </>
  );
}

export default DetailsProductPayments;
