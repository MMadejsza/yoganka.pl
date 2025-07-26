import Motto from './HeaderMotto.jsx';

function Bio({ placement, data, motto, isMobile }) {
  const prefix = placement;
  const pClass = `${prefix}__bio--description`;

  return (
    // <article className={`${prefix}__bio--content`}>
    <article className={`${prefix}__bio--content`}>
      <h2 className={`${prefix}__bio--heading`}>{data.title}</h2>
      {data.paragraphs.map((pr, index) => (
        <p className={pClass} key={index}>
          {pr}
        </p>
      ))}

      <p className={`${prefix}__bio--signature`}>{data.signature}</p>
      {isMobile ? null : <Motto content={motto} />}
    </article>
  );
}

export default Bio;
