import ModalTable from './ModalTable';

function DetailsCustomerSchedules({customerStats, classModifier, altTitle}) {
	return (
		<>
			<h2 className='user-container__section-title modal__title--day'>
				{altTitle ?? `Odbyte zajęcia (${customerStats.schedulesAmount.total}):`}
			</h2>
			{/*REKORDY data godzina miejsce typ productNazwa  */}
			<ModalTable
				headers={['ID', 'Data', 'Dzień', 'Godzina', 'Lokacja', 'Typ', 'Nazwa']}
				keys={['id', 'date', 'day', 'time', 'location', 'type', 'name']}
				content={customerStats.records}
				active={false}
				classModifier={classModifier}
			/>
		</>
	);
}

export default DetailsCustomerSchedules;
