function SymbolOrIcon({
  type = 'SYMBOL',
  specifier,
  classModifier,
  extraClass,
  ...rest
}) {
  const icon = (
    <i
      className={`${specifier} nav__icon ${
        classModifier ? `nav__icon--${classModifier}` : ''
      }${extraClass ? ` ${extraClass}` : ''}`}
      aria-hidden='true'
      {...rest}
    ></i>
  );
  const symbol = (
    <span
      className={`account material-symbols-rounded nav__icon notranslate ${
        classModifier ? `nav__icon--${classModifier}` : ''
      } ${extraClass ? ` ${extraClass}` : ''}`}
      translate='no'
      {...rest}
    >
      {`${specifier}`}
    </span>
  );

  const content = type?.toUpperCase() == 'ICON' ? icon : symbol;

  return content;
}

export default SymbolOrIcon;
