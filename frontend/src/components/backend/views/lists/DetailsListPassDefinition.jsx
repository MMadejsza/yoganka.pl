import { formatAllowedTypes } from '../../../../utils/cardsAndTableUtils.jsx';
import { protectWordBreaks } from '../../../../utils/validation.js';
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
  const statusMap = {
    1: 'Aktywny',
    0: 'Zawieszony',
    '-1': 'Wygasły',
  };
  const title = userAccountPage ? '' : 'Typ karnetu';
  const passStatus = Number(passDefinition.status);

  const details = [
    {
      label: 'Numer:',
      content: passDefinition.passDefId,
      extraClass: 'dimmed',
    },
  ];
  if (!isPassPurchaseView)
    details.push(
      { label: 'Nazwa:', content: protectWordBreaks(passDefinition.name) },
      {
        label: 'Status:',
        content: statusMap[passStatus] || 'NIEZNANY',
      }
    );

  if (!userAccountPage)
    details.push({ label: 'Typ:', content: passDefinition.passType });

  details.push({ label: 'Cena:', content: `${passDefinition.price} zł` });

  if (passDefinition.validityDays) {
    details.push({
      label: 'Ważny przez:',
      content: `${passDefinition.validityDays} dni`,
    });
  }

  if (isPassPurchaseView)
    details.push({
      label: 'Obejmuje zajęcia:',
      content: passDefinition.allowedProductTypes
        ? formatAllowedTypes(passDefinition.allowedProductTypes)
        : null,
    });

  if (passDefinition.usesTotal && !isPassPurchaseView) {
    details.push({
      label: 'Max ilość wejść:',
      content: passDefinition.usesTotal,
    });
  }
  details.push({
    label: 'Opis:',
    content: protectWordBreaks(passDefinition.description),
  });

  return (
    <GenericList
      title={title}
      details={details}
      classModifier='pass-definition'
    />
  );
}

export default DetailsListPassDefinition;
