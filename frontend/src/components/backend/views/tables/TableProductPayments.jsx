import ModalTableContent from '../../ModalTableContent.jsx';
import WrapperModalTable from '../../WrapperModalTable.jsx';

function TableProductPayments({ type, stats, isAdminPage }) {
  console.log('\n✅✅✅DetailsProductPayments:');
  console.log('\nisAdminPage:', isAdminPage);

  const paymentsArray = stats.totalPayments;
  const title =
    type === 'Camp' || type === 'Event'
      ? 'Płatności bezpośrednie'
      : 'Wszystkie płatności bezpośrednie - bezzwrotne';
  const headers = ['ID', 'Data', 'Uczestnik', 'Zadatek', 'Metoda płatności'];
  const keys = [
    'paymentId',
    'date',
    'customerFullName',
    'amountPaid',
    'paymentMethod',
  ];

  const table = (
    <WrapperModalTable
      content={paymentsArray}
      title={title}
      noContentMsg={'płatności'}
    >
      <ModalTableContent
        headers={headers}
        keys={keys}
        content={paymentsArray}
        active={false}
      />
    </WrapperModalTable>
  );

  return <>{table}</>;
}

export default TableProductPayments;
