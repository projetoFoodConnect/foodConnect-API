/*
  Warnings:

  - You are about to drop the `AuditoriaProduto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Doacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Produto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuditoriaProduto" DROP CONSTRAINT "AuditoriaProduto_idProduto_fkey";

-- DropForeignKey
ALTER TABLE "AuditoriaProduto" DROP CONSTRAINT "AuditoriaProduto_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "Doacao" DROP CONSTRAINT "Doacao_idProduto_idDoador_fkey";

-- DropForeignKey
ALTER TABLE "Doacao" DROP CONSTRAINT "Doacao_idReceptor_fkey";

-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_idDoador_fkey";

-- DropTable
DROP TABLE "AuditoriaProduto";

-- DropTable
DROP TABLE "Doacao";

-- DropTable
DROP TABLE "Produto";

-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "Usuarios" (
    "idUsuario" SERIAL NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "senha" VARCHAR(200) NOT NULL,
    "telefone" VARCHAR(20) NOT NULL,
    "endereco" VARCHAR(200) NOT NULL,
    "perfilUsuario" VARCHAR(20) NOT NULL,
    "nomeOrganizacao" VARCHAR(200),
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastEdit" TIMESTAMP(3),
    "status" "StatusUsuario" NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "Produtos" (
    "idProduto" SERIAL NOT NULL,
    "imagem" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(200) NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "unidade" VARCHAR(20) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "status" "StatusProduto" NOT NULL DEFAULT 'DISPONIVEL',
    "idDoador" INTEGER NOT NULL,
    "dataPostagem" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Produtos_pkey" PRIMARY KEY ("idProduto")
);

-- CreateTable
CREATE TABLE "Doacoes" (
    "idDoacao" SERIAL NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "idProduto" INTEGER NOT NULL,
    "idDoador" INTEGER NOT NULL,
    "idReceptor" INTEGER NOT NULL,
    "dataReserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataPlanejada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doacoes_pkey" PRIMARY KEY ("idDoacao")
);

-- CreateTable
CREATE TABLE "AuditoriaProdutos" (
    "idAuditoria" SERIAL NOT NULL,
    "idProduto" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "campoAlterado" VARCHAR(100) NOT NULL,
    "valorAntigo" TEXT,
    "valorNovo" TEXT,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditoriaProdutos_pkey" PRIMARY KEY ("idAuditoria")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_telefone_key" ON "Usuarios"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "Produtos_imagem_key" ON "Produtos"("imagem");

-- CreateIndex
CREATE UNIQUE INDEX "Produtos_idProduto_idDoador_key" ON "Produtos"("idProduto", "idDoador");

-- AddForeignKey
ALTER TABLE "Produtos" ADD CONSTRAINT "Produtos_idDoador_fkey" FOREIGN KEY ("idDoador") REFERENCES "Usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doacoes" ADD CONSTRAINT "Doacoes_idProduto_idDoador_fkey" FOREIGN KEY ("idProduto", "idDoador") REFERENCES "Produtos"("idProduto", "idDoador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doacoes" ADD CONSTRAINT "Doacoes_idReceptor_fkey" FOREIGN KEY ("idReceptor") REFERENCES "Usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaProdutos" ADD CONSTRAINT "AuditoriaProdutos_idProduto_fkey" FOREIGN KEY ("idProduto") REFERENCES "Produtos"("idProduto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaProdutos" ADD CONSTRAINT "AuditoriaProdutos_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;
