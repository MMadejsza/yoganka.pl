// if visited on iOS, remove nor supported backgroundAttachment fixed
let iClass;
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
  iClass = { backgroundAttachment: 'scroll' };
}

function Section({ classy, modifier, header, iSpecific, children, ...props }) {
  let headerContent;
  let headerConditionalClass = `${classy}__header${
    modifier ? ` ${classy}__header--${modifier}` : ''
  } section__header${modifier ? ` section__header--${modifier}` : ''}`;

  let sectionConditionalClass = `section${classy ? ` ${classy}` : ''}${
    modifier ? `  ${modifier}` : ''
  }`;

  if (header) {
    headerContent = (
      <header className={headerConditionalClass}>
        {header}
        {props.hr && <hr />}
      </header>
    );
  }

  return (
    <section
      className={sectionConditionalClass}
      style={iSpecific && iClass}
      {...props}
    >
      {headerContent}
      {children}
    </section>
  );
}

export default Section;
