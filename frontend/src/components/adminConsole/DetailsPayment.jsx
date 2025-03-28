import { formatIsoDateTime } from '../../utils/dateTime.js';

function DetailsPayment({ paymentData }) {
  const payment = paymentData;
  console.log(
    `📝
	    Schedule object from backend:`,
    paymentData
  );

  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>{`Szczegóły:`}</h2>
      <ul className='user-container__details-list modal-checklist__list'>
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>
            Data płatności:
          </p>
          <p className='user-container__section-record-content'>
            {`${formatIsoDateTime(payment.Date)}`}
          </p>
        </li>
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>Kwota:</p>
          <p className='user-container__section-record-content'>
            {' '}
            {`${payment.AmountPaid}zł`}
          </p>
        </li>
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>
            Metoda Płatności:
          </p>
          <p className='user-container__section-record-content'>
            {payment.PaymentMethod}
          </p>
        </li>
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>Opłacono:</p>
          <p className='user-container__section-record-content'>
            {payment.Status}
          </p>
        </li>
        {payment.AmountDue && payment.AmountDue != '0.00' && (
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>
              Pozostało do zapłaty:
            </p>
            <p className='user-container__section-record-content'>
              {`${payment.AmountDue}zł`}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default DetailsPayment;
