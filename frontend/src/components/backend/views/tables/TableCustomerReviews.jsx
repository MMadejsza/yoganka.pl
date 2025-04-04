import ModalTable from '../../ModalTable';
import WrapperModalTable from '../../WrapperModalTable';

function TableCustomerReviews({ reviews, placement }) {
  const feedbackArray = reviews.content;
  console.log(`TableCustomerReviews feedbackArray `, feedbackArray);
  console.log(`TableCustomerReviews placement `, placement);
  console.log(`TableCustomerReviews reviews `, reviews);

  const headers = [
    'Id',
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
        <ModalTable
          headers={headers}
          keys={reviews.keys}
          content={feedbackArray}
          active={false}
        />
      </WrapperModalTable>
    </>
  );
}

export default TableCustomerReviews;
