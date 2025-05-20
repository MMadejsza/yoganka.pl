import { formatAllowedTypes } from './cardsAndTableUtils.jsx';
import { parsePLDateAtEndOfDay } from './dateTime';
import { queryClient } from './http.js';
let debugLogsGloballyTurnedOff = true;

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

// util pass validation
export const isPassValidForSchedule = (pass, schedule) => {
  const logsTurnedOn = false;
  if (logsTurnedOn)
    if (!debugLogsGloballyTurnedOff)
      console.log(
        '[isPassValidForSchedule] Checking pass:',
        pass.PassDefinition.name
      );

  // 1. Is defined?
  if (!pass.PassDefinition) {
    if (!debugLogsGloballyTurnedOff)
      console.log('[isPassValidForSchedule] PassDefinition not defined.');
    return false;
  }
  const passDef = pass.PassDefinition;
  if (logsTurnedOn)
    if (!debugLogsGloballyTurnedOff)
      console.log('[isPassValidForSchedule] Found PassDefinition:', passDef);

  // 2. Is active?
  if (Number(pass.status) !== 1) {
    if (logsTurnedOn)
      if (!debugLogsGloballyTurnedOff)
        console.log(
          '[isPassValidForSchedule] Pass status is not ACTIVE (1):',
          pass.status
        );
    return false;
  }
  if (logsTurnedOn)
    if (!debugLogsGloballyTurnedOff)
      console.log('[isPassValidForSchedule] Pass is ACTIVE(1).');

  // 6. Is count type
  const passType = passDef.passType.toUpperCase();
  if ((passType === 'COUNT' || passType === 'MIXED') && pass.usesLeft <= 0) {
    if (logsTurnedOn)
      if (!debugLogsGloballyTurnedOff)
        console.log(
          '[isPassValidForSchedule] Count pass with no uses left:',
          pass.usesLeft
        );
    return false;
  }

  // 3. Is matching requested schedule?
  if (!schedule.Product || !schedule.Product.type) {
    if (logsTurnedOn)
      if (!debugLogsGloballyTurnedOff)
        console.log(
          '[isPassValidForSchedule] Schedule Product or Product.type is missing.'
        );
    return false;
  }
  if (!passDef.allowedProductTypes) {
    if (logsTurnedOn)
      if (!debugLogsGloballyTurnedOff)
        console.log(
          '[isPassValidForSchedule] allowedProductTypes is missing in PassDefinition.'
        );
    return false;
  }

  // regardless if JSON type
  let allowedTypes;
  if (typeof passDef.allowedProductTypes === 'string') {
    try {
      // Attempt to parse as JSON if the string starts with '['
      if (passDef.allowedProductTypes.trim().startsWith('[')) {
        allowedTypes = JSON.parse(passDef.allowedProductTypes);
      } else {
        allowedTypes = passDef.allowedProductTypes
          .split(',')
          .map(s => s.trim());
      }
    } catch (e) {
      // Fallback if JSON parsing fails
      allowedTypes = passDef.allowedProductTypes.split(',').map(s => s.trim());
    }
  } else if (Array.isArray(passDef.allowedProductTypes)) {
    allowedTypes = passDef.allowedProductTypes;
  } else {
    if (logsTurnedOn)
      if (!debugLogsGloballyTurnedOff)
        console.log(
          '[isPassValidForSchedule] allowedProductTypes is in an unsupported format.'
        );
    return false;
  }
  allowedTypes = allowedTypes.map(type => type.trim().toUpperCase());
  if (logsTurnedOn)
    if (!debugLogsGloballyTurnedOff)
      console.log('[isPassValidForSchedule] Allowed types:', allowedTypes);

  if (!allowedTypes.includes(schedule.Product.type.trim().toUpperCase())) {
    if (logsTurnedOn)
      if (!debugLogsGloballyTurnedOff)
        console.log(
          "[isPassValidForSchedule] Schedule's product type not included in allowed types:",
          schedule.Product.type
        );
    return false;
  }

  // 4. Is expired for schedule?
  if (logsTurnedOn)
    if (!debugLogsGloballyTurnedOff)
      console.log('[isPassValidForSchedule] Raw schedule.date:', schedule.date);
  let isoDate;
  if (schedule.date.includes('.')) {
    const dateParts = schedule.date.split('.');
    if (dateParts.length !== 3) {
      if (logsTurnedOn)
        if (!debugLogsGloballyTurnedOff)
          console.log(
            '[isPassValidForSchedule] Date format is invalid:',
            schedule.date
          );
      return false;
    }
    isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  } else {
    isoDate = schedule.date; // Zakładamy, że data jest już w ISO
  }
  if (logsTurnedOn)
    if (!debugLogsGloballyTurnedOff)
      console.log('[isPassValidForSchedule] Converted ISO date:', isoDate);
  // >> MODYFIKACJA
  const scheduledDateTime = new Date(`${isoDate}T${schedule.startTime}`);
  if (logsTurnedOn)
    if (!debugLogsGloballyTurnedOff)
      console.log(
        '[isPassValidForSchedule] Scheduled date/time:',
        scheduledDateTime
      );
  if (pass.validUntil && scheduledDateTime > new Date(pass.validUntil)) {
    if (logsTurnedOn)
      if (!debugLogsGloballyTurnedOff)
        console.log(
          '[isPassValidForSchedule] Pass is expired for schedule. validUntil:',
          pass.validUntil
        );
    return false;
  }
  // 5. Is not started for schedule?
  if (pass.validFrom && scheduledDateTime < new Date(pass.validFrom)) {
    if (logsTurnedOn)
      if (!debugLogsGloballyTurnedOff)
        console.log(
          '[isPassValidForSchedule] Pass has not started yet. validFrom:',
          pass.validFrom
        );
    return false;
  }

  if (logsTurnedOn)
    if (!debugLogsGloballyTurnedOff)
      console.log('[isPassValidForSchedule] Pass is valid for schedule.');
  // All good - valid
  return pass;
};

export const pickTheBestPassForSchedule = (customerPasses, schedule) => {
  const logsTurnedOn = false;
  if (logsTurnedOn)
    if (!debugLogsGloballyTurnedOff)
      console.log(
        '[pickTheBestPassForSchedule] Customer passes:',
        ...customerPasses.map(cp => cp.PassDefinition.name)
      );
  // Filter passes that are valid for this schedule using our utility function.
  let validPasses;
  if (!customerPasses || customerPasses.length == 0) return;
  validPasses = customerPasses?.filter(pass =>
    isPassValidForSchedule(pass, schedule)
  );
  if (logsTurnedOn)
    if (!debugLogsGloballyTurnedOff)
      console.log(
        '[pickTheBestPassForSchedule] Valid passes:',
        ...validPasses.map(cp => cp.PassDefinition.name)
      );
  if (validPasses.length === 0) {
    if (!debugLogsGloballyTurnedOff)
      console.log('[pickTheBestPassForSchedule] No valid passes found.');
    return null;
  }

  // Determine priority based on pass type.
  // Lower number means higher priority.
  const getPriority = pass => {
    const type = pass.PassDefinition.passType.toUpperCase();
    if (type === 'TIME') return 1; // Highest priority: time passes.
    if (type === 'MIXED') return 2; // Next: mixed passes.
    if (type === 'COUNT') {
      return pass.validUntil ? 3 : 4; // Prefer count passes with an expiration date (count/time) over those without.
    }
    return 5; // Any other type gets the lowest priority.
  };

  // Sort the valid passes by their calculated priority.
  const sortedPasses = validPasses.sort((a, b) => {
    const priorityA = getPriority(a);
    const priorityB = getPriority(b);
    if (logsTurnedOn)
      if (!debugLogsGloballyTurnedOff)
        console.log(
          '[pickTheBestPassForSchedule] Comparing passes, priorities:',
          priorityA,
          priorityB
        );

    // If priorities are different, sort by them.
    if (priorityA !== priorityB) return priorityA - priorityB;

    // If both are count passes, do further comparisons:
    if (a.PassDefinition.passType.toUpperCase() === 'COUNT') {
      // If both have an expiration date, choose the one that expires first.
      if (a.validUntil && b.validUntil) {
        const diff = new Date(a.validUntil) - new Date(b.validUntil);
        if (diff !== 0) {
          if (logsTurnedOn)
            if (!debugLogsGloballyTurnedOff)
              console.log(
                '[pickTheBestPassForSchedule] Both count passes have expiration dates. Difference:',
                diff
              );
          return diff;
        }
      }
      // If only one has an expiration date, that one wins.
      if (a.validUntil && !b.validUntil) {
        if (logsTurnedOn)
          if (!debugLogsGloballyTurnedOff)
            console.log(
              '[pickTheBestPassForSchedule] Only first pass has validUntil. Picking first.'
            );
        return -1;
      }
      if (!a.validUntil && b.validUntil) {
        if (logsTurnedOn)
          if (!debugLogsGloballyTurnedOff)
            console.log(
              '[pickTheBestPassForSchedule] Only second pass has validUntil. Picking second.'
            );
        return 1;
      }
      // If both don't have an expiration date or dates are equal,
      // choose the one with fewer uses left.
      if (logsTurnedOn)
        if (!debugLogsGloballyTurnedOff)
          console.log(
            '[pickTheBestPassForSchedule] Both count passes have same expiration status. Comparing usesLeft:',
            a.usesLeft,
            b.usesLeft
          );
      return a.usesLeft - b.usesLeft;
    }

    // For time or mixed passes, if both have an expiration date, pick the one expiring earlier.
    if (a.validUntil && b.validUntil) {
      const diff = new Date(a.validUntil) - new Date(b.validUntil);
      if (logsTurnedOn)
        if (!debugLogsGloballyTurnedOff)
          console.log(
            '[pickTheBestPassForSchedule] Comparing expiration of time/mixed passes. Difference:',
            diff
          );
      return diff;
    }
    return 0; // No further differences found.
  });

  if (!debugLogsGloballyTurnedOff)
    console.log(
      '[pickTheBestPassForSchedule] Sorted passes:',
      ...sortedPasses.map(cp => cp.PassDefinition.name)
    );
  // Return the best pass, which is at the start of the sorted array.

  return { bestPass: sortedPasses[0], allSorted: sortedPasses };
};
