/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Rotas relacionadas a usuários
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Cadastra um novo usuário
 *     description: Cria um novo usuário na aplicação e retorna o token de autenticação.
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - telefone
 *               - endereco
 *               - perfilUsuario
 *               - nomeOrganizacao
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Maria Silva"
 *               email:
 *                 type: string
 *                 example: "maria@example.com"
 *               senha:
 *                 type: string
 *                 example: "minhasenha123"
 *               telefone:
 *                 type: string
 *                 example: "(11) 91234-5678"
 *               endereco:
 *                 type: string
 *                 example: "Rua das Flores, 123 - São Paulo/SP"
 *               perfilUsuario:
 *                 type: string
 *                 enum: [DOADOR, RECEPTOR]
 *                 example: "DOADOR"
 *               nomeOrganizacao:
 *                 type: string
 *                 example: "ONG Esperança"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     idUsuario:
 *                       type: string
 *                       example: "clw3x5z4u0000vh5dwps2tq1z"
 *                     nome:
 *                       type: string
 *                       example: "Maria Silva"
 *                     email:
 *                       type: string
 *                       example: "maria@example.com"
 *                     perfilUsuario:
 *                       type: string
 *                       example: "DOADOR"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *         description: Campos obrigatórios ausentes ou email já registrado
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     description: Autentica o usuário com email e senha e retorna um token JWT via cookie.
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: "maria@example.com"
 *               senha:
 *                 type: string
 *                 example: "minhasenha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login bem-sucedido!"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nameUser:
 *                       type: string
 *                       example: "Maria Silva"
 *                     email:
 *                       type: string
 *                       example: "maria@example.com"
 *                     lastLogin:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-28T14:32:00.000Z"
 *       401:
 *         description: Senha incorreta
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Realiza logout do usuário
 *     description: Limpa o cookie de autenticação JWT do usuário e finaliza a sessão.
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout realizado com sucesso!"
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retorna o perfil do usuário autenticado
 *     description: Recupera as informações do usuário autenticado com base no token JWT.
 *     tags: [Usuários]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     idUsuario:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: "Maria Silva"
 *                     email:
 *                       type: string
 *                       example: "maria@example.com"
 *                     telefone:
 *                       type: string
 *                       example: "(11) 91234-5678"
 *                     endereco:
 *                       type: string
 *                       example: "Rua das Flores, 123 - São Paulo/SP"
 *                     perfilUsuario:
 *                       type: string
 *                       enum: [DOADOR, ORGANIZACAO]
 *                       example: "DOADOR"
 *                     nomeOrganizacao:
 *                       type: string
 *                       example: "ONG Esperança"
 *                     dataCadastro:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-01T14:00:00.000Z"
 *                     lastLogin:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-28T14:32:00.000Z"
 *                     status:
 *                       type: string
 *                       enum: [ATIVO, INATIVO]
 *                       example: "ATIVO"
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Atualiza os dados do usuário autenticado
 *     description: Permite que o usuário altere seus próprios dados, como nome, email, senha, telefone, endereço e organização.
 *     tags: [Usuários]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Maria da Silva"
 *               email:
 *                 type: string
 *                 example: "maria.silva@example.com"
 *               senha:
 *                 type: string
 *                 example: "novaSenhaSegura123"
 *               telefone:
 *                 type: string
 *                 example: "(11) 98888-7777"
 *               endereco:
 *                 type: string
 *                 example: "Av. Brasil, 1000 - São Paulo/SP"
 *               nomeOrganizacao:
 *                 type: string
 *                 example: "ONG Renovar"
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário atualizado com sucesso!"
 *                 usuarioSemSenha:
 *                   type: object
 *                   properties:
 *                     idUsuario:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: "Maria da Silva"
 *                     email:
 *                       type: string
 *                       example: "maria.silva@example.com"
 *                     telefone:
 *                       type: string
 *                       example: "(11) 98888-7777"
 *                     endereco:
 *                       type: string
 *                       example: "Av. Brasil, 1000 - São Paulo/SP"
 *                     nomeOrganizacao:
 *                       type: string
 *                       example: "ONG Renovar"
 *                     perfilUsuario:
 *                       type: string
 *                       example: "DOADOR"
 *                     dataCadastro:
 *                       type: string
 *                       format: date-time
 *                     lastLogin:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *                       enum: [ATIVO, INATIVO]
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro ao atualizar usuário
 */

/**
 * @swagger
 * /user/delete:
 *   put:
 *     summary: Deleta (desativa) o usuário autenticado
 *     description: Realiza a exclusão lógica do usuário autenticado, alterando seu status para INATIVO.
 *     tags: [Usuários]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário deletado com sucesso!"
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro ao deletar usuário
 */