# @cauacampos/api-response

[![npm version](https://img.shields.io/npm/v/@cauacampos/api-response.svg)](https://www.npmjs.com/package/@cauacampos/api-response)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Biblioteca leve e padronizada para respostas HTTP JSON em APIs Node.js (Express/Fastify e outros).
> Garante consistência, fácil manutenção e estrutura limpa para suas APIs.

## 📋 Instalação

```bash
npm install @cauacampos/api-response
```

## 🚀 Começar

### Uso Básico (Express)

```js
const response = require('@cauacampos/api-response');

app.get('/users', (req, res) => {
  const users = [{ id: 1, name: 'Alice' }];
  
  // Retorna { success: true, statusCode: 200, message: 'Operação realizada com sucesso.', data: [...] }
  const out = response.success(users);
  
  res.status(out.statusCode).json(out);
});

app.get('/not-found', (req, res) => {
  // Retorna { success: false, statusCode: 404, message: 'Recurso não encontrado.', ... }
  const out = response.notFound('Usuário não encontrado');
  
  res.status(out.statusCode).json(out);
});
```

### Uso com Middleware Wrapper (Recomendado)

O helper `wrap` facilita o tratamento de erros em funções assíncronas, capturando exceções automaticamente e padronizando a resposta.

```js
const { wrap, success, badRequest } = require('@cauacampos/api-response');

// O wrap captura exceções automaticamente e formata como Internal Server Error ou erro customizado
app.get('/users/:id', wrap(async (req, res) => {
  const user = await findUser(req.params.id);
  
  if (!user) {
    // Você pode retornar o objeto de resposta diretamente
    return response.notFound();
  }
  
  // Ou retornar success
  return response.success(user);
}));
```

## 📚 Referência da API

### Funções de Resposta

Todas as funções retornam um objeto com estrutura padrão: `success`, `statusCode`, `message`, `data` (opcional), `errors` (opcional), `meta` (opcional).

| Função | Status Padrão | Descrição |
|--------|---------------|-----------|
| `success(data, message?, statusCode?)` | 200 (OK) | Resposta de sucesso genérica. |
| `created(data, message?)` | 201 (Created) | Criação de recursos com sucesso. |
| `noContent(message?)` | 204 (No Content) | Sucesso, mas sem corpo de resposta. |
| `paginate(data, meta)` | 200 (OK) | Resposta para listas paginadas. `meta` espera `{ page, perPage, total }`. |
| `redirect(url, statusCode?)` | 302 (Found) | Gera resposta de redirecionamento. |
| `error(message, statusCode?, errors?)` | 400 (Bad Request) | Erro genérico customizável. |
| `validationError(errors, message?)` | 422 (Unprocessable) | Erros de validação de dados de entrada. |
| `badRequest(message?)` | 400 (Bad Request) | Requisição mal formatada (via `clientError`). |
| `unauthorized(message?)` | 401 (Unauthorized) | Falha de autenticação. |
| `forbidden(message?)` | 403 (Forbidden) | Falha de autorização/permissão. |
| `notFound(message?)` | 404 (Not Found) | Recurso não encontrado. |
| `conflict(message?)` | 409 (Conflict) | Conflito de estado (ex: email duplicado). |
| `tooManyRequests(message?)` | 429 (Too Many Requests)| Limite de requisições excedido. |
| `internalError(message?, errors?)` | 500 (Internal Server Error) | Erro inesperado do servidor. |

### Utilitários

#### `wrap(handler)`
Envolve um handler (controller) assíncrono. Se o handler retornar um objeto de resposta (criado pelas funções acima), ele envia automaticamente o JSON com o status correto. Se o handler lançar um erro, ele o captura e converte usando `fromError`.

#### `fromError(err)`
Converte um objeto `Error` ou erro qualquer em uma estrutura de resposta padronizada. Útil em middlewares de erro globais.

## 💡 Exemplos de Estrutura JSON

**Sucesso com Paginação (`paginate`):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operação realizada com sucesso.",
  "data": [...],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Erro de Validação (`validationError`):**
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Erro de validação.",
  "errors": [
    { "message": "Email é obrigatório" },
    { "message": "Senha muito curta" }
  ]
}
```

## ⚙️ Configuração Global

Você pode alterar as mensagens padrão e comportamentos globais no início da sua aplicação.

```js
const response = require('@cauacampos/api-response');

response.configure({
  messages: {
    success: 'Tudo certo!',
    notFound: 'Não achamos nada aqui.'
  },
  exposeStack: process.env.NODE_ENV === 'development', // Mostra stack trace em erros
  validateStatus: true // Garante que status codes sejam números válidos
});
```

## 🔧 Constantes HTTP Exportadas

Para evitar "magic numbers", o pacote exporta constantes para os códigos HTTP:

```js
const { 
  OK, CREATED, NO_CONTENT,
  BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, CONFLICT, 
  PAYLOAD_TOO_LARGE, UNPROCESSABLE_ENTITY, TOO_MANY_REQUESTS,
  INTERNAL_SERVER_ERROR, SERVICE_UNAVAILABLE
} = require('@cauacampos/api-response');
```

## 📄 Licença

MIT
