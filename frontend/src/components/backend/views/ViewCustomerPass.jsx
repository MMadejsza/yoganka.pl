import SymbolOrIcon from '../../../components/common/SymbolOrIcon.jsx';
import { useHandleStripeRedirect } from '../../../hooks/useHandleStripeRedirect.js';
import { protectWordBreaks } from '../../../utils/validation';
import GenericListTagLi from '../../common/GenericListTagLi.jsx';
import DetailsListCustomerPass from './lists/DetailsListCustomerPass.jsx';
import DetailsListPassDefinition from './lists/DetailsListPassDefinition.jsx';
import DetailsListPayment from './lists/DetailsListPayment.jsx';

function ViewCustomerPass({ data, userAccountPage }) {
  console.log('ViewCustomerPass data', data);

  const { customerPass } = data;
  const passName = `${customerPass.passDefinition.name}`;
  const status = useHandleStripeRedirect();

  return (
    <>
      <h1 className='modal__title modal__title--view'>
        {protectWordBreaks(passName)}
      </h1>
      <h3 className='modal__title modal__title--status'>
        <GenericListTagLi
          objectPair={{
            label: 'Aktywny: ',
            content: (
              <SymbolOrIcon
                specifier={
                  Number(customerPass.status) === 1 ? 'check' : 'close'
                }
                classModifier={'in-title'}
              />
            ),
          }}
          classModifier={'in-title'}
        />
      </h3>

      <div className='generic-outer-wrapper'>
        {/*//@ Pass Definition details */}
        <DetailsListCustomerPass
          customerPass={customerPass}
          userAccountPage={userAccountPage}
        />

        {/*//@ Pass Definition details */}
        <DetailsListPassDefinition
          userAccountPage={userAccountPage}
          passDefinition={customerPass.passDefinition}
        />

        {/*//@ Payment details */}
        <DetailsListPayment
          paymentData={customerPass.payment}
          passDefinition={customerPass.passDefinition}
        />
      </div>
    </>
  );
}

export default ViewCustomerPass;
