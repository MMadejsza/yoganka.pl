import ModalTable from '../../ModalTable';
import WrapperModalTable from '../../WrapperModalTable';

function TableProductReviews({ stats }) {
  const feedbackArray = stats.reviews;
  const headers = [
    'Id',
    'Termin (Id)',
    'Data wystawienia',
    'Uczestnik',
    'Ocena',
    'Komentarz',
    'Opóźnienie',
  ];
  const table = (
    <WrapperModalTable
      content={feedbackArray}
      title={'Opinie'}
      noContentMsg={'opinii'}
    >
      <ModalTable
        classModifier={'admin-view'}
        headers={headers}
        keys={stats.reviewsKeys}
        content={feedbackArray}
        active={false}
      />
    </WrapperModalTable>
  );

  return table;
}

export default TableProductReviews;
