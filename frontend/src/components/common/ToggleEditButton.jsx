// ToggleEditButton.jsx

function ToggleEditButton({
  isEditing,
  onStartEditing,
  onCloseEditing,
  isJustSymbol,
}) {
  return (
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
  );
}

export default ToggleEditButton;
