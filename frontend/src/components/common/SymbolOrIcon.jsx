function SymbolOrIcon({ type = 'SYMBOL', specifier, classModifier }) {
  const icon = (
    <i
      className={`${specifier} nav__icon ${
        classModifier ? `nav__icon--${classModifier}` : ''
      }`}
      aria-hidden='true'
    ></i>
  );
  const symbol = (
    <span
      className={`material-symbols-rounded nav__icon ${
        classModifier ? `nav__icon--${classModifier}` : ''
      } account`}
    >
      {`${specifier}`}
    </span>
  );

  const content = type?.toUpperCase() == 'ICON' ? icon : symbol;

  return content;
}

export default SymbolOrIcon;
