// ToggleEditButton.jsx

function ToggleEditButton({
  isEditing,
  onStartEditing,
  onCloseEditing,
  isJustSymbol,
}) {
  return (
    <div className='user-container__action'>
      <button
        className='modal__btn'
        onClick={() => (isEditing ? onCloseEditing() : onStartEditing())}
      >
        {isEditing ? (
          <>
            <span className='material-symbols-rounded nav__icon'>undo</span>{' '}
            {!isJustSymbol && 'Wróć'}
          </>
        ) : (
          <>
            <span className='material-symbols-rounded nav__icon'>edit</span>{' '}
            {!isJustSymbol && 'Edytuj'}
          </>
        )}
      </button>
    </div>
  );
}

export default ToggleEditButton;
