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
  onSubmit,
  onReset,
  children,
  submitLabel = 'Submit',
  resetLabel = 'Reset',
  extraButtons,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className='generic-form user-container__details-list modal-checklist__list'
    >
      {title && <h1 className='form__title'>{title}</h1>}
      {/* <div className='generic-form__fields'>{children}</div> //! CHILDREN */}
      {children}
      <div className='generic-form__actions'>
        <button
          type='reset'
          onClick={onReset}
          className='form-switch-btn modal__btn modal__btn--secondary modal__btn--small'
        >
          <span className='material-symbols-rounded nav__icon'>
            restart_alt
          </span>{' '}
          {resetLabel}
        </button>
        <button
          type='submit'
          className='form-action-btn modal__btn modal__btn--small'
        >
          <span className='material-symbols-rounded nav__icon'>check</span>{' '}
          {submitLabel}
        </button>
        {extraButtons} {/*//! EXTRA NOT STANDARD BTNS*/}
      </div>
    </form>
  );
}

export default WrapperForm;
