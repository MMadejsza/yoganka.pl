import ModalTableContent from '../../ModalTableContent';
import WrapperModalTable from '../../WrapperModalTable';

function DetailsProductReviews({ stats }) {
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
      <ModalTableContent
        headers={headers}
        keys={stats.reviewsKeys}
        content={feedbackArray}
        active={false}
      />
    </WrapperModalTable>
  );

  return table;
}

export default DetailsProductReviews;
