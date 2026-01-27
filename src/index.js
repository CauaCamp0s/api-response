const constants = require('./constants');
const defaults = require('./defaults');
const cfg = require('./config');
const utils = require('./utils');

function getMessage(key, provided, fallback) {
  if (typeof provided === 'string' && provided.trim()) return provided.trim();
  const fromConfig = cfg.config && cfg.config.messages && cfg.config.messages[key];
  if (typeof fromConfig === 'string' && fromConfig.trim()) return fromConfig.trim();
  return fallback;
}

function chooseStatus(provided, fallback) {
  if (typeof provided === 'number') {
    if (!cfg.config.validateStatus || utils.isValidStatus(provided)) return provided;
  }
  return fallback;
}

function buildResponse(success, statusCode, message, data, errors) {
  return {
    success: !!success,
    statusCode: statusCode,
    message: message == null ? null : message,
    data: utils.normalizeData(data),
    errors: errors == null ? null : errors
  };
}

function success(data, message, statusCode) {
  const sc = chooseStatus(statusCode, constants.OK);
  const msg = getMessage('success', message, defaults.messages.success);
  return buildResponse(true, sc, msg, data, null);
}

function created(data, message) {
  const sc = constants.CREATED;
  const msg = getMessage('created', message, defaults.messages.created);
  return buildResponse(true, sc, msg, data, null);
}

function noContent(message) {
  const sc = constants.NO_CONTENT;
  const msg = getMessage('noContent', message, defaults.messages.noContent);
  // data must be null for no content
  return buildResponse(true, sc, msg, null, null);
}

function error(message, statusCode, errors) {
  const sc = chooseStatus(statusCode, constants.BAD_REQUEST);
  const msg = getMessage('error', message, defaults.messages.error);
  const serErrors = utils.serializeError(errors, cfg.config.exposeStack);
  return buildResponse(false, sc, msg, null, serErrors);
}

function unauthorized(message) {
  const sc = constants.UNAUTHORIZED;
  const msg = getMessage('unauthorized', message, defaults.messages.unauthorized);
  return buildResponse(false, sc, msg, null, null);
}

function forbidden(message) {
  const sc = constants.FORBIDDEN;
  const msg = getMessage('forbidden', message, defaults.messages.forbidden);
  return buildResponse(false, sc, msg, null, null);
}

function notFound(message) {
  const sc = constants.NOT_FOUND;
  const msg = getMessage('notFound', message, defaults.messages.notFound);
  return buildResponse(false, sc, msg, null, null);
}

function internalError(message, errors) {
  const sc = constants.INTERNAL_SERVER_ERROR;
  const msg = getMessage('internalError', message, defaults.messages.internalError);
  const serErrors = utils.serializeError(errors, cfg.config.exposeStack);
  return buildResponse(false, sc, msg, null, serErrors);
}

module.exports = Object.assign(
  {
    success,
    created,
    noContent,
    error,
    unauthorized,
    forbidden,
    notFound,
    internalError,
    configure: cfg.configure
  },
  constants
);
