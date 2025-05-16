// if visited on iOS, remove nor supported backgroundAttachment fixed
let iClass;
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
  iClass = { backgroundAttachment: 'scroll' };
}

function Section({ classy, modifier, header, iSpecific, children }) {
  let headerContent;
  if (header) {
    headerContent = (
      <header className={`${classy}__header section-header`}>{header}</header>
    );
  }

  return (
    <section className={`${classy} ${modifier}`} style={iSpecific && iClass}>
      {headerContent}
      {children}
    </section>
  );
}

export default Section;
