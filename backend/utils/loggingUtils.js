// !HELPERS
export const errorCode = 500;

export const callLog = (person, controllerName) => {
  console.log(`\n➡️➡️➡️  ${person} called ${controllerName}`);
};

//msg fetched, created, deleted, updated, sent etc.
export const successLog = (person, controllerName, msg) => {
  console.log(
    `\n✅✅✅  ${person} ${controllerName} SUCCESSES ${msg ? `(${msg})` : ''}`
  );
};

export const catchErr = (
  res,
  errCode,
  err,
  controllerName,
  extraProps = {}
) => {
  console.log(`\n❌❌❌ Error Admin ${controllerName}`, err.message);
  return res.status(errCode).json({
    confirmation: -1,
    message: err.message,
    ...extraProps, // type: 'signup', code: 409,
  });
};
