function DevDetails({ leadingClass }) {
  const devData = {
    content: `© 2025 yoganka.pl. Wszelkie prawa zastrzeżone`,
    subContent: `Projekt i wykonanie: Maciej Madejsza`,
    link: 'https://bit.ly/MaciejMadejszaProjects',
    title: "Developer's GitHub",
  };
  return (
    <div className={`${leadingClass}__credit`}>
      <div className={`${leadingClass}__credits`}>
        {/* hard spaces */}
        {devData.content.replace(' ', '\u00A0')}
      </div>{' '}
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
    </div>
  );
}

export default DevDetails;
