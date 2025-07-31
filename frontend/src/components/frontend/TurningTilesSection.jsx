import Section from './Section.jsx';
import TurningTile from './TurningTile.jsx';

function TurningTilesSection({ tilesModifier, data }) {
  const classy = 'turning-tile';
  return (
    <Section classy={`section--${classy}s`} header={data.sectionTitle}>
      <main className={`${classy}s__container`}>
        {data.list.map((turningTile, index) => (
          <TurningTile
            key={index}
            tilesModifier={tilesModifier}
            content={turningTile}
          />
        ))}
      </main>
    </Section>
  );
}

export default TurningTilesSection;
