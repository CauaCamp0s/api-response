function isValidStatus(code) {
  return Number.isInteger(code) && code >= 100 && code <= 599;
}

function normalizeData(d) {
  return typeof d === 'undefined' ? null : d;
}

function serializeError(err, exposeStack) {
  if (err == null) return null;

  if (Array.isArray(err)) {
    return err.map(e => serializeError(e, exposeStack));
  }

  // Caso único Error → retorna array com 1 item
  if (err instanceof Error) {
    const out = { name: err.name, message: err.message };
    if (exposeStack && err.stack) {
      out.stack = err.stack;
    }
    return [out];
  }

  // Objeto genérico válido
  if (typeof err === 'object' && err !== null) {
    try {
      JSON.stringify(err); // testa se é serializável
      return [err];
    } catch (e) {
      return [{ message: 'Erro não serializável' }];
    }
  }

  // Qualquer outro valor (string, number, etc) → embrulha em array
  return [{ message: String(err) }];
}

module.exports = { isValidStatus, normalizeData, serializeError };