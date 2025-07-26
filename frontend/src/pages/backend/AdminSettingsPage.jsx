import TableSMTP from '../../components/backend//views/tables/TableSMTP.jsx';
import SettingsSection from '../../components/backend/SettingsSection.jsx';
import IntroSection from '../../components/common/IntroSection.jsx';

function AdminSettingsPage() {
  return (
    <>
      <IntroSection className={`intro`} data={{ sectionTitle: 'Ustawienia' }} />
      <SettingsSection
        className={`settings-section`}
        extraClass={'main'}
        data={{ sectionTitle: 'SMTP' }}
      >
        <SettingsSection
          className={`settings-section`}
          data={{ sectionTitle: 'Skrzynki pocztowe' }}
        >
          <TableSMTP allSMTPs={[]} isAdminPage={true} shouldToggleFrom={true} />
        </SettingsSection>
      </SettingsSection>
    </>
  );
}

export default AdminSettingsPage;
