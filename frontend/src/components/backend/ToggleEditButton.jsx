import SymbolOrIcon from '../../components/common/SymbolOrIcon.jsx';

function ToggleEditButton({
  isEditing,
  onStartEditing,
  onCloseEditing,
  isJustSymbol,
}) {
  return (
    <button
      className='btn'
      onClick={() => (isEditing ? onCloseEditing() : onStartEditing())}
    >
      <SymbolOrIcon
        specifier={isEditing ? 'undo' : 'edit'}
        extraClass={'icon--cta'}
      />
      {isEditing && !isJustSymbol ? 'Wróć' : 'Edytuj'}
    </button>
  );
}

export default ToggleEditButton;
