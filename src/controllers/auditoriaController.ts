import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { updateProduct } from "./productController";

const prisma = new PrismaClient();

export const criarDoacao = async (
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
  
      if (quantidadeRequisitada > produto.quantidade) {
        res.status(400).json({
          message: `A quantidade solicitada (${quantidadeRequisitada}) excede a quantidade disponível (${produto.quantidade}).`
        });
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
  
      res.status(201).json({
        message: "Doação registrada com sucesso!",
        doacao: novaDoacao,
      });
    } catch (error) {
      console.error("Erro ao registrar doação:", error);
      res.status(500).json({ message: "Erro ao registrar doação", error });
    }
  };  