import Section from '../frontend/Section.jsx';

function SettingsSection({ className, extraClass, data, children }) {
  return (
    <Section
      classy={`${className}`}
      modifier={extraClass}
      header={data.sectionTitle}
      hr={extraClass == 'main'}
    >
      {children}
    </Section>
  );
}

export default SettingsSection;
