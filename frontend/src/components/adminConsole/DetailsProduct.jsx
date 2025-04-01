import { useState } from 'react';
import DetailsProductForm from './DetailsProductForm.jsx';

import { getWeekDay } from '../../utils/dateTime.js';
import {
  durationToSeconds,
  secondsToDuration,
} from '../../utils/statistics/statsUtils.js';

function DetailsProduct({ data, placement, userAccessed }) {
  // console.log(
  // 	`📝
  //     product object from backend:`,
  // 	data,
  // );
  const isProductView = placement == 'productView';
  const product = data;
  const totalSeconds = durationToSeconds(product.duration);
  const splitDuration = secondsToDuration(totalSeconds);
  const formattedDuration = `${splitDuration.days != '00' ? splitDuration.days + ' dni' : ''} ${
    splitDuration.hours != '00' ? splitDuration.hours + ' godzin' : ''
  } ${splitDuration.minutes != '00' ? splitDuration.minutes + ' minut' : ''}`;

  const [isEditing, setIsEditing] = useState(false);
  const handleStartEditing = () => {
    setIsEditing(true);
  };
  const handleCloseEditing = () => {
    setIsEditing(false);
  };

  let content = isEditing ? (
    <DetailsProductForm productData={data} />
  ) : (
    <ul className='user-container__details-list modal-checklist__list'>
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>Typ:</p>
        <p className='user-container__section-record-content'>{product.type}</p>
      </li>
      {placement == 'scheduleView' && !userAccessed && (
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>Nazwa:</p>
          <p className='user-container__section-record-content'>
            {product.name}
          </p>
        </li>
      )}
      {placement != 'scheduleView' && (
        <>
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>
              {product.type == 'Camp' || product.type == 'Event'
                ? 'Data:'
                : 'Wdrożono:'}
            </p>
            <p className='user-container__section-record-content'>
              {`${product.startDate} (${getWeekDay(product.startDate)})`}
            </p>
          </li>
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>Lokacja:</p>
            <p className='user-container__section-record-content'>
              {product.location}
            </p>
          </li>

          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>
              Czas trwania:
            </p>
            <p className='user-container__section-record-content'>
              {formattedDuration}
            </p>
          </li>
        </>
      )}
      <li className='user-container__section-record modal-checklist__li'>
        <p className='user-container__section-record-label'>Zadatek:</p>
        <p className='user-container__section-record-content'>
          {product.price}zł
        </p>
      </li>
    </ul>
  );

  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>{`Szczegóły zajęć:`}</h2>
      {content}
      {isProductView && (
        <div className='user-container__action'>
          <button
            className='modal__btn'
            onClick={
              isEditing == false ? handleStartEditing : handleCloseEditing
            }
          >
            {isEditing == false ? (
              <>
                <span className='material-symbols-rounded nav__icon'>edit</span>{' '}
                Edytuj
              </>
            ) : (
              <>
                <span className='material-symbols-rounded nav__icon'>undo</span>{' '}
                Wróć
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}

export default DetailsProduct;
