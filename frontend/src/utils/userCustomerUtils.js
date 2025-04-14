import { parsePLDateAtEndOfDay } from './dateTime';
import { queryClient } from './http.js';

export const applyFontSize = fontsize => {
  if (!fontsize) return;
  const fontSizePref = fontsize?.toLowerCase?.() || 'm';

  const scaleMap = {
    xs: 0.8,
    s: 0.9,
    m: 1,
    l: 1.1,
    xl: 1.2,
  };

  const scale = scaleMap[fontSizePref] ?? 1;

  if (typeof scale === 'number') {
    document.documentElement.style.setProperty('--scale', scale.toString());
  }
  queryClient.invalidateQueries(['authStatus']);
};

export const hasValidPassFn = (status, row) => {
  return status.user?.Customer?.CustomerPasses?.some(currentCustomerPass => {
    // Parsujemy allowedProductTypes i przekształcamy wszystko do uppercase
    let allowedTypeArr = [];
    try {
      allowedTypeArr = JSON.parse(
        currentCustomerPass.PassDefinition.allowedProductTypes
      );
    } catch (e) {
      allowedTypeArr = currentCustomerPass.PassDefinition.allowedProductTypes
        .split(',')
        .map(s => s.trim());
    }
    allowedTypeArr = allowedTypeArr.map(type => type.toUpperCase());

    // Porównujemy typ produktu, również do uppercase
    const productType = row.Product?.type
      ? row.Product.type.trim().toUpperCase()
      : '';
    const isAllowedType = allowedTypeArr.some(
      allowedType => allowedType === productType
    );

    // Parsujemy datę harmonogramu przy użyciu funkcji parsePLDateAtEndOfDay
    const parsedDate = parsePLDateAtEndOfDay(row.date); // Upewnij się, że ta funkcja działa poprawnie
    if (!parsedDate || isNaN(new Date(parsedDate))) {
      // console.log('hasValidPassFn: parsedDate error', row.date, parsedDate);
      return false;
    }

    const scheduleDate = new Date(parsedDate);
    // Używamy operatorów >= i <= (możesz dostosować, jeśli chcesz mieć margines)
    const isExpiredAtTheTime =
      scheduleDate > new Date(currentCustomerPass.validUntil);
    const isStartedAtTheTime =
      scheduleDate >= new Date(currentCustomerPass.validFrom);

    const hasEntriesLeft =
      currentCustomerPass.PassDefinition.passType.toUpperCase() === 'COUNT'
        ? currentCustomerPass.usesLeft > 0
        : true;

    // Log dla debugowania
    // console.log('[hasValidPassFn]', {
    //   productType,
    //   allowedTypeArr,
    //   scheduleDate,
    //   validUntil: currentCustomerPass.validUntil,
    //   validFrom: currentCustomerPass.validFrom,
    //   isExpiredAtTheTime,
    //   isStartedAtTheTime,
    //   hasEntriesLeft,
    // });

    return (
      isAllowedType &&
      !isExpiredAtTheTime &&
      isStartedAtTheTime &&
      hasEntriesLeft
    );
  });
};
