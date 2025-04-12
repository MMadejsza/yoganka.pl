import GenericListTagLi from '../../common/GenericListTagLi.jsx';
import DetailsListPassDefinition from './lists/DetailsListPassDefinition.jsx';
import TableCustomerPasses from './tables/TableCustomerPasses.jsx';
import TableProductPayments from './tables/TableProductPayments.jsx';

function ViewPassDefinition({ data, role }) {
  console.log('ViewPassDefinition data', data);

  const { passDef } = data;

  return (
    <>
      <h1 className='modal__title modal__title--view'>{`${passDef.name}`}</h1>
      {role === 'ADMIN' && (
        <>
          <h2 className='modal__title modal__title--status'>{`Karnet (Id:${passDef.passDefId})`}</h2>
          <h3 className='modal__title modal__title--status'>
            <GenericListTagLi
              objectPair={{
                label: 'Aktywny: ',
                content: (
                  <span
                    className={`material-symbols-rounded nav__icon nav__icon--in-title`}
                  >
                    {passDef.status ? 'check' : 'close'}
                  </span>
                ),
              }}
              classModifier={'in-title'}
            />
          </h3>
        </>
      )}

      {/*//@ Pass Definition details */}
      <div className='generic-component-wrapper'>
        <DetailsListPassDefinition
          passDefinition={passDef}
          userAccountPage={role != 'ADMIN'}
        />
      </div>

      {role === 'ADMIN' && (
        <>
          {/* //@ CustomerPasses table for this definition */}
          <TableCustomerPasses
            customerPasses={passDef.customerPasses}
            keys={passDef.customerPassesKeys}
            isAdminPage={true}
          />

          {/*//@ Payments table for this definition */}
          <TableProductPayments
            payments={passDef.payments}
            keys={passDef.paymentsKeys}
            type={'passDef'}
            isAdminPage={true}
          />
        </>
      )}
    </>
  );
}

export default ViewPassDefinition;
