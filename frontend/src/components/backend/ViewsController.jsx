import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { fetchItem, mutateOnDelete, queryClient } from '../../utils/http.js';
import FeedbackBox from './FeedbackBox.jsx';
import WrapperModal from './WrapperModal.jsx';
import ViewBooking from './views/ViewBooking.jsx';
import ViewCustomer from './views/ViewCustomer.jsx';
import ViewPassDefinition from './views/ViewPassDefinition.jsx';
import ViewPayment from './views/ViewPayment.jsx';
import ViewProduct from './views/ViewProduct.jsx';
import ViewReview from './views/ViewReview.jsx';
import ViewSchedule from './views/ViewSchedule.jsx';
import ViewUser from './views/ViewUser.jsx';

function ViewsController({
  modifier,
  visited,
  onClose,
  paymentOps,
  userAccountPage,
  customer,
  role,
}) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const callPath = location.pathname;
  const isAdminPanel = location.pathname.includes('admin-console');
  // const isUserSettings = location.pathname.includes('konto/ustawienia');
  const isCustomerQuery = location.pathname.includes('konto/rezerwacje')
    ? '/customer'
    : '';
  const minRightsPrefix = role == 'ADMIN' ? '' : '';
  const noFetchPaths = ['statystyki', 'zajecia', 'rezerwacje', 'faktury'];

  console.log('ViewsController callPath: ', callPath);
  console.log('ViewsController isCustomerQuery: ', isCustomerQuery);
  console.log('ViewsController: modifier =', modifier);
  console.log('✅ role', role);

  // const [editingState, setEditingState] = useState(false);
  const [deleteWarningTriggered, setDeleteWarningTriggered] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['query', location.pathname],
    queryFn: ({ signal }) =>
      fetchItem(callPath, { signal }, isCustomerQuery || minRightsPrefix),
    staleTime: 0,
    refetchOnMount: true,
    enabled: !!params.id || location.pathname.includes('ustawienia'),
  });

  if (data) {
    console.log('ViewsController data: ', data);
  }
  const effectiveData = noFetchPaths.some(pathPart =>
    location.pathname.split('/').pop().includes(pathPart)
  )
    ? customer
    : data;

  const { data: status } = useAuthStatus();

  const resolveModifier = () => {
    console.log('resolveModifier data:', data);
    console.log('resolveModifier modifier:', modifier);
    let controller = {};
    switch (modifier) {
      case 'user':
        controller.recordDisplay = (
          <ViewUser
            data={data}
            isUserAccountPage={
              location.pathname.includes('ustawienia') ?? false
            }
          />
        );
        controller.deleteBtnTitle = 'Konto';
        controller.deleteQuery = `delete-user/${data.user.userId}`;
        controller.redirectTo = '/admin-console/show-all-users';
        controller.warnings = [
          'Powiązanego profilu uczestnika',
          'Wszystkich powiązanych płatności',
          'Wszystkich powiązanych obecności',
          'Wszystkich powiązanych faktur',
          'Wszystkich powiązanych opinii',
          "oraz newsletter'ów",
        ];
        // controller.recordEditor = <UserForm />;
        return controller;
      case 'customer':
        controller.recordDisplay = <ViewCustomer data={data} />;
        controller.recordEditor = '';
        controller.deleteBtnTitle = 'Profil Uczestnika';

        controller.deleteQuery = `delete-customer/${data.customer.customerId}`;
        controller.redirectTo = '/admin-console/show-all-customers';
        controller.warnings = [
          'Wszystkich powiązanych płatności',
          'Wszystkich powiązanych faktur',
          'Wszystkich powiązanych obecności',
          'Wszystkich powiązanych opinii',
        ];
        return controller;
      case 'product':
        controller.recordDisplay = (
          <ViewProduct data={data} isAdminPanel={isAdminPanel} />
        );
        controller.recordEditor = '';
        controller.deleteBtnTitle = 'Produkt';
        controller.deleteQuery = `delete-product/${data.product.productId}`;
        controller.redirectTo = '/admin-console/show-all-products';
        controller.warnings = [
          'Wszystkich powiązanych terminów',
          'Wszystkich powiązanych opinii',
        ];
        return controller;
      case 'schedule':
        controller.recordDisplay = (
          <ViewSchedule
            data={data}
            paymentOps={paymentOps}
            onClose={onClose}
            isModalOpen={visited}
            isAdminPanel={isAdminPanel}
          />
        );
        controller.recordEditor = '';
        controller.deleteBtnTitle = 'Termin';
        controller.deleteQuery = `delete-schedule/${data.schedule.scheduleId}`;
        controller.redirectTo = '/admin-console/show-all-schedules';
        controller.warnings = [
          'Wszystkich powiązanych opinii',
          'Wszystkich powiązanych z terminem obecności, a więc wpłynie na statystyki zajęć i użytkowników',
          '(Jesli nie dodano go omyłkowo to nie ma potrzeby usuwania terminu - można go zarchiwizować)',
        ];
        return controller;
      case 'payment':
        controller.recordDisplay = (
          <ViewPayment
            data={data}
            isUserAccountPage={userAccountPage}
            onClose={onClose}
            isModalOpen={visited}
          />
        );
        controller.recordEditor = '';
        controller.deleteBtnTitle = 'Płatność';
        controller.deleteQuery = `delete-payment/${data.payment.paymentId}`;
        controller.redirectTo = '/admin-console/show-all-payments';
        controller.warnings = [
          'Wszystkich powiązanych faktur',
          'Wszystkich powiązanych z płatnością rezerwacji',
          'Wszystkich powiązanych z płatnością karnetów',
          '  ❗ Wszystkich powiązanych z tymi karnetami rezerwacji, a więc wpłynie na statystyki zajęć i użytkowników',
          '  ❗❗A więc wpłynie na statystyki zajęć i użytkowników',
          '🗒️ Nie ma potrzeby tego robić jesli nie jest to płatność omyłkowa',
        ];
        return controller;
      case 'review':
        controller.recordDisplay = (
          <ViewReview data={customer} onClose={onClose} isModalOpen={visited} />
        );
        controller.recordEditor = '';
        controller.deleteBtnTitle = 'Opinię';
        controller.deleteQuery = `delete-feedback/${data.feedback.feedbackId}`;
        controller.redirectTo = '/admin-console/show-all-participants-feedback';
        controller.warnings = '';
        return controller;
      case 'booking':
        controller.recordDisplay = (
          <ViewBooking data={data} onClose={onClose} isModalOpen={visited} />
        );
        controller.recordEditor = '';
        controller.deleteBtnTitle = 'Rezerwację';
        controller.deleteQuery = `delete-booking/${data.booking.bookingId}`;
        controller.redirectTo = '/admin-console/show-all-bookings';
        controller.warnings = [
          'Powiązanej płatności (jeśli opłacona bezpośrednio)',
          '🗒️ Jeśli chcesz tylko oznaczyć nieobecność, nie usuwaj rezerwacji',
        ];
        return controller;
      case 'passDef':
        controller.recordDisplay = (
          <ViewPassDefinition
            data={data}
            onClose={onClose}
            isModalOpen={visited}
          />
        );
        controller.recordEditor = '';
        controller.deleteBtnTitle = 'Definicję karnetu';
        controller.deleteQuery = `delete-pass-definition/${data.passDef.passDefId}`;
        controller.redirectTo = '/admin-console/show-all-passes';
        controller.warnings = [
          // 'Powiązanej płatności (jeśli opłacona bezpośrednio)',
          // '🗒️ Jeśli chcesz tylko oznaczyć nieobecność, nie usuwaj rezerwacji',
        ];
        return controller;

      default:
        break;
    }
  };

  let dataDisplay;
  let dataEditor;
  let deleteWarnings;
  let redirectToPage;
  let dataDeleteQuery;

  if (isPending) {
    dataDisplay = 'Loading...';
  }
  if (isError) {
    if (error.code == 401) {
      navigate('/login');
    } else {
      console.log(error, error.code, error.message);
      dataDisplay = 'Error in UserDetails fetch...';
    }
  }

  console.log(`ViewsController customer: `, customer);
  let deleteTitle;
  if (effectiveData) {
    const {
      recordDisplay,
      recordEditor,
      deleteBtnTitle,
      warnings,
      deleteQuery,
      redirectTo,
    } = resolveModifier();
    dataDisplay = recordDisplay;
    dataEditor = recordEditor;
    deleteTitle = deleteBtnTitle;
    deleteWarnings = warnings;
    dataDeleteQuery = deleteQuery;
    redirectToPage = redirectTo;
  }

  const { feedback, updateFeedback, resetFeedback } = useFeedback({
    getRedirectTarget: () => redirectToPage || null,
    onClose: onClose,
  });

  const {
    mutate: deleteRecord,
    isPending: isDeletePending,
    isError: isDeleteError,
    error: deleteError,
    reset,
  } = useMutation({
    mutationFn: formDataObj =>
      mutateOnDelete(
        status,
        formDataObj,
        `/api/admin-console/${dataDeleteQuery}`
      ),

    onSuccess: res => {
      queryClient.invalidateQueries([
        'query',
        `/admin-console/show-all-users/${params.id}`,
      ]);
      updateFeedback(res);
    },
    onError: err => {
      updateFeedback(err);
    },
  });

  const handleDelete = () => {
    reset();
    if (!deleteWarningTriggered) {
      // 1st click
      updateFeedback({
        confirmation: 0,
        message: '',
        warnings: deleteWarnings,
      });
      setDeleteWarningTriggered(true);
    } else {
      // 2nd click
      resetFeedback(); //!_______________________________________________________________________________
      reset();
      deleteRecord({});
    }
  };
  const handleCancelDelete = () => {
    resetFeedback();
    setDeleteWarningTriggered(false);
  };

  const actionBtn = (onClick, type, symbol) => {
    const content = type == 'danger' ? `Usuń ${deleteTitle}` : 'Wróć';

    return (
      <button
        onClick={onClick}
        className={`modal__btn modal__btn--small modal__btn--small-${type}`}
      >
        {<span className='material-symbols-rounded nav__icon'>{symbol}</span>}
        {content}
      </button>
    );
  };

  return (
    <WrapperModal visited={visited} onClose={onClose}>
      {!deleteWarningTriggered
        ? dataDisplay
        : (feedback.status != undefined || deleteWarningTriggered) && (
            <FeedbackBox
              warnings={feedback.warnings}
              status={feedback.status}
              successMsg={feedback.message}
              isPending={isDeletePending}
              isError={isDeleteError}
              error={deleteError ? { message: deleteError.message } : null}
              redirectTarget={redirectToPage}
              onClose={onClose}
              size='small'
            />
          )}
      <footer className='modal__user-action'>
        {isAdminPanel && (
          <>
            {actionBtn(handleDelete, 'danger', 'delete_forever')}
            {deleteWarningTriggered &&
              actionBtn(handleCancelDelete, 'success', 'undo')}
          </>
        )}
      </footer>
    </WrapperModal>
  );
}

export default ViewsController;
