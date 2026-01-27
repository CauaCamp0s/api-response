# @caua/api-response

[![npm version](https://badge.fury.io/js/%40caua%2Fapi-response.svg)](https://badge.fury.io/js/%40caua%2Fapi-response)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2012.0.0-brightgreen.svg)](https://nodejs.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/CauaCamp0s/api-response)

> Biblioteca pequena para padronizar respostas HTTP JSON em APIs Node.js (Express/Fastify). Escrito em CommonJS, sem dependências externas.

## 📋 Instalação

```bash
npm install @caua/api-response
```

## 🚀 Começar

### Uso (Express)

```js
const response = require('@caua/api-response');

app.get('/users', (req, res) => {
  const users = [];
  const out = response.success(users);
  res.status(out.statusCode).json(out);
});
```

### Uso (Fastify)

```js
const response = require('@caua/api-response');

fastify.get('/users', async (request, reply) => {
  const users = [];
  const out = response.success(users);
  return reply.code(out.statusCode).send(out);
});
```

## 📚 Referência da API

### Funções disponíveis

| Função | Descrição |
|--------|-----------|
| `success(data, message?, statusCode?)` | Resposta bem-sucedida (padrão 200) |
| `created(data, message?)` | Resposta de criação (201) |
| `noContent(message?)` | Resposta sem conteúdo (204) |
| `error(message, statusCode?, errors?)` | Erro genérico |
| `unauthorized(message?)` | Não autorizado (401) |
| `forbidden(message?)` | Acesso proibido (403) |
| `notFound(message?)` | Não encontrado (404) |
| `internalError(message?)` | Erro interno do servidor (500) |
| `configure(options)` | Configurar opções globais |

## 💡 Exemplos de respostas

Sucesso genérico:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Sucesso",
  "data": {}
}
```

Erro genérico:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Mensagem de erro",
  "errors": null
}
```

## ⚙️ Customização

Você pode sobrescrever mensagens padrão e flags com `configure`:

```js
const r = require('@caua/api-response');

r.configure({ 
  messages: { 
    success: 'OK', 
    notFound: 'Nada encontrado' 
  }, 
  exposeStack: false 
});
```

### Opções de configuração

```js
{
  messages: {},        // Sobrescrever mensagens padrão
  exposeStack: false,  // Expor stack trace em erros
  validateStatus: true // Validar status HTTP
}
```

## 🔧 Constantes HTTP

Exports úteis para uso em sua aplicação:

```js
const r = require('@caua/api-response');

// Status codes
const { 
  OK,                    // 200
  CREATED,               // 201
  NO_CONTENT,            // 204
  BAD_REQUEST,           // 400
  UNAUTHORIZED,          // 401
  FORBIDDEN,             // 403
  NOT_FOUND,             // 404
  INTERNAL_SERVER_ERROR  // 500
} = r;
```

## 📄 Licença

MIT
