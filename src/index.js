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

function buildResponse(success, statusCode, message, data, errors, meta) {
  const response = {
    success: !!success,
    statusCode: statusCode,
    message: message == null ? null : message,
    data: utils.normalizeData(data),
    errors: errors == null ? null : errors
  };

  if (meta != null) response.meta = meta;

  if (cfg.config.format && typeof cfg.config.format === 'function') {
    return cfg.config.format(response);
  }

  return response;
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

function paginate(data, meta) {
  const sc = constants.OK;
  const msg = getMessage('success', null, defaults.messages.success);
  const paginationMeta = meta || {};
  if (typeof paginationMeta === 'object' && !Array.isArray(paginationMeta)) {
    if (paginationMeta.page != null && paginationMeta.perPage != null && paginationMeta.total != null) {
      paginationMeta.totalPages = Math.ceil(paginationMeta.total / paginationMeta.perPage);
    }
  }
  return buildResponse(true, sc, msg, data, null, paginationMeta);
}

function validationError(errors, message) {
  const sc = constants.UNPROCESSABLE_ENTITY;
  const msg = getMessage('validationError', message, defaults.messages.validationError);
  return buildResponse(false, sc, msg, null, errors);
}

function conflict(message) {
  const sc = constants.CONFLICT;
  const msg = getMessage('conflict', message, defaults.messages.conflict);
  return buildResponse(false, sc, msg, null, null);
}

function tooManyRequests(message) {
  const sc = constants.TOO_MANY_REQUESTS;
  const msg = getMessage('tooManyRequests', message, defaults.messages.tooManyRequests);
  return buildResponse(false, sc, msg, null, null);
}

function redirect(url, statusCode) {
  const sc = chooseStatus(statusCode, 302);
  const response = {
    success: true,
    statusCode: sc,
    location: url
  };
  if (cfg.config.format && typeof cfg.config.format === 'function') {
    return cfg.config.format(response);
  }
  return response;
}

function fromError(err) {
  if (!err) return error('Erro desconhecido');

  const statusCode = err.statusCode || constants.INTERNAL_SERVER_ERROR;
  const message = err.message || defaults.messages.internalError;
  const errors = err.errors || null;

  return buildResponse(false, statusCode, message, null, errors);
}

function wrap(handler) {
  return async (req, res, next) => {
    try {
      const result = await handler(req, res, next);
      if (result && typeof result === 'object' && 'success' in result) {
        const sc = result.statusCode || constants.OK;
        return res.status(sc).json(result);
      }
      return result;
    } catch (err) {
      const response = fromError(err);
      const sc = response.statusCode || constants.INTERNAL_SERVER_ERROR;
      return res.status(sc).json(response);
    }
  };
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
    paginate,
    validationError,
    conflict,
    tooManyRequests,
    redirect,
    fromError,
    wrap,
    configure: cfg.configure
  },
  constants
);
