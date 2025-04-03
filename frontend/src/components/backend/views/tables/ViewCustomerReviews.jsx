import ModalTableContent from '../../ModalTableContent';
import WrapperModalTable from '../../WrapperModalTable';

function DetailsCustomerReviews({ reviews, placement }) {
  const feedbackArray = reviews.content;
  console.log(`DetailsCustomerReviews feedbackArray `, feedbackArray);
  console.log(`DetailsCustomerReviews placement `, placement);
  console.log(`DetailsCustomerReviews reviews `, reviews);

  const headers = [
    'ID',
    'Data wystawienia',
    'Zajęcia',
    'Termin',
    'Ocena',
    'Komentarz',
    'Opóźnienie',
  ];
  return (
    <>
      <WrapperModalTable
        content={feedbackArray}
        title={placement != 'reviews' ? 'Opinie:' : 'Inne opinie:'}
        noContentMsg={'opinii'}
      >
        <ModalTableContent
          headers={headers}
          keys={reviews.keys}
          content={feedbackArray}
          active={false}
        />
      </WrapperModalTable>
    </>
  );
}

export default DetailsCustomerReviews;
