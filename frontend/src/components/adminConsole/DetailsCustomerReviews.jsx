import ModalTable from './ModalTable';

function DetailsCustomerReviews({ reviews, placement }) {
  const feedbackArray = reviews;
  console.log(`DetailsCustomerReviews feedbackArray `, feedbackArray);
  console.log(`DetailsCustomerReviews placement `, placement);

  let keys = [
    'feedbackId',
    'submissionDate',
    'product',
    'schedule',
    'rating',
    'content',
    'delay',
  ];

  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>
        {`${placement != 'reviews' ? 'Opinie:' : 'Inne opinie:'} (${
          feedbackArray.length
        }):`}
      </h2>

      {feedbackArray.length > 0 ? (
        <ModalTable
          headers={[
            'ID',
            'Data wystawienia',
            'Produkt',
            'Termin',
            'Ocena',
            'Komentarz',
            'Opóźnienie',
          ]}
          keys={keys}
          content={feedbackArray}
          active={false}
        />
      ) : (
        <h3 className='user-container__user-status modal__title'>Brak</h3>
      )}
    </>
  );
}

export default DetailsCustomerReviews;
