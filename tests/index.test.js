const apiResponse = require('../src/index');

const {
  success,
  created,
  noContent,
  error,
  unauthorized,
  forbidden,
  notFound,
  internalError,
  validationError,
  conflict,
  tooManyRequests,
  paginate,
  redirect,
  fromError,
  configure,
  OK,
  CREATED,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNPROCESSABLE_ENTITY,
  TOO_MANY_REQUESTS,
  CONFLICT,
  FORBIDDEN,
  NOT_FOUND,
  UNAUTHORIZED,
  NO_CONTENT
} = apiResponse;

describe('api-response', () => {

  beforeEach(() => {
    // Reseta configuração global antes de cada teste
    configure({
      messages: {},
      exposeStack: false,
      validateStatus: true,
      format: null
    });
  });

  describe('Funções de sucesso', () => {

    it('success() deve retornar resposta padrão 200', () => {
      const res = success({ id: 45, name: 'João' });

      expect(res).toEqual({
        success: true,
        statusCode: OK,
        message: 'Operação realizada com sucesso.',
        data: { id: 45, name: 'João' },
        errors: null
      });
    });

    it('success() deve aceitar mensagem customizada', () => {
      const res = success(null, 'Tudo certo por aqui!');

      expect(res.message).toBe('Tudo certo por aqui!');
      expect(res.data).toBeNull();
    });

    it('created() deve retornar 201', () => {
      const res = created({ id: 100 });

      expect(res.statusCode).toBe(CREATED);
      expect(res.message).toBe('Recurso criado com sucesso.');
      expect(res.data).toEqual({ id: 100 });
    });

    it('noContent() deve retornar 204 sem data', () => {
      const res = noContent();

      expect(res.statusCode).toBe(NO_CONTENT);
      expect(res.data).toBeNull();
      expect(res.message).toBe('Sem conteúdo.');
    });

  });

  describe('Funções de erro', () => {

    it('error() padrão → 400', () => {
      const res = error();

      expect(res.success).toBe(false);
      expect(res.statusCode).toBe(BAD_REQUEST);
      expect(res.message).toBe('Ocorreu um erro na requisição.');
      expect(res.errors).toBeNull();
    });

    it('internalError() com objeto Error', () => {
      const err = new Error('Falha no banco');
      const res = internalError('Deu ruim', err);

      expect(res.statusCode).toBe(INTERNAL_SERVER_ERROR);
      expect(res.message).toBe('Deu ruim');
      expect(res.errors).toEqual([
        { name: 'Error', message: 'Falha no banco' }
      ]);
    });

    it('validationError() deve usar 422', () => {
      const errors = [
        { field: 'email', message: 'E-mail inválido' },
        { field: 'password', message: 'Mínimo 8 caracteres' }
      ];

      const res = validationError(errors, 'Dados inválidos');

      expect(res.statusCode).toBe(UNPROCESSABLE_ENTITY);
      expect(res.message).toBe('Dados inválidos');
      expect(res.errors).toEqual(errors);
    });

    it('fromError() deve extrair status e mensagem de erro', () => {
      const err = {
        statusCode: 403,
        message: 'Você não tem permissão',
        errors: ['permissão insuficiente']
      };

      const res = fromError(err);

      expect(res.statusCode).toBe(403);
      expect(res.message).toBe('Você não tem permissão');
      expect(res.errors).toEqual(['permissão insuficiente']);
    });

  });

  describe('Paginação', () => {

    it('paginate() calcula totalPages corretamente', () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const meta = { page: 1, perPage: 10, total: 42 };

      const res = paginate(data, meta);

      expect(res.meta).toEqual({
        page: 1,
        perPage: 10,
        total: 42,
        totalPages: 5
      });
    });

  });

  describe('Configuração global', () => {

    it('configure() altera mensagem padrão de sucesso', () => {
      configure({
        messages: {
          success: 'Ação concluída com êxito!'
        }
      });

      const res = success();

      expect(res.message).toBe('Ação concluída com êxito!');
    });

    it('configure() aceita exposeStack = true', () => {
      configure({ exposeStack: true });

      const err = new Error('Teste stack');
      const res = internalError('Erro interno', err);

      expect(res.errors).toEqual([
        expect.objectContaining({
          name: 'Error',
          message: 'Teste stack',
          stack: expect.any(String)
        })
      ]);

      expect(res.errors[0].stack).toContain('Teste stack');
    });

  });

  describe('redirect', () => {

    it('redirect padrão usa 302', () => {
      const res = redirect('https://app.exemplo.com/dashboard');

      expect(res).toEqual({
        success: true,
        statusCode: 302,
        location: 'https://app.exemplo.com/dashboard'
      });
    });

    it('redirect aceita status customizado', () => {
      const res = redirect('/login', 301);

      expect(res.statusCode).toBe(301);
    });

  });

});