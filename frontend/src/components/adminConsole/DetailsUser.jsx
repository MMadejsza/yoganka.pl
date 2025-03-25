import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus.js';
import { useFeedback } from '../../hooks/useFeedback.js';
import { formatIsoDateTime } from '../../utils/dateTime.js';
import { mutateOnEdit, queryClient } from '../../utils/http.js';
import FeedbackBox from './FeedbackBox.jsx';

//! Add authorisation that you can reset only your password
function DetailsUser({ userData, customerView, isUserAccountPage }) {
  // console.log(isUserAccountPage);
  const params = useParams();
  const title = isUserAccountPage
    ? `Dane konta:`
    : `Konto (ID ${userData.UserID}):`;

  const { feedback, updateFeedback, resetFeedback } = useFeedback();
  const { data: status } = useAuthStatus();

  const {
    mutate: resetPassword,
    isPending: isResetPasswordPending,
    isError: isResetPasswordError,
    error: resetPasswordError,
  } = useMutation({
    mutationFn: formDataObj => mutateOnEdit(status, formDataObj, ''),

    onSuccess: res => {
      if (status.role == 'ADMIN') {
        queryClient.invalidateQueries([
          'query',
          `/admin-console/show-all-users/${params.id}`,
        ]);
      } else {
        queryClient.invalidateQueries(['query', '/show-account']);
      }

      // updating feedback
      updateFeedback(res);
    },

    onError: err => {
      // updating feedback
      updateFeedback(err);
    },
  });

  return (
    <>
      <h2 className='user-container__section-title modal__title--day'>
        {title}
      </h2>

      <ul className='user-container__details-list modal-checklist__list'>
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>Utworzono:</p>
          <p className='user-container__section-record-content'>
            {formatIsoDateTime(userData.RegistrationDate)}
          </p>
        </li>
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label'>Email:</p>
          <p className='user-container__section-record-content'>
            {userData.Email}
          </p>
        </li>
        <li className='user-container__section-record modal-checklist__li'>
          <p className='user-container__section-record-label password'>
            Hasło:
          </p>

          <button
            type='button'
            className='modal__btn modal__btn--secondary modal__btn--small modal__btn--small-danger password'
          >
            <span className='material-symbols-rounded nav__icon'>
              restart_alt
            </span>{' '}
            Resetuj
          </button>
        </li>

        {!customerView && !userData.Customer && (
          <li className='user-container__section-record modal-checklist__li'>
            <p className='user-container__section-record-label'>Aktywność:</p>
            <p className='user-container__section-record-content'>
              Brak zakupów
            </p>
          </li>
        )}
      </ul>
      {feedback.status !== undefined && (
        <FeedbackBox
          status={feedback.status}
          isPending={isEditUserSettingsPending}
          isError={isEditUserSettingsError}
          error={editUserSettingsError}
          successMsg={feedback.message}
          warnings={feedback.warnings}
          size='small'
        />
      )}
    </>
  );
}

export default DetailsUser;
