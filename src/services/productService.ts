import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const validarEAtualizarQuantidade = async (
  idProduto: number,
  valorRecebido: number | string
): Promise<{ sucesso: boolean; mensagem: string; produto?: any }> => {
  try {
    const produto = await prisma.produtos.findUnique({ where: { idProduto } });

    if (!produto) {
      return { sucesso: false, mensagem: "Produto não encontrado." };
    }

    const valorNumerico = typeof valorRecebido === "string"
      ? parseFloat(valorRecebido)
      : valorRecebido;

    if (isNaN(valorNumerico)) {
      return { sucesso: false, mensagem: "Valor inválido informado." };
    }

    const quantidadeAtual = produto.quantidade;
    console.log("Quantidade atual:", quantidadeAtual);
    console.log("Valor recebido:", valorNumerico);

    if (valorNumerico < 0) {
      const subtracaoAbsoluta = Math.abs(valorNumerico);
      console.log("Subtração absoluta:", subtracaoAbsoluta);

      if (subtracaoAbsoluta > quantidadeAtual) {
        return {
          sucesso: false,
          mensagem: `A quantidade a subtrair (${subtracaoAbsoluta}) excede a quantidade disponível (${quantidadeAtual}).`
        };
      }

      const novaQuantidade = quantidadeAtual - subtracaoAbsoluta;
      console.log("Nova quantidade após subtração:", novaQuantidade);

      const novoStatus = novaQuantidade <= 0 ? "DOADO" : produto.status;
      console.log("Novo status do produto:", novoStatus);

      const produtoAtualizado = await prisma.produtos.update({
        where: { idProduto },
        data: {
          quantidade: novaQuantidade,
          status: novoStatus,
        },
      });

      console.log("Produto atualizado:", produtoAtualizado);

      return {
        sucesso: true,
        mensagem: "Produto atualizado com sucesso após subtração.",
        produto: produtoAtualizado,
      };
    }

    // Valor positivo → atualização direta
    const produtoAtualizado = await prisma.produtos.update({
      where: { idProduto },
      data: {
        quantidade: valorNumerico,
        status: produto.status,
      },
    });

    return {
      sucesso: true,
      mensagem: "Produto atualizado com nova quantidade.",
      produto: produtoAtualizado,
    };
  } catch (error) {
    console.error("Erro ao validar/atualizar produto:", error);
    return { sucesso: false, mensagem: "Erro interno ao atualizar o produto." };
  }
};