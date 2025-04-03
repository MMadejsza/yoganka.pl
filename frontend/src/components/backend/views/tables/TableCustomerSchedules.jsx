import ModalTableContent from '../../ModalTableContent';
import WrapperModalTable from '../../WrapperModalTable';

function TableCustomerSchedules({ customerStats, classModifier, altTitle }) {
  // PAST and ATTENDED schedules only (stats give only attended)
  const contentPast = customerStats.records.filter(
    schedule =>
      new Date(`${schedule.date}T${schedule.startTime}:00.000Z`) <= new Date()
  );

  const headers = ['ID', 'Data', 'Dzień', 'Godzina', 'Lokacja', 'Typ', 'Nazwa'];
  const keys = [
    'scheduleId',
    'date',
    'day',
    'startTime',
    'location',
    'productType',
    'productName',
  ];
  return (
    <>
      {/*REKORDY data godzina miejsce typ productNazwa  */}
      <WrapperModalTable
        content={contentPast}
        title={'Odbyte zajęcia'}
        noContentMsg={'zajęć'}
      >
        <ModalTableContent
          headers={headers}
          keys={keys}
          content={contentPast}
          active={false}
          classModifier={classModifier}
          notToArchive={true}
        />
      </WrapperModalTable>
    </>
  );
}

export default TableCustomerSchedules;
