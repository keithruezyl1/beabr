/**
 * @param {object} [options]
 * @param {boolean} [options.exposeInProduction]
 * When true, the global error handler may return `message` and details for this error even when status >= 500 (e.g. known operational failures).
 */
function httpError(status, message, details, options) {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  if (options?.exposeInProduction) err.exposeInProduction = true;
  return err;
}

module.exports = { httpError };

