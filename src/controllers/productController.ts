import { Request, Response } from "express";
import { PrismaClient, StatusProduto } from "@prisma/client";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { deletarImagemCloudinary } from "../utils/cloudinaryUtils";
import { JwtPayload } from "jsonwebtoken";
import { registerProductAudit } from "./auditController";
import { validarEAtualizarQuantidade } from "../services/productService";

const prisma = new PrismaClient();

const IMAGEM_PADRAO = "https://res.cloudinary.com/foodconnect/image/upload/v1745265109/imagemCestaSupermercado_wzzoly.webp";

export const registerProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const idDoador = (req.user as JwtPayload)?.userId;
  const { descricao, quantidade, unidade, tipo } = req.body;

  try {
    const imagemFinal = req.file?.path || IMAGEM_PADRAO;

    const produto = await prisma.produtos.create({
      data: {
        imagem: imagemFinal,
        descricao,
        quantidade: parseFloat(quantidade),
        unidade,
        tipo,
        idDoador,
        status: "DISPONIVEL",
        dataPostagem: new Date(),
      },
    });

    res.status(201).json({ message: "Produto cadastrado com sucesso!", produto });
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    res.status(500).json({ message: "Erro ao cadastrar produto", error });
  }
};

export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const idProduto = parseInt(req.params.id);

  if (isNaN(idProduto)) {
    res.status(400).json({ message: "ID inválido." });
    return;
  }

  try {
    const produto = await prisma.produtos.findUnique({
      where: { idProduto },
      include: {
        doador: {
          select: {
            idUsuario: true,
            nome: true,
            email: true,
            nomeOrganizacao: true,
          }
        }
      }
    });

    if (!produto) {
      res.status(404).json({ message: "Produto não encontrado." });
      return;
    }

    res.status(200).json({ produto });
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).json({ message: "Erro ao buscar produto", error });
  }
};

export const getProductByUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const idDoador = (req.user as JwtPayload)?.userId;

  try {
    const produtos = await prisma.produtos.findMany({
      where: { idDoador },
      orderBy: { dataPostagem: "desc" },
    });

    res.status(200).json({ produtos });
  } catch (error) {
    console.error("Erro ao buscar produtos do usuário:", error);
    res.status(500).json({ message: "Erro ao buscar produtos", error });
  }
};

export const getProductByStatus = async (
  req: Request,
  res: Response
  ): Promise<void> => {
  const status = req.params.status?.toUpperCase(); // garante que está em caixa alta

  const statusPermitidos = ["DISPONIVEL", "INDISPONIVEL", "DOADO"];

  if (!statusPermitidos.includes(status)) {
    res.status(400).json({ message: "Status inválido. Use DISPONIVEL, INDISPONIVEL ou DOADO." });
    return;
  }

  try {
    const produtos = await prisma.produtos.findMany({
      where: { status: status as StatusProduto },
      orderBy: { dataPostagem: "desc" },
      include: {
        doador: {
          select: {
            idUsuario: true,
            nome: true,
            nomeOrganizacao: true,
          }
        }
      }
    });

    res.status(200).json({ produtos });
  } catch (error) {
    console.error("Erro ao buscar produtos por status:", error);
    res.status(500).json({ message: "Erro ao buscar produtos", error });
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const produtos = await prisma.produtos.findMany({
      orderBy: { dataPostagem: "desc" },
      include: {
        doador: {
          select: {
            idUsuario: true,
            nome: true,
            nomeOrganizacao: true,
          }
        }
      }
    });

    res.status(200).json({ produtos });
  } catch (error) {
    console.error("Erro ao listar todos os produtos:", error);
    res.status(500).json({ message: "Erro ao listar produtos", error });
  }
};

export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const idProduto = parseInt(req.params.id);

  if (isNaN(idProduto)) {
    res.status(400).json({ message: "ID do produto inválido." });
    return;
  }

  try {
    const produto = await prisma.produtos.findUnique({ where: { idProduto } });

    if (!produto) {
      res.status(404).json({ message: "Produto não encontrado" });
      return;
    }

    if (req.file?.path && produto.imagem) {
      await deletarImagemCloudinary(produto.imagem);
    }

    let produtoAtualizado = produto;

    if (req.body.quantidade !== undefined) {
      const resultadoQuantidade = await validarEAtualizarQuantidade(idProduto, req.body.quantidade);

      if (!resultadoQuantidade.sucesso) {
        res.status(400).json({ message: resultadoQuantidade.mensagem });
        return;
      }

      produtoAtualizado = resultadoQuantidade.produto;
    }

    const outrosCamposAtualizados = await prisma.produtos.update({
      where: { idProduto },
      data: {
        imagem: req.file?.path || produtoAtualizado.imagem,
        descricao: req.body.descricao || produtoAtualizado.descricao,
        unidade: req.body.unidade || produtoAtualizado.unidade,
        tipo: req.body.tipo || produtoAtualizado.tipo,
        status: req.body.status || produtoAtualizado.status,
      },
    });

    await registerProductAudit(
      idProduto,
      produto.idDoador,
      produto,
      outrosCamposAtualizados
    );

    res.status(200).json({
      message: "Produto atualizado com sucesso!",
      produtoAtualizado: outrosCamposAtualizados,
    });
  } catch (error) {
    console.error("Erro ao editar produto:", error);
    res.status(500).json({ message: "Erro ao editar produto", error });
  }
};

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const idProduto = parseInt(req.params.id);
  const idDoador = (req.user as JwtPayload)?.userId;

  if (isNaN(idProduto)) {
    res.status(400).json({ message: "ID do produto inválido." });
    return;
  }

  try {
    const produto = await prisma.produtos.findUnique({
      where: { idProduto },
    });

    if (!produto || produto.idDoador !== idDoador) {
      res.status(403).json({ message: "Você não tem permissão para deletar este produto." });
      return;
    }

    await prisma.produtos.update({
      where: { idProduto },
      data: { status: "INDISPONIVEL" },
    });

    await registerProductAudit(idProduto, idDoador, produto, { status: "INDISPONIVEL" });

    res.status(200).json({ message: "Produto deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ message: "Erro ao deletar produto", error });
  }
}