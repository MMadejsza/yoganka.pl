import { formatIsoDateTime } from '../../../../utils/dateTime.js';
import GenericList from '../../../common/GenericList.jsx';

function DetailsReview({ reviewData }) {
  const details = [
    {
      label: 'Data zgłoszenia:',
      content: formatIsoDateTime(reviewData.submissionDate),
    },
    { label: 'Opóźnienie:', content: reviewData.delay },
    { label: 'Ocena:', content: reviewData.rating },
    { label: 'Treść:', content: reviewData.text },
  ];

  return <GenericList title='Szczegóły opinii:' details={details} />;
}

export default DetailsReview;
