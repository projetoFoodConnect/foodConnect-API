import { Response } from "express";
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
