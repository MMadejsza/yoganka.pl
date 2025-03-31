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
