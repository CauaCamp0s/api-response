const defaults = require('./defaults');

const config = {
  messages: Object.assign({}, defaults.messages),
  exposeStack: !!defaults.exposeStack,
  validateStatus: !!defaults.validateStatus,
  format: null
};

function configure(opts) {
  if (!opts || typeof opts !== 'object') return config;

  if (opts.messages && typeof opts.messages === 'object') {
    for (const k in opts.messages) {
      if (!Object.prototype.hasOwnProperty.call(opts.messages, k)) continue;
      const v = opts.messages[k];
      if (typeof v === 'string' && v.trim()) config.messages[k] = v.trim();
    }
  }

  if (typeof opts.exposeStack === 'boolean') config.exposeStack = opts.exposeStack;
  if (typeof opts.validateStatus === 'boolean') config.validateStatus = opts.validateStatus;
  if (typeof opts.format === 'function') config.format = opts.format;

  return config;
}

module.exports = { config, configure };
