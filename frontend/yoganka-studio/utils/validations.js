function makeRule(maxLen, linesLabel) {
  return {
    maxLength: maxLen,
    errorMsg: `Maks ${linesLabel} – znaków: ${maxLen}`,
  }
}

export const singleLine = makeRule(22, '1 linijka')
export const doubleLine = makeRule(45, '2 linijki')
export const tripleLine = makeRule(68, '3 linijki')

export const urlMaxLength = 96
