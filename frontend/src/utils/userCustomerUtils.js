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
    const allowedTypeArr = JSON.parse(
      currentCustomerPass.PassDefinition.allowedProductTypes
    );
    const isAllowedType = allowedTypeArr.some(
      allowedType => allowedType === row.Product?.type
    );
    const parsedDate = parsePLDateAtEndOfDay(row.date);
    const isExpiredAtTheTime =
      new Date(parsedDate) > new Date(currentCustomerPass.validUntil);
    const isStartedAtTheTime =
      new Date(parsedDate) > new Date(currentCustomerPass.validFrom);
    const haEntriesLeft = currentCustomerPass.usesLeft
      ? currentCustomerPass.usesLeft > 0
      : false;

    return (
      isAllowedType &&
      !isExpiredAtTheTime &&
      isStartedAtTheTime &&
      haEntriesLeft
    );
  });
};
