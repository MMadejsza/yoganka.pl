// ToggleEditButton.jsx

function ToggleEditButton({ isEditing, onStartEditing, onCloseEditing }) {
  return (
    <div className='user-container__action'>
      <button
        className='modal__btn'
        onClick={() => (isEditing ? onCloseEditing() : onStartEditing())}
      >
        {isEditing ? (
          <>
            <span className='material-symbols-rounded nav__icon'>undo</span>{' '}
            Wróć
          </>
        ) : (
          <>
            <span className='material-symbols-rounded nav__icon'>edit</span>{' '}
            Edytuj
          </>
        )}
      </button>
    </div>
  );
}

export default ToggleEditButton;
