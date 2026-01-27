# @caua/api-response

Biblioteca pequena para padronizar respostas HTTP JSON em APIs Node.js (Express/Fastify). Escrito em CommonJS, sem dependências.

## Instalação

```bash
npm install @caua/api-response
```

## Uso (Express)

```js
const response = require('@caua/api-response');

app.get('/users', (req, res) => {
  const users = [];
  const out = response.success(users);
  res.status(out.statusCode).json(out);
});
```

## Uso (Fastify)

```js
const response = require('@caua/api-response');

fastify.get('/users', async (request, reply) => {
  const users = [];
  const out = response.success(users);
  return reply.code(out.statusCode).send(out);
});
```

## Funções disponíveis

- `success(data, message?, statusCode?)`
- `created(data, message?)`
- `noContent(message?)`
- `error(message, statusCode?, errors?)`
- `unauthorized(message?)`
- `forbidden(message?)`
- `notFound(message?)`
- `internalError(message?)`
- `configure({ messages?, exposeStack?, validateStatus? })`

## Exemplos de respostas

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

## Customização

Você pode sobrescrever mensagens padrão e flags com `configure`:

```js
const r = require('@caua/api-response');
r.configure({ messages: { success: 'OK', notFound: 'Nada encontrado' }, exposeStack: false });
```

## Exports úteis

Constantes HTTP: `OK`, `CREATED`, `NO_CONTENT`, `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INTERNAL_SERVER_ERROR`, etc.

## License

MIT
