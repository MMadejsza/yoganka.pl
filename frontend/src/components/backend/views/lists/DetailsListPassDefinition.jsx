import GenericList from '../../../common/GenericList.jsx';

function DetailsListPassDefinition({
  passDefinition,
  userAccountPage,
  isPassPurchaseView,
}) {
  console.log(
    `📝
	    DetailsListPassDefinition object:`,
    passDefinition
  );
  console.log(
    `📝
	    DetailsListPassDefinition isPassPurchaseView:`,
    isPassPurchaseView
  );

  const title = userAccountPage ? 'Rodzaj karnetu' : 'Typ karnetu';
  const passStatus =
    typeof passDefinition.status == 'boolean'
      ? passDefinition.status
      : passDefinition.status.toUpperCase();

  const details = [];
  if (!isPassPurchaseView)
    details.push(
      { label: 'Nazwa:', content: passDefinition.name },
      {
        label: 'Status:',
        content:
          passStatus === 'ACTIVE' || passStatus == 1
            ? 'Aktywny'
            : passStatus === 'SUSPENDED' || passStatus == 0
              ? 'Wstrzymany'
              : 'Niekontynuowany',
      }
    );

  if (!userAccountPage)
    details.push({ label: 'Typ:', content: passDefinition.passType });

  details.push({ label: 'Cena:', content: `${passDefinition.price} zł` });

  if (!isPassPurchaseView)
    details.push({
      label: 'Obejmuje:',
      content: passDefinition.allowedProductTypes
        ? JSON.parse(passDefinition.allowedProductTypes).join(', ')
        : null,
    });

  if (passDefinition.validityDays) {
    details.push({
      label: 'Ważny przez:',
      content: `${passDefinition.validityDays} dni`,
    });
  }

  if (passDefinition.usesTotal && !isPassPurchaseView) {
    details.push({
      label: 'Max ilość wejść:',
      content: passDefinition.usesTotal,
    });
  }
  details.push({ label: 'Opis:', content: passDefinition.description });

  return (
    <GenericList
      title={title}
      details={details}
      classModifier='pass-definition'
    />
  );
}

export default DetailsListPassDefinition;
