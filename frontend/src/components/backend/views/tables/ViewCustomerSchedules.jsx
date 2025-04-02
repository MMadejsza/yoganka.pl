import ModalTable from '../../ModalTable';

function DetailsCustomerSchedules({ customerStats, classModifier, altTitle }) {
  // PAST and ATTENDED schedules only (stats give only attended)
  const contentPast = customerStats.records.filter(
    schedule =>
      new Date(`${schedule.date}T${schedule.startTime}:00.000Z`) <= new Date()
  );

  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>
        {altTitle ?? `Odbyte zajęcia (${customerStats.schedulesAmount.total}):`}
      </h2>
      {/*REKORDY data godzina miejsce typ productNazwa  */}
      <ModalTable
        headers={['ID', 'Data', 'Dzień', 'Godzina', 'Lokacja', 'Typ', 'Nazwa']}
        keys={[
          'scheduleId',
          'date',
          'day',
          'startTime',
          'location',
          'productType',
          'productName',
        ]}
        content={contentPast}
        active={false}
        classModifier={classModifier}
        notToArchive={true}
      />
    </>
  );
}

export default DetailsCustomerSchedules;
