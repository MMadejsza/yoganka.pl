import { addDays, addMonths, addYears } from 'date-fns';
import { successLog } from './debuggingUtils.js';

import * as msgs from './resMessagesUtils.js';
// util pass validation
export const isPassValidForSchedule = (pass, schedule) => {
  console.log(
    '[isPassValidForSchedule] Checking pass:',
    pass.PassDefinition.name
  );

  // 1. Is defined?
  if (!pass.PassDefinition) {
    console.log('[isPassValidForSchedule] PassDefinition not defined.');
    return false;
  }
  const passDef = pass.PassDefinition;
  // console.log('[isPassValidForSchedule] Found PassDefinition:', passDef);

  // 2. Is active?
  if (Number(pass.status) !== 1) {
    console.log(
      '[isPassValidForSchedule] Pass status is not ACTIVE (1):',
      pass.status
    );
    return false;
  }
  console.log('[isPassValidForSchedule] Pass is ACTIVE(1).');

  // 6. Is count type
  if (passDef.passType.toUpperCase() === 'COUNT' && pass.usesLeft <= 0) {
    console.log(
      '[isPassValidForSchedule] Count pass with no uses left:',
      pass.usesLeft
    );
    return false;
  }

  // 3. Is matching requested schedule?
  if (!schedule.Product || !schedule.Product.type) {
    console.log(
      '[isPassValidForSchedule] Schedule Product or Product.type is missing.'
    );
    return false;
  }
  if (!passDef.allowedProductTypes) {
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
    console.log(
      '[isPassValidForSchedule] allowedProductTypes is in an unsupported format.'
    );
    return false;
  }
  allowedTypes = allowedTypes.map(type => type.trim().toUpperCase());
  console.log('[isPassValidForSchedule] Allowed types:', allowedTypes);

  if (!allowedTypes.includes(schedule.Product.type.trim().toUpperCase())) {
    console.log(
      "[isPassValidForSchedule] Schedule's product type not included in allowed types:",
      schedule.Product.type
    );
    return false;
  }

  // 4. Is expired for schedule?
  console.log('[isPassValidForSchedule] Raw schedule.date:', schedule.date);
  let isoDate;
  if (schedule.date.includes('.')) {
    const dateParts = schedule.date.split('.');
    if (dateParts.length !== 3) {
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
  console.log('[isPassValidForSchedule] Converted ISO date:', isoDate);
  // >> MODYFIKACJA
  const scheduledDateTime = new Date(`${isoDate}T${schedule.startTime}`);
  console.log(
    '[isPassValidForSchedule] Scheduled date/time:',
    scheduledDateTime
  );
  if (pass.validUntil && scheduledDateTime > new Date(pass.validUntil)) {
    console.log(
      '[isPassValidForSchedule] Pass is expired for schedule. validUntil:',
      pass.validUntil
    );
    return false;
  }
  // 5. Is not started for schedule?
  if (pass.validFrom && scheduledDateTime < new Date(pass.validFrom)) {
    console.log(
      '[isPassValidForSchedule] Pass has not started yet. validFrom:',
      pass.validFrom
    );
    return false;
  }

  console.log('[isPassValidForSchedule] Pass is valid for schedule.');
  // All good - valid
  return pass;
};

//- It filters the customer's passes to find those valid for the schedule and then
// sorts them based on their type and properties. The sort order is:
//
// 1. "time" passes are the best.
// 2. "mixed" passes come next.
// 3. For "count" passes, if one has an expiration date (count/time), it is preferred.
// 4. "count" passes without an expiration date have the lowest priority.
//
// If both count passes have expiration dates, the one expiring earlier is preferred.
// If they have the same expiration or no expiration, the one with fewer remaining uses is chosen.
//
export const pickTheBestPassForSchedule = (customerPasses, schedule) => {
  // console.log(
  //   '[pickTheBestPassForSchedule] Customer passes:',
  //   ...customerPasses.map(cp => cp.PassDefinition.name)
  // );
  // Filter passes that are valid for this schedule using our utility function.
  let validPasses;
  if (!customerPasses || customerPasses.length == 0) return;
  validPasses = customerPasses?.filter(pass =>
    isPassValidForSchedule(pass, schedule)
  );
  // console.log(
  //   '[pickTheBestPassForSchedule] Valid passes:',
  //   ...validPasses.map(cp => cp.PassDefinition.name)
  // );
  if (validPasses.length === 0) {
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
    // console.log(
    //   '[pickTheBestPassForSchedule] Comparing passes, priorities:',
    //   priorityA,
    //   priorityB
    // );

    // If priorities are different, sort by them.
    if (priorityA !== priorityB) return priorityA - priorityB;

    // If both are count passes, do further comparisons:
    if (a.PassDefinition.passType.toUpperCase() === 'COUNT') {
      // If both have an expiration date, choose the one that expires first.
      if (a.validUntil && b.validUntil) {
        const diff = new Date(a.validUntil) - new Date(b.validUntil);
        if (diff !== 0) {
          // console.log(
          //   '[pickTheBestPassForSchedule] Both count passes have expiration dates. Difference:',
          //   diff
          // );
          return diff;
        }
      }
      // If only one has an expiration date, that one wins.
      if (a.validUntil && !b.validUntil) {
        // console.log(
        //   '[pickTheBestPassForSchedule] Only first pass has validUntil. Picking first.'
        // );
        return -1;
      }
      if (!a.validUntil && b.validUntil) {
        // console.log(
        //   '[pickTheBestPassForSchedule] Only second pass has validUntil. Picking second.'
        // );
        return 1;
      }
      // If both don't have an expiration date or dates are equal,
      // choose the one with fewer uses left.
      // console.log(
      //   '[pickTheBestPassForSchedule] Both count passes have same expiration status. Comparing usesLeft:',
      //   a.usesLeft,
      //   b.usesLeft
      // );
      return a.usesLeft - b.usesLeft;
    }

    // For time or mixed passes, if both have an expiration date, pick the one expiring earlier.
    if (a.validUntil && b.validUntil) {
      const diff = new Date(a.validUntil) - new Date(b.validUntil);
      // console.log(
      //   '[pickTheBestPassForSchedule] Comparing expiration of time/mixed passes. Difference:',
      //   diff
      // );
      return diff;
    }
    return 0; // No further differences found.
  });

  console.log(
    '[pickTheBestPassForSchedule] Sorted passes:',
    ...sortedPasses.map(cp => cp.PassDefinition.name)
  );
  // Return the best pass, which is at the start of the sorted array.
  return { bestPass: sortedPasses[0], allSorted: sortedPasses };
};

export const areCustomerDetailsChanged = (
  res,
  person,
  Customer,
  newPhone,
  newContactMethod
) => {
  if (!newPhone || !newPhone.trim()) {
    console.log(`\n❌❌❌ ${person} Error putEditCustomerDetails:`, 'No phone');
    res.status(400).json({
      message: msgs.noPhonePicked,
    });
    return true;
  }

  if (
    Customer.phone === newPhone &&
    Customer.preferredContactMethod === newContactMethod
  ) {
    console.log(`\n❓❓❓ ${person} pudEditCustomer No change`);
    res.status(200).json({
      confirmation: 0,
      message: msgs.noCustomerDetailsChanged,
    });
    return true;
  }

  return false;
};

export const areSettingsChanged = (
  res,
  person,
  controllerName,
  foundSettings,
  givenSettings
) => {
  if (
    foundSettings.handedness == !!givenSettings.handedness &&
    foundSettings.fontSize == givenSettings.font &&
    foundSettings.notifications == !!givenSettings.notifications &&
    foundSettings.animation == !!givenSettings.animation &&
    foundSettings.theme == !!givenSettings.theme
  ) {
    // Nothing changed
    console.log(`\n❓❓❓ putEditUserSettings ${person} Preferences no change`);
    res.status(200).json({
      confirmation: 0,
      message: msgs.noSettingsChange,
    });
    return null;
  } else {
    // Update
    foundSettings.handedness = !!givenSettings.handedness;
    foundSettings.fontSize = givenSettings.font;
    foundSettings.notifications = !!givenSettings.notifications;
    foundSettings.animation = !!givenSettings.animation;
    foundSettings.theme = !!givenSettings.theme;

    return foundSettings.save().then(() => {
      successLog(person, controllerName, 'updated');
      return {
        confirmation: 1,
        message: msgs.settingsUpdated,
      };
    });
  }
};

export const convertDurationToTime = durationInput => {
  const durationInHours = parseFloat(durationInput);
  if (isNaN(durationInHours)) {
    throw new Error(msgs.invalidDuration);
  }
  const hours = Math.floor(durationInHours);
  const minutes = Math.floor((durationInHours - hours) * 60);
  const seconds = Math.floor(((durationInHours - hours) * 60 - minutes) * 60);

  // Format HH:MM:SS (padStart gives 00s)
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const isEmptyInput = (value, PLFieldName, extraMsg) => {
  const isEmptyArr = Array.isArray(value) && value.length == 0;
  const msg = extraMsg || `Pole ${PLFieldName} nie może być puste`;

  if (isEmptyArr || !value || !String(value).trim()) {
    console.log(`\n❌❌❌ ${[value]} field empty`);
    throw new Error(msg);
  }
};

export const calcPassExpiryDate = validityDays => {
  const purchaseDate = new Date();
  let calcExpiryDate;

  if (!validityDays || validityDays <= 0) return null;

  if (validityDays >= 365) {
    // over a year
    calcExpiryDate = addYears(purchaseDate, Math.floor(validityDays / 365));
  } else if (validityDays >= 30) {
    // multiple months (approx. 30 days each)
    calcExpiryDate = addMonths(purchaseDate, Math.floor(validityDays / 30));
  } else {
    // less than a month
    calcExpiryDate = addDays(purchaseDate, validityDays);
  }

  if (calcExpiryDate) {
    // set expiry to end of that day
    calcExpiryDate.setHours(23, 59, 59, 999);
  }

  return calcExpiryDate;
};

export const addRepeatUnit = (date, repeatInterval) => {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error('addRepeatUnit: invalid date input');
  }

  switch (repeatInterval) {
    case 7:
      return addDays(date, 7);
    case 30:
      return addMonths(date, 1);
    case 365:
      return addYears(date, 1);
    default:
      return date; // no change
  }
};
