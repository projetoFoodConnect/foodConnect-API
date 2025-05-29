import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { validarEAtualizarQuantidade } from "../services/productService";
import { registerProductAudit } from "./auditController";

const prisma = new PrismaClient();

export const registerDonation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const idReceptor = (req.user as JwtPayload)?.userId;
  const { idProduto, quantidade, dataPlanejada } = req.body;

  if (!idProduto || !quantidade || !dataPlanejada) {
    res.status(400).json({ message: "Campos obrigatórios: idProduto, quantidade, dataPlanejada." });
    return;
  }

  try {
    const produto = await prisma.produtos.findUnique({
      where: { idProduto },
    });

    if (!produto) {
      res.status(404).json({ message: "Produto não encontrado." });
      return;
    }

    if (produto.status !== "DISPONIVEL") {
      res.status(400).json({ message: "Produto não está disponível para doação." });
      return;
    }

    const quantidadeRequisitada = parseFloat(quantidade);

    const resultadoAtualizacao = await validarEAtualizarQuantidade(idProduto, -quantidadeRequisitada);

    if (!resultadoAtualizacao.sucesso) {
      res.status(400).json({ message: resultadoAtualizacao.mensagem });
      return;
    }

    const novaDoacao = await prisma.doacoes.create({
      data: {
        idProduto,
        idDoador: produto.idDoador,
        idReceptor,
        quantidade: quantidadeRequisitada,
        dataPlanejada: new Date(dataPlanejada),
        dataReserva: new Date(),
        status: "PLANEJADA",
      },
    });

    await registerProductAudit(
      idProduto,
      produto.idDoador,
      produto,
      resultadoAtualizacao.produto
    );

    res.status(201).json({
      message: "Doação registrada com sucesso!",
      doacao: novaDoacao,
    });
  } catch (error) {
    console.error("Erro ao registrar doação:", error);
    res.status(500).json({ message: "Erro ao registrar doação", error });
  }
};

export const getDonationById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const idDoacao = parseInt(req.params.id);

  if (isNaN(idDoacao)) {
    res.status(400).json({ message: "ID da doação inválido." });
    return;
  }

  try {
    const doacao = await prisma.doacoes.findUnique({
      where: { idDoacao },
      include: {
        produto: {
          select: {
            descricao: true,
            tipo: true,
            unidade: true,
          }
        },
        receptor: {
          select: {
            nome: true,
            email: true,
          }
        },
        doador: {
          select: {
            nome: true,
            email: true,
            nomeOrganizacao: true,
          }
        }
      }
    });

    if (!doacao) {
      res.status(404).json({ message: "Doação não encontrada." });
      return;
    }

    res.status(200).json({ doacao });
  } catch (error) {
    console.error("Erro ao buscar doação:", error);
    res.status(500).json({ message: "Erro interno ao buscar doação", error });
  }
};

export const getDonationsByUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const idUsuario = (req.user as JwtPayload)?.userId;

  if (!idUsuario) {
    res.status(401).json({ message: "Usuário não autenticado." });
    return;
  }

  try {
    const doacoes = await prisma.doacoes.findMany({
      where: {
        OR: [
          { idDoador: idUsuario },
          { idReceptor: idUsuario }
        ]
      },
      orderBy: {
        dataReserva: "desc"
      },
      include: {
        produto: {
          select: {
            descricao: true,
            tipo: true,
            unidade: true,
          }
        },
        receptor: {
          select: {
            nome: true,
            email: true,
          }
        },
        doador: {
          select: {
            nome: true,
            email: true,
            nomeOrganizacao: true,
          }
        }
      }
    });

    res.status(200).json({ doacoes });
  } catch (error) {
    console.error("Erro ao buscar doações:", error);
    res.status(500).json({ message: "Erro interno ao buscar doações", error });
  }
};

export const getAllDonations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const doacoes = await prisma.doacoes.findMany({
      orderBy: {
        dataReserva: "desc"
      },
      include: {
        produto: {
          select: {
            descricao: true,
            tipo: true,
            unidade: true,
          }
        },
        receptor: {
          select: {
            nome: true,
            email: true,
          }
        },
        doador: {
          select: {
            nome: true,
            email: true,
            nomeOrganizacao: true,
          }
        }
      }
    });

    res.status(200).json({ doacoes });
  } catch (error) {
    console.error("Erro ao buscar todas as doações:", error);
    res.status(500).json({ message: "Erro interno ao buscar doações", error });
  }
};

export const updateDonation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const idDoacao = parseInt(req.params.id);
  const idUsuario = (req.user as JwtPayload)?.userId;
  const { quantidade, dataPlanejada, status } = req.body || {};

  if (isNaN(idDoacao)) {
    res.status(400).json({ message: "ID da doação inválido." });
    return;
  }

  try {
    const doacao = await prisma.doacoes.findUnique({
      where: { idDoacao },
    });

    if (!doacao) {
      res.status(404).json({ message: "Doação não encontrada." });
      return;
    }

    if (doacao.idReceptor !== idUsuario && doacao.idDoador !== idUsuario) {
      res.status(403).json({ message: "Você não tem permissão para editar esta doação." });
      return;
    }

    const produto = await prisma.produtos.findUnique({
      where: { idProduto: doacao.idProduto },
    });

    if (!produto) {
      res.status(404).json({ message: "Produto relacionado não encontrado." });
      return;
    }

    const atualizacaoData: any = {};

    if (quantidade !== undefined) {
      const quantidadeAtualDoacao = doacao.quantidade; 
      const novaQuantidadeDesejada = parseFloat(quantidade);

      let diferenca = 0;
      let novoValorParaProduto = 0;

      if (novaQuantidadeDesejada > quantidadeAtualDoacao) {
        diferenca = novaQuantidadeDesejada - quantidadeAtualDoacao;
        novoValorParaProduto = -diferenca;
      } else if (novaQuantidadeDesejada < quantidadeAtualDoacao) {
        diferenca = quantidadeAtualDoacao - novaQuantidadeDesejada;
        novoValorParaProduto = diferenca;
      }

      if (diferenca !== 0) {
        const resultadoAtualizacao = await validarEAtualizarQuantidade(
          produto.idProduto,
          novoValorParaProduto
        );

        if (!resultadoAtualizacao.sucesso) {
          res.status(400).json({ message: resultadoAtualizacao.mensagem });
          return;
        }

        const produtoAtualizado = resultadoAtualizacao.produto;

        await registerProductAudit(
          produto.idProduto,
          produto.idDoador,
          produto,
          produtoAtualizado
        );
      }

      atualizacaoData.quantidade = novaQuantidadeDesejada;
    }

    if (dataPlanejada !== undefined) {
      const novaData = new Date(dataPlanejada);

      if (isNaN(novaData.getTime())) {
        res.status(400).json({ message: "Data planejada inválida." });
        return;
      }

      atualizacaoData.dataPlanejada = novaData;
    }

    if (status !== undefined) {
      if (!["PLANEJADA", "PENDENTE", "RECEBIDA", "CANCELADA"].includes(status)) {
        res.status(400).json({ message: "Status inválido." });
        return;
      }

      atualizacaoData.status = status;
    }

    const doacaoAtualizada = await prisma.doacoes.update({
      where: { idDoacao },
      data: atualizacaoData,
    });


    res.status(200).json({
      message: "Doação atualizada com sucesso!",
      doacaoAtualizada,
    });
  } catch (error) {
    console.error("Erro ao atualizar doação:", error);
    res.status(500).json({ message: "Erro ao atualizar doação", error });
  }
};

export const deleteDonation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const idDoacao = parseInt(req.params.id);
  const idUsuario = (req.user as JwtPayload)?.userId;

  if (isNaN(idDoacao)) {
    res.status(400).json({ message: "ID da doação inválido." });
    return;
  }

  try {
    const doacao = await prisma.doacoes.findUnique({
      where: { idDoacao },
    });

    if (!doacao) {
      res.status(404).json({ message: "Doação não encontrada." });
      return;
    }

    if (doacao.idReceptor !== idUsuario && doacao.idDoador !== idUsuario) {
      res.status(403).json({ message: "Você não tem permissão para deletar esta doação." });
      return;
    }

    const doacaoCancelada = await prisma.doacoes.update({
      where: { idDoacao },
      data: {
        status: "CANCELADA",
      },
    });

    res.status(200).json({ message: "Doação deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar doação:", error);
    res.status(500).json({ message: "Erro ao deletar doação", error });
  }
};