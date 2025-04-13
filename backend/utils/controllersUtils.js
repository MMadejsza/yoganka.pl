import { successLog } from './debuggingUtils.js';

// util pass validation
export const isPassValidForSchedule = (pass, schedule) => {
  // 1. Is defined?
  if (!pass.PassDefinition) return false;
  const passDef = pass.PassDefinition;

  // 2. Is active?
  if (pass.status !== 'active') return false;

  // 6. Is count type
  if (passDef.passType === 'count' && pass.usesLeft <= 0) return false;

  // 3. Is matching requested schedule?
  if (!schedule.Product || !schedule.Product.type) return false;
  if (!passDef.allowedProductTypes) return false;

  // regardless if JSON type
  let allowedTypes;
  if (typeof passDef.allowedProductTypes === 'string') {
    allowedTypes = passDef.allowedProductTypes.split(',');
  } else if (Array.isArray(passDef.allowedProductTypes)) {
    allowedTypes = passDef.allowedProductTypes;
  } else {
    return false;
  }

  if (!allowedTypes.includes(schedule.Product.type)) return false;

  // 4. Is expired for schedule?
  const scheduledDateTime = new Date(`${schedule.date}T${schedule.startTime}`);
  if (pass.validUntil && scheduledDateTime > new Date(pass.validUntil)) {
    return false;
  }

  // 5. Is not started for schedule?
  if (pass.validFrom && scheduledDateTime < new Date(pass.validFrom)) {
    return false;
  }

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
  // Filter passes that are valid for this schedule using our utility function.
  const validPasses = customerPasses.filter(pass =>
    isPassValidForSchedule(pass, schedule)
  );
  if (validPasses.length === 0) return null;

  // Determine priority based on pass type.
  // Lower number means higher priority.
  const getPriority = pass => {
    const type = pass.PassDefinition.passType;
    if (type === 'time') return 1; // Highest priority: time passes.
    if (type === 'mixed') return 2; // Next: mixed passes.
    if (type === 'count') {
      return pass.validUntil ? 3 : 4; // Prefer count passes with an expiration date (count/time) over those without.
    }
    return 5; // Any other type gets the lowest priority.
  };

  // Sort the valid passes by their calculated priority.
  const sortedPasses = validPasses.sort((a, b) => {
    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    // If priorities are different, sort by them.
    if (priorityA !== priorityB) return priorityA - priorityB;

    // If both are count passes, do further comparisons:
    if (a.PassDefinition.passType === 'count') {
      // If both have an expiration date, choose the one that expires first.
      if (a.validUntil && b.validUntil) {
        const diff = new Date(a.validUntil) - new Date(b.validUntil);
        if (diff !== 0) return diff;
      }
      // If only one has an expiration date, that one wins.
      if (a.validUntil && !b.validUntil) return -1;
      if (!a.validUntil && b.validUntil) return 1;
      // If both don't have an expiration date or dates are equal,
      // choose the one with fewer uses left.
      return a.usesLeft - b.usesLeft;
    }

    // For time or mixed passes, if both have an expiration date, pick the one expiring earlier.
    if (a.validUntil && b.validUntil) {
      return new Date(a.validUntil) - new Date(b.validUntil);
    }
    return 0; // No further differences found.
  });

  // Return the best pass, which is at the start of the sorted array.
  return sortedPasses[0];
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
