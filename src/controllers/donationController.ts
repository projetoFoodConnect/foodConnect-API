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
}