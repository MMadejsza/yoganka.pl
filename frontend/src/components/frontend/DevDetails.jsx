function DevDetails({ leadingClass }) {
  const devData = {
    content: `© 2025 yoganka.pl. Wszelkie prawa zastrzeżone`,
    subContent: `Wykonanie projektu: Maciej Madejsza`,
    link: 'https://yoganka.pl/',
    title: "Developer's GitHub - MMadejsza",
  };

  return (
    <div className={`${leadingClass}__credit`}>
      <div className={`${leadingClass}__credits`}>
        {/* hard spaces */}
        {devData.content.replace(' ', '\u00A0')}
      </div>{' '}
      {devData.link ? (
        <a
          className={`${leadingClass}__credits--sub`}
          href={devData.link}
          target='_blank'
          title={devData.title}
        >
          <div
            className={`${leadingClass}__credits ${leadingClass}__credits--sub`}
          >
            {devData.subContent.replace(' ', '\u00A0')}
          </div>
        </a>
      ) : (
        <div
          className={`${leadingClass}__credits ${leadingClass}__credits--sub`}
        >
          {devData.subContent.replace(' ', '\u00A0')}
        </div>
      )}
    </div>
  );
}

export default DevDetails;
