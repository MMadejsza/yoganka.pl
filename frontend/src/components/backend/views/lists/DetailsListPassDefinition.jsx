import GenericList from '../../../common/GenericList.jsx';

function DetailsListPassDefinition({ passDefinition, userAccountPage }) {
  console.log(
    `📝
	    DetailsListPassDefinition object:`,
    passDefinition
  );

  const title = userAccountPage ? 'Rodzaj karnetu' : 'Typ karnetu';

  const details = [
    { label: 'Nazwa:', content: passDefinition.name },
    { label: 'Status:', content: passDefinition.status },
  ];

  if (!userAccountPage)
    details.push({ label: 'Typ:', content: passDefinition.passType });

  details.push(
    { label: 'Cena:', content: `${passDefinition.price} zł` },
    { label: 'Obejmuje:', content: passDefinition.allowedProductTypes }
  );

  if (passDefinition.validityDays) {
    details.push({
      label: 'Ważny przez:',
      content: `${passDefinition.validityDays} dni`,
    });
  }
  if (passDefinition.usesTotal) {
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
