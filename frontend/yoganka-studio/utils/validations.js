function makeRule(maxLen, linesLabel) {
  return {
    maxLength: maxLen,
    errorMsg: `Maks ${linesLabel} – znaków: ${maxLen}`,
  };
}

export const singleLine = makeRule(22, '1 linijka');
export const doubleLine = makeRule(45, '2 linijki');
export const tripleLine = makeRule(68, '3 linijki');

export const seoMetaTitle = value => {
  if (!value) return '⚠️ Tytuł SEO jest wymagany';

  if (value.length < 30) return '⚠️ Opis powinien mieć od 30 znaków';
  if (value.length > 60) return '⚠️ Opis powinien mieć do 60 znaków';
  return true;
};
export const seoMetaDescription = value => {
  if (!value) return '⚠️ Opis SEO jest wymagany';

  if (value.length < 70) return '⚠️ Opis powinien mieć od 70 znaków';
  if (value.length > 160) return '⚠️ Opis powinien mieć do 160 znaków';
  return true;
};

export const urlMaxLength = 96;
