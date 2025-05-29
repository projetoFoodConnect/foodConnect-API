/**
 * @swagger
 * tags:
 *   name: Doações
 *   description: Rotas relacionadas a doações
 */

/**
 * @swagger
 * /doacao:
 *   post:
 *     summary: Registra uma nova doação
 *     description: Permite que um usuário autenticado (receptor) solicite uma doação de um produto disponível.
 *     tags: [Doações]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idProduto
 *               - quantidade
 *               - dataPlanejada
 *             properties:
 *               idProduto:
 *                 type: integer
 *                 example: 3
 *               quantidade:
 *                 type: number
 *                 example: 2
 *               dataPlanejada:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-10"
 *     responses:
 *       201:
 *         description: Doação registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doação registrada com sucesso!"
 *                 doacao:
 *                   type: object
 *                   properties:
 *                     idDoacao:
 *                       type: integer
 *                       example: 1
 *                     idProduto:
 *                       type: integer
 *                       example: 3
 *                     idDoador:
 *                       type: integer
 *                       example: 5
 *                     idReceptor:
 *                       type: integer
 *                       example: 12
 *                     quantidade:
 *                       type: number
 *                       example: 2
 *                     dataReserva:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-28T14:30:00.000Z"
 *                     dataPlanejada:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-10T00:00:00.000Z"
 *                     status:
 *                       type: string
 *                       enum: [PLANEJADA, PENDENTE, RECEBIDA, CANCELADA]
 *                       example: "PLANEJADA"
 *       400:
 *         description: Campos obrigatórios ausentes ou produto indisponível
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro ao registrar doação
 */

/**
 * @swagger
 * /doacao/{id}:
 *   get:
 *     summary: Busca uma doação pelo ID
 *     description: Retorna os dados de uma doação específica, incluindo produto, doador e receptor.
 *     tags: [Doações]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da doação
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doação encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doacao:
 *                   type: object
 *                   properties:
 *                     idDoacao:
 *                       type: integer
 *                       example: 7
 *                     quantidade:
 *                       type: number
 *                       example: 2
 *                     dataReserva:
 *                       type: string
 *                       format: date-time
 *                     dataPlanejada:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *                       enum: [PLANEJADA, PENDENTE, RECEBIDA, CANCELADA]
 *                     produto:
 *                       type: object
 *                       properties:
 *                         descricao:
 *                           type: string
 *                         tipo:
 *                           type: string
 *                         unidade:
 *                           type: string
 *                     receptor:
 *                       type: object
 *                       properties:
 *                         nome:
 *                           type: string
 *                         email:
 *                           type: string
 *                     doador:
 *                       type: object
 *                       properties:
 *                         nome:
 *                           type: string
 *                         email:
 *                           type: string
 *                         nomeOrganizacao:
 *                           type: string
 *       400:
 *         description: ID da doação inválido
 *       404:
 *         description: Doação não encontrada
 *       500:
 *         description: Erro ao buscar doação
 */

/**
 * @swagger
 * /doacoes/user:
 *   get:
 *     summary: Lista todas as doações do usuário autenticado
 *     description: Retorna todas as doações em que o usuário autenticado participou como doador ou receptor.
 *     tags: [Doações]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de doações do usuário retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doacoes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idDoacao:
 *                         type: integer
 *                       status:
 *                         type: string
 *                         enum: [PLANEJADA, PENDENTE, RECEBIDA, CANCELADA]
 *                       quantidade:
 *                         type: number
 *                       dataReserva:
 *                         type: string
 *                         format: date-time
 *                       dataPlanejada:
 *                         type: string
 *                         format: date-time
 *                       produto:
 *                         type: object
 *                         properties:
 *                           descricao:
 *                             type: string
 *                           tipo:
 *                             type: string
 *                           unidade:
 *                             type: string
 *                       receptor:
 *                         type: object
 *                         properties:
 *                           nome:
 *                             type: string
 *                           email:
 *                             type: string
 *                       doador:
 *                         type: object
 *                         properties:
 *                           nome:
 *                             type: string
 *                           email:
 *                             type: string
 *                           nomeOrganizacao:
 *                             type: string
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro ao buscar doações
 */

/**
 * @swagger
 * /doacoes:
 *   get:
 *     summary: Lista todas as doações do sistema
 *     description: Retorna todas as doações registradas, incluindo informações de produto, doador e receptor.
 *     tags: [Doações]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas as doações retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doacoes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       idDoacao:
 *                         type: integer
 *                       status:
 *                         type: string
 *                         enum: [PLANEJADA, PENDENTE, RECEBIDA, CANCELADA]
 *                       quantidade:
 *                         type: number
 *                       dataReserva:
 *                         type: string
 *                         format: date-time
 *                       dataPlanejada:
 *                         type: string
 *                         format: date-time
 *                       produto:
 *                         type: object
 *                         properties:
 *                           descricao:
 *                             type: string
 *                           tipo:
 *                             type: string
 *                           unidade:
 *                             type: string
 *                       receptor:
 *                         type: object
 *                         properties:
 *                           nome:
 *                             type: string
 *                           email:
 *                             type: string
 *                       doador:
 *                         type: object
 *                         properties:
 *                           nome:
 *                             type: string
 *                           email:
 *                             type: string
 *                           nomeOrganizacao:
 *                             type: string
 *       500:
 *         description: Erro ao buscar todas as doações
 */

/**
 * @swagger
 * /doacao/{id}:
 *   put:
 *     summary: Atualiza uma doação existente
 *     description: Permite que o doador ou o receptor atualize dados da doação, como quantidade, data planejada e status.
 *     tags: [Doações]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da doação
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantidade:
 *                 type: number
 *                 example: 3
 *               dataPlanejada:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-15"
 *               status:
 *                 type: string
 *                 enum: [PLANEJADA, PENDENTE, RECEBIDA, CANCELADA]
 *                 example: "PENDENTE"
 *     responses:
 *       200:
 *         description: Doação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doação atualizada com sucesso!"
 *                 doacaoAtualizada:
 *                   type: object
 *                   properties:
 *                     idDoacao:
 *                       type: integer
 *                     quantidade:
 *                       type: number
 *                     dataPlanejada:
 *                       type: string
 *                       format: date-time
 *                     status:
 *                       type: string
 *                       enum: [PLANEJADA, PENDENTE, RECEBIDA, CANCELADA]
 *       400:
 *         description: Requisição inválida (dados ou status incorretos)
 *       403:
 *         description: Usuário sem permissão para editar a doação
 *       404:
 *         description: Doação ou produto relacionado não encontrado
 *       500:
 *         description: Erro interno ao atualizar a doação
 */

/**
 * @swagger
 * /doacao/{id}/cancelar:
 *   put:
 *     summary: Cancela (deleta logicamente) uma doação
 *     description: Altera o status da doação para CANCELADA. Apenas o doador ou receptor pode realizar esta operação.
 *     tags: [Doações]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da doação a ser cancelada
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doação deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doação deletada com sucesso!"
 *       400:
 *         description: ID da doação inválido
 *       403:
 *         description: Usuário sem permissão para cancelar a doação
 *       404:
 *         description: Doação não encontrada
 *       500:
 *         description: Erro interno ao deletar a doação
 */
