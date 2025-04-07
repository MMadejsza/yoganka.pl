import { successLog } from './debuggingUtils.js';

// util pass validation
export const isPassValidForSchedule = (pass, schedule) => {
  // 1. Is active?
  if (pass.status !== 'active') return false;

  // 2. Is defined?
  if (!pass.PassDefinition) return false;
  const passDef = pass.PassDefinition;

  // 3. Is matching requested schedule?
  if (!schedule.Product || !schedule.Product.type) return false;
  if (!passDef.allowedProductTypes) return false;
  const allowedTypes = passDef.allowedProductTypes.split(','); // ["class","online"]
  if (!allowedTypes.includes(schedule.Product.type)) return false;

  // 4. Is expired?
  const now = new Date();
  if (pass.validUntil && now > pass.validUntil) {
    return false;
  }

  // 5. Is started?
  if (pass.validFrom && now < pass.validFrom) {
    return false;
  }

  // 6. Is count type
  if (passDef.passType === 'count' && pass.usesLeft <= 0) return false;

  // All good - valid
  return pass;
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
    res.status(400).json({ message: 'Numer telefonu nie może być pusty' });
    return true;
  }

  if (
    Customer.phone === newPhone &&
    Customer.preferredContactMethod === newContactMethod
  ) {
    console.log(`\n❓❓❓ ${person} pudEditCustomer No change`);
    res.status(200).json({
      confirmation: 0,
      message: 'Brak zmian',
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
    res.status(200).json({ confirmation: 0, message: 'Brak zmian' });
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
        message: 'Ustawienia zostały zaktualizowane.',
      };
    });
  }
};

export const convertDurationToTime = durationInput => {
  const durationInHours = parseFloat(durationInput);
  if (isNaN(durationInHours)) {
    throw new Error('Nieprawidłowa wartość duration.');
  }
  const hours = Math.floor(durationInHours);
  const minutes = Math.floor((durationInHours - hours) * 60);
  const seconds = Math.floor(((durationInHours - hours) * 60 - minutes) * 60);

  // Format HH:MM:SS (padStart gives 00s)
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
