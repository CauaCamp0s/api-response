function isValidStatus(code) {
  return Number.isInteger(code) && code >= 100 && code <= 599;
}

function normalizeData(d) {
  return typeof d === 'undefined' ? null : d;
}

function serializeError(err, exposeStack) {
  if (err == null) return null;

  if (Array.isArray(err)) return err.map(e => serializeError(e, exposeStack));

  if (err instanceof Error) {
    const out = { name: err.name, message: err.message };
    if (exposeStack && err.stack) out.stack = err.stack;
    return out;
  }

  if (typeof err === 'object') {
    try {
      JSON.stringify(err);
      return err;
    } catch (e) {
      return { message: 'Erro não serializável' };
    }
  }

  // primitive (string/number/bool)
  return err;
}

module.exports = { isValidStatus, normalizeData, serializeError };
