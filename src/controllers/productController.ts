import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

const IMAGEM_PADRAO = "https://res.cloudinary.com/foodconnect/image/upload/v1745265109/imagemCestaSupermercado_wzzoly.webp";

export const cadastrarProduto = async (
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

  export const listarProdutosPorUsuario = async (
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