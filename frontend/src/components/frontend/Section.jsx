// if visited on iOS, remove nor supported backgroundAttachment fixed
let iClass;
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
  iClass = { backgroundAttachment: 'scroll' };
}

function Section({ classy, modifier, header, iSpecific, children, ...props }) {
  let headerContent;
  if (header) {
    headerContent = (
      <header
        className={`${classy}__header ${
          modifier ? `${classy}__header--${modifier}` : ''
        } section-header ${modifier ? `section-header--${modifier}` : ''}`}
      >
        {header}
        {props.hr && <hr />}
      </header>
    );
  }

  return (
    <section
      className={`${classy} ${modifier ?? ''}`}
      style={iSpecific && iClass}
      {...props}
    >
      {headerContent}
      {children}
    </section>
  );
}

export default Section;
