function ReviewSlide({ slideData }) {
  const { img, name, productName, review } = slideData;
  const leadingClass = 'reviews';
  const capReview = review => {
    if (review.length >= 289) {
      // cut length
      const newRev = review.slice(0, 289);
      const newRevWords = newRev.split(' ');
      if (newRevWords[newRevWords.length - 1].length >= 5) {
        newRevWords.splice(-1, 1, '[...]');
      } else {
        newRevWords.splice(-3, 3, '[...]');
      }
      return newRevWords.join(' ');
    } else return review;
  };
  capReview(review);
  return (
    <li className='glide__slide'>
      <div className={`tile ${leadingClass}__tile`}>
        {img && (
          <img
            className={`${leadingClass}__img tile__img`}
            src={img}
            alt={`${name} profile photo`}
          />
        )}
        {name && (
          <h3>
            <strong className={`${leadingClass}__name`}>{name}</strong>
          </h3>
        )}
        {productName && (
          <p className={`${leadingClass}__productName`}>{productName}</p>
        )}
        {review && (
          <p
            className={`${leadingClass}__review`}
          >{`"${capReview(review)}"`}</p>
        )}
      </div>
    </li>
  );
}

export default ReviewSlide;
