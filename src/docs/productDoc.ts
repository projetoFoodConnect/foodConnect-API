/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Rotas relacionadas a produtos
 */

/**
 * @swagger
 * /produto/cadastrar:
 *   post:
 *     summary: Cadastra um novo produto para doação
 *     description: Permite que um usuário autenticado cadastre um produto para doação. A imagem é opcional e deve ser enviada como arquivo multipart/form-data.
 *     tags: [Produtos]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *               - quantidade
 *               - unidade
 *               - tipo
 *             properties:
 *               descricao:
 *                 type: string
 *                 example: "Pacote de arroz 5kg"
 *               quantidade:
 *                 type: number
 *                 example: 2
 *               unidade:
 *                 type: string
 *                 example: "unidade"
 *               tipo:
 *                 type: string
 *                 example: "Alimento"
 *               imagem:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem do produto (opcional)
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produto cadastrado com sucesso!"
 *                 produto:
 *                   type: object
 *                   properties:
 *                     idProduto:
 *                       type: integer
 *                       example: 1
 *                     imagem:
 *                       type: string
 *                       example: "https://res.cloudinary.com/.../imagem.jpg"
 *                     descricao:
 *                       type: string
 *                       example: "Pacote de arroz 5kg"
 *                     quantidade:
 *                       type: number
 *                       example: 2
 *                     unidade:
 *                       type: string
 *                       example: "unidade"
 *                     tipo:
 *                       type: string
 *                       example: "Alimento"
 *                     idDoador:
 *                       type: integer
 *                       example: 5
 *                     status:
 *                       type: string
 *                       enum: [DISPONIVEL, INDISPONIVEL, DOADO]
 *                       example: "DISPONIVEL"
 *                     dataPostagem:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-28T14:32:00.000Z"
 *       500:
 *         description: Erro ao cadastrar produto
 */

/**
 * @swagger
 * /produto/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     description: Retorna os dados de um produto específico, incluindo informações do doador.
 *     tags: [Produtos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produto:
 *                   type: object
 *                   properties:
 *                     idProduto:
 *                       type: integer
 *                     descricao:
 *                       type: string
 *                     quantidade:
 *                       type: number
 *                     unidade:
 *                       type: string
 *                     tipo:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [DISPONIVEL, INDISPONIVEL, DOADO]
 *                     dataPostagem:
 *                       type: string
 *                       format: date-time
 *                     doador:
 *                       type: object
 *                       properties:
 *                         idUsuario:
 *                           type: integer
 *                         nome:
 *                           type: string
 *                         email:
 *                           type: string
 *                         nomeOrganizacao:
 *                           type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /produto/user:
 *   get:
 *     summary: Lista todos os produtos cadastrados pelo usuário autenticado
 *     description: Retorna os produtos associados ao usuário autenticado, ordenados por data de postagem.
 *     tags: [Produtos]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Produtos encontrados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produtos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idProduto:
 *                         type: integer
 *                       descricao:
 *                         type: string
 *                       quantidade:
 *                         type: number
 *                       unidade:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [DISPONIVEL, INDISPONIVEL, DOADO]
 *                       dataPostagem:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Erro ao buscar produtos
 */

/**
 * @swagger
 * /produto/{status}:
 *   get:
 *     summary: Lista produtos por status
 *     description: Retorna os produtos com o status especificado (DISPONIVEL, INDISPONIVEL ou DOADO).
 *     tags: [Produtos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [DISPONIVEL, INDISPONIVEL, DOADO]
 *         description: Status do produto
 *     responses:
 *       200:
 *         description: Produtos encontrados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produtos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idProduto:
 *                         type: integer
 *                       descricao:
 *                         type: string
 *                       quantidade:
 *                         type: number
 *                       unidade:
 *                         type: string
 *                       tipo:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [DISPONIVEL, INDISPONIVEL, DOADO]
 *                       dataPostagem:
 *                         type: string
 *                         format: date-time
 *                       doador:
 *                         type: object
 *                         properties:
 *                           idUsuario:
 *                             type: integer
 *                           nome:
 *                             type: string
 *                           nomeOrganizacao:
 *                             type: string
 *       400:
 *         description: Status inválido
 *       500:
 *         description: Erro ao buscar produtos
 */

/**
 * @swagger
 * /produto:
 *   get:
 *     summary: Lista todos os produtos cadastrados
 *     description: Retorna todos os produtos disponíveis no sistema, incluindo dados do doador.
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Produtos listados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 produtos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idProduto:
 *                         type: integer
 *                         example: 1
 *                       descricao:
 *                         type: string
 *                         example: "Caixa com produtos de higiene"
 *                       quantidade:
 *                         type: number
 *                         example: 5
 *                       unidade:
 *                         type: string
 *                         example: "caixa"
 *                       tipo:
 *                         type: string
 *                         example: "Higiene"
 *                       status:
 *                         type: string
 *                         enum: [DISPONIVEL, INDISPONIVEL, DOADO]
 *                         example: "DISPONIVEL"
 *                       dataPostagem:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-28T14:32:00.000Z"
 *                       doador:
 *                         type: object
 *                         properties:
 *                           idUsuario:
 *                             type: integer
 *                             example: 12
 *                           nome:
 *                             type: string
 *                             example: "Carlos Oliveira"
 *                           nomeOrganizacao:
 *                             type: string
 *                             example: "Projeto AjudaSP"
 *       500:
 *         description: Erro ao listar produtos
 */

/**
 * @swagger
 * /produto/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     description: Permite que um usuário autenticado atualize os dados de um produto, incluindo imagem, descrição, unidade, tipo, status e quantidade.
 *     tags: [Produtos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagem:
 *                 type: string
 *                 format: binary
 *               descricao:
 *                 type: string
 *                 example: "Caixa com itens de limpeza"
 *               unidade:
 *                 type: string
 *                 example: "caixa"
 *               tipo:
 *                 type: string
 *                 example: "Higiene"
 *               status:
 *                 type: string
 *                 enum: [DISPONIVEL, INDISPONIVEL, DOADO]
 *                 example: "INDISPONIVEL"
 *               quantidade:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /produto/delete/{id}:
 *   put:
 *     summary: Deleta (desativa) um produto
 *     description: Realiza a exclusão lógica do produto, marcando seu status como INDISPONIVEL. Apenas o doador do produto pode executar essa ação.
 *     tags: [Produtos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser deletado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produto deletado com sucesso!"
 *       400:
 *         description: ID do produto inválido
 *       403:
 *         description: Usuário não tem permissão para deletar este produto
 *       500:
 *         description: Erro ao deletar produto
 */
