import SymbolOrIcon from '../../components/common/SymbolOrIcon.jsx';

function ToggleAddButton({ isEditing, onToggle }) {
  return (
    <button
      onClick={e => {
        e.preventDefault;
        onToggle(!isEditing);
      }}
      className={`form-action-btn symbol-only-btn symbol-only-btn--submit`}
    >
      <SymbolOrIcon
        specifier={!isEditing ? 'add_circle' : 'undo'}
        classModifier={'side'}
      />
    </button>
  );
}

export default ToggleAddButton;
