/*
  GenericForm component wraps a form with common layout and actions.
  Props:
    - title: form title.
    - onSubmit: form submission handler.
    - onReset: form reset handler.
    - children: form fields (inputs, selects, etc.).
    - submitLabel: label for the submit button.
    - resetLabel: label for the reset button.
    - extraButtons: any extra action buttons.
*/
function WrapperForm({
  title,
  subTitle,
  note,
  onSubmit,
  onReset,
  children,
  submitLabel,
  resetLabel,
  isTableRowLike,
  extraButtons,
}) {
  const mainClass = isTableRowLike
    ? `table-form`
    : 'generic-form user-container__details-list modal-checklist__list';
  const fieldsClass = isTableRowLike
    ? 'table-form__content'
    : 'generic-form__fields';
  const btnsClass = isTableRowLike ? 'action-btns' : 'generic-form__actions';
  const resetClass = isTableRowLike
    ? 'form-switch-btn modal__btn--secondary  table-form-btn'
    : 'form-switch-btn modal__btn--secondary modal__btn modal__btn--small';
  const submitClass = isTableRowLike
    ? `form-action-btn table-form-btn table-form-btn--submit`
    : 'form-action-btn modal__btn modal__btn--small';
  return (
    <>
      {title && (
        <h1 className='generic-details__title user-container__section-title modal__title--day'>
          {title}
        </h1>
      )}
      <form onSubmit={onSubmit} className={mainClass}>
        {subTitle && (
          <h3 className='user-container__user-status modal__title'>
            {subTitle}
          </h3>
        )}
        {note && (
          <h3 className='user-container__user-status modal__title dimmed'>
            {note}
          </h3>
        )}
        <div className={fieldsClass}>{children}</div> {/*//! CHILDREN*/}
        {/* {children} */}
        <div className={btnsClass}>
          <button type='reset' onClick={onReset} className={resetClass}>
            <span className='material-symbols-rounded nav__icon'>
              restart_alt
            </span>
            {resetLabel}
          </button>
          <button type='submit' className={submitClass}>
            <span className='material-symbols-rounded nav__icon'>check</span>
            {submitLabel}
          </button>
          {extraButtons} {/*//! EXTRA NOT STANDARD BTNS*/}
        </div>
      </form>
    </>
  );
}

export default WrapperForm;
