import ModalTable from './ModalTable';

function DetailsProductReviews({ stats }) {
  const feedbackArray = stats.reviews;

  return (
    <>
      <h2 className='user-container__section-title modal__title--day admin-action'>
        {`Opinie (${feedbackArray.length}):`}
      </h2>
      {feedbackArray.length > 0 ? (
        <ModalTable
          headers={[
            'ID',
            'Data wystawienia',
            'Uczestnik',
            'Ocena',
            'Komentarz',
            'Opóźnienie',
          ]}
          keys={stats.reviewsKeys}
          content={feedbackArray}
          active={false}
        />
      ) : (
        <h3 className='user-container__user-status modal__title'>Brak</h3>
      )}
    </>
  );
}

export default DetailsProductReviews;
