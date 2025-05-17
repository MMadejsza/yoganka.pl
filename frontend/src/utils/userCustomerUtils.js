import { formatAllowedTypes } from './cardsAndTableUtils.jsx';
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
  const debugLogsTurnedOn = false;

  // If there are no customer passes, just return false
  if (!status?.user?.Customer?.CustomerPasses) return false;

  return status.user?.Customer?.CustomerPasses?.some(currentCustomerPass => {
    // Parse allowedProductTypes and make sure it's an array
    let allowedTypeArr = currentCustomerPass.PassDefinition.allowedProductTypes;

    allowedTypeArr = formatAllowedTypes(allowedTypeArr, '', true);

    // Make sure each product type is uppercase for comparison
    const productType = row.Product?.type
      ? row.Product.type.trim().toUpperCase()
      : '';
    const isAllowedType = allowedTypeArr.some(
      allowedType => allowedType.toUpperCase() === productType
    );

    // Parse the schedule date (date from row)
    const parsedDate = parsePLDateAtEndOfDay(row.date); // This should return a valid date string
    if (!parsedDate || isNaN(new Date(parsedDate))) {
      if (debugLogsTurnedOn)
        console.log('hasValidPassFn: parsedDate error', row.date, parsedDate);
      return false;
    }

    const scheduleDate = new Date(parsedDate);

    // Check if the pass is still valid at this time
    const isExpiredAtTheTime =
      scheduleDate > new Date(currentCustomerPass.validUntil);
    const isStartedAtTheTime =
      scheduleDate >= new Date(currentCustomerPass.validFrom);

    // If pass is COUNT or MIXED, we need to check entries left
    const passType = currentCustomerPass.PassDefinition.passType.toUpperCase();
    const hasEntriesLeft =
      passType === 'COUNT' || passType === 'MIXED'
        ? currentCustomerPass.usesLeft > 0
        : true;

    // Debug logs if needed
    if (debugLogsTurnedOn)
      console.log('[hasValidPassFn]', {
        productType,
        allowedTypeArr,
        scheduleDate,
        validUntil: currentCustomerPass.validUntil,
        validFrom: currentCustomerPass.validFrom,
        isExpiredAtTheTime,
        isStartedAtTheTime,
        hasEntriesLeft,
      });

    // All conditions must be met for the pass to be considered valid
    return (
      isAllowedType &&
      !isExpiredAtTheTime &&
      isStartedAtTheTime &&
      hasEntriesLeft
    );
  });
};
