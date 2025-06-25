import ModalTable from '../../ModalTable.jsx';
import WrapperModalTable from '../../WrapperModalTable.jsx';

function TableProductPayments({ type, payments, isAdminPage }) {
  console.log('\n✅✅✅DetailsProductPayments:');
  console.log(`TableProductPayments payments`, payments);
  console.log('\nisAdminPage:', isAdminPage);

  const paymentsArray = payments;
  const title =
    type === 'Camp' || type === 'Event'
      ? 'Płatności bezpośrednie'
      : type === 'passDef'
      ? 'Płatności'
      : 'Wszystkie płatności bezpośrednie - bezzwrotne';
  const headers = ['Id', 'Data', 'Uczestnik', 'Cena', 'Metoda płatności'];
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
      <ModalTable
        classModifier={'admin-view'}
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
