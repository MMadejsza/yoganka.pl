import { useState } from 'react';
import { getWeekDay } from '../../../../utils/dateTime.js';
import {
  durationToSeconds,
  secondsToDuration,
} from '../../../../utils/statistics/statsUtils.js';
import GenericList from '../../../common/GenericList.jsx';
import ToggleEditButton from '../../../common/ToggleEditButton.jsx';
import DetailsFormProduct from './edit-forms/DetailsFormProduct.jsx';

function DetailsListProduct({ data, placement, userAccessed }) {
  // console.log(
  // 	`📝
  //     product object from backend:`,
  // 	data,
  // );
  const isProductView = placement == 'productView',
    product = data,
    totalSeconds = durationToSeconds(product.duration),
    splitDuration = secondsToDuration(totalSeconds),
    formattedDuration = `${splitDuration.days != '00' ? splitDuration.days + ' dni' : ''} ${
      splitDuration.hours != '00' ? splitDuration.hours + ' godzin' : ''
    } ${splitDuration.minutes != '00' ? splitDuration.minutes + ' minut' : ''}`;

  const [isEditing, setIsEditing] = useState(false);
  const handleStartEditing = () => setIsEditing(true);
  const handleCloseEditing = () => setIsEditing(false);

  const details = [{ label: 'Typ:', content: `${product.type}` }];
  if (placement === 'scheduleView' && !userAccessed) {
    details.push({ label: 'Nazwa:', content: product.name });
  } else if (placement != 'scheduleView') {
    details.push(
      {
        label:
          product.type === 'Camp' || product.type === 'Event'
            ? 'Data:'
            : 'Wdrożono:',
        content: `${product.startDate} (${getWeekDay(product.startDate)})`,
      },
      { label: 'Lokacja:', content: product.location },
      { label: 'Czas trwania:', content: formattedDuration }
    );
  }
  details.push({ label: 'Zadatek:', content: `${product.price} zł` });

  let content = isEditing ? (
    <DetailsFormProduct productData={data} />
  ) : (
    <GenericList
      title={`Szczegóły zajęć:`}
      details={details}
      classModifier='product-view'
    />
  );
  return (
    <>
      {content}
      {isProductView && (
        <ToggleEditButton
          isEditing={isEditing}
          onStartEditing={handleStartEditing}
          onCloseEditing={handleCloseEditing}
        />
      )}
    </>
  );
}

export default DetailsListProduct;
