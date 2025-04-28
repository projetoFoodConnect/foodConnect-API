import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auditRegister = async (
  idProduto: number,
  idUsuario: number,
  campoAlterado: string,
  valorAntigo: string | null,
  valorNovo: string | null
): Promise<void> => {
  try {
    await prisma.auditoriaProdutos.create({
      data: {
        idProduto,
        idUsuario,
        campoAlterado,
        valorAntigo,
        valorNovo,
        dataAlteracao: new Date(),
      },
    });
  } catch (error) {
    console.error("Erro ao registrar auditoria:", error);
  }
};

export const registerProductAudit = async (
  idProduto: number,
  idUsuario: number,
  dadosAntigos: any,
  dadosNovos: any
): Promise<void> => {
  const camposParaVerificar = ["descricao", "quantidade", "unidade", "tipo", "status", "imagem"];

  for (const campo of camposParaVerificar) {
    const antigo = dadosAntigos[campo];
    const novo = dadosNovos[campo];

    if (novo !== undefined && String(antigo) !== String(novo)) {
      await auditRegister(idProduto, idUsuario, campo, String(antigo), String(novo));
    }
  }
};
