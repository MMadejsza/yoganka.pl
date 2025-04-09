import GenericList from '../../../common/GenericList.jsx';

function DetailsListPassDefinition({ passDefinition }) {
  console.log(
    `📝
	    DetailsListPassDefinition object:`,
    passDefinition
  );

  const details = [
    { label: 'Nazwa:', content: passDefinition.name },
    { label: 'Status:', content: passDefinition.status },
    { label: 'Typ:', content: passDefinition.passType },
    { label: 'Ważny na:', content: passDefinition.allowedProductTypes },
    { label: 'Opis:', content: passDefinition.description },
    { label: 'Cena:', content: passDefinition.price },
  ];

  if (passDefinition.validityDays) {
    details.push({
      label: 'Ważny przez:',
      content: passDefinition.validityDays,
    });
  }
  if (passDefinition.usesTotal) {
    details.push({
      label: 'Max ilość wejść:',
      content: passDefinition.usesTotal,
    });
  }

  return (
    <GenericList
      title='Typ karnetu:'
      details={details}
      classModifier='pass-definition'
    />
  );
}

export default DetailsListPassDefinition;
