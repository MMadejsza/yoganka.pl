function ToggleAddButton({ isEditing, onToggle }) {
  return (
    <button
      onClick={e => {
        e.preventDefault;
        onToggle(!isEditing);
      }}
      className={`form-action-btn symbol-only-btn symbol-only-btn--submit`}
    >
      <span className='material-symbols-rounded nav__icon nav__icon--side account'>
        {!isEditing ? 'add_circle' : 'undo'}
      </span>
    </button>
  );
}

export default ToggleAddButton;
