// !HELPERS
export const errorCode = 500;

export const callLog = (req, person, controllerName) => {
  console.clear();
  console.log(`\n➡️➡️➡️  Request: ${req.method} ${req.url}`);
  console.log(`\n➡️➡️➡️  ${person} called ${controllerName}`);
};

//msg fetched, created, deleted, updated, sent etc.
export const successLog = (person, controllerName, msg) => {
  console.log(
    `\n✅✅✅  ${person} ${controllerName} SUCCESSES ${msg ? `(${msg})` : ''}`
  );
};

export const catchErr = (
  person,
  res,
  errCode,
  err,
  controllerName,
  extraProps = {}
) => {
  console.log(
    `\n❌❌❌ Error ${person} ${controllerName}`,
    err?.message || err
  );
  if (res.headersSent) {
    return;
  }
  return res?.status(errCode).json({
    confirmation: -1,
    message: err.message,
    ...extraProps, // type: 'signup', code: 409,
  });
};
