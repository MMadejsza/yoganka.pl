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
  toggleBtn,
  extraButtons,
  classModifier,
}) {
  const mainClass = isTableRowLike
    ? `generic-details generic-details--table-form ${
        classModifier ? `generic-details--${classModifier}` : ''
      }`
    : `generic-details ${
        classModifier ? `generic-details--${classModifier}` : ''
      }`;
  const fieldsClass = isTableRowLike
    ? `generic-details__list generic-details__list--table-form  ${
        classModifier ? `generic-details__list--${classModifier}` : ''
      } modal-checklist__list`
    : `generic-details__list  ${
        classModifier ? `generic-details__list--${classModifier}` : ''
      } modal-checklist__list`;
  const btnsClass = isTableRowLike
    ? 'action-btns'
    : `modal__user-action ${
        classModifier ? `modal__user-action--${classModifier}` : ''
      }`;
  const resetClass = isTableRowLike
    ? 'form-switch-btn modal__btn--secondary form-switch-btn--table-form symbol-only-btn'
    : classModifier == 'login-page'
    ? 'form-switch-btn modal__btn  modal__btn--secondary'
    : 'form-switch-btn modal__btn--secondary modal__btn modal__btn--small';
  const submitClass = isTableRowLike
    ? `form-action-btn form-action-btn--table-form  symbol-only-btn symbol-only-btn--submit`
    : `form-action-btn modal__btn ${classModifier == 'login-page' ? '' : ''}`;
  return (
    <>
      <form onSubmit={onSubmit} className={mainClass}>
        {title && (
          <h2
            className={`generic-details__title ${
              classModifier ? `generic-details__title--${classModifier}` : ''
            } modal__title--day`}
          >
            {title}
            {toggleBtn}
          </h2>
        )}
        {subTitle && (
          <h3
            className={`generic-details__subtitle ${
              classModifier ? `generic-details__subtitle--${classModifier}` : ''
            } modal__title--status`}
          >
            {subTitle}
          </h3>
        )}
        {note && (
          <h3
            className={`generic-details__subtitle ${
              classModifier ? `generic-details__subtitle--${classModifier}` : ''
            } modal__title dimmed`}
          >
            {note}
          </h3>
        )}
        <div className={fieldsClass}>{children}</div> {/*//! CHILDREN*/}
        <footer className={btnsClass}>
          {extraButtons} {/*//! EXTRA NOT STANDARD BTNS*/}
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
        </footer>
      </form>
    </>
  );
}

export default WrapperForm;
