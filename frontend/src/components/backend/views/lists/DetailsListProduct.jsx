import { useState } from 'react';
import { formatDuration, getWeekDay } from '../../../../utils/dateTime.js';
import ToggleEditButton from '../../../backend/ToggleEditButton.jsx';
import GenericList from '../../../common/GenericList.jsx';
import DetailsFormProduct from './edit-forms/DetailsFormProduct.jsx';

function DetailsListProduct({ data, placement, userAccessed, classModifier }) {
  // console.log(
  // 	`📝
  //     product object from backend:`,
  // 	data,
  // );
  const isProductView = placement == 'productView';
  const product = data;
  const formattedDuration = formatDuration(product);
  const isCamp = product?.type.toUpperCase() === 'CAMP';
  const isEvent = product?.type.toUpperCase() === 'Event';

  const [isEditing, setIsEditing] = useState(false);
  const handleStartEditing = () => setIsEditing(true);
  const handleCloseEditing = () => setIsEditing(false);

  const details = [{ label: 'Typ:', content: `${product.type}` }];
  if (placement === 'scheduleView' && !userAccessed) {
    details.push({ label: 'Nazwa:', content: product.name });
  } else if (placement != 'scheduleView') {
    details.push(
      {
        label: isCamp || isEvent ? 'Data:' : 'Wdrożono:',
        content: `${product.startDate} (${getWeekDay(product.startDate)})`,
      },
      { label: 'Lokacja:', content: product.location },
      { label: 'Czas trwania:', content: formattedDuration }
    );
  }
  details.push({
    label: `${isCamp ? 'Zadatek:' : 'Cena:'}`,
    content: `${product.price} zł`,
  });

  let content = isEditing ? (
    <DetailsFormProduct productData={data} />
  ) : (
    <GenericList
      title={`Szczegóły zajęć:`}
      details={details}
      classModifier={classModifier}
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
