-- CreateEnum
CREATE TYPE "StatusUsuario" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusProduto" AS ENUM ('DISPONIVEL', 'INDISPONIVEL', 'DOADO');

-- CreateTable
CREATE TABLE "Usuario" (
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

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "Produto" (
    "idProduto" SERIAL NOT NULL,
    "imagem" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(200) NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "unidade" VARCHAR(20) NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "status" "StatusProduto" NOT NULL DEFAULT 'DISPONIVEL',
    "idDoador" INTEGER NOT NULL,
    "dataPostagem" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("idProduto")
);

-- CreateTable
CREATE TABLE "Doacao" (
    "idDoacao" SERIAL NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "idProduto" INTEGER NOT NULL,
    "idDoador" INTEGER NOT NULL,
    "idReceptor" INTEGER NOT NULL,
    "dataReserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataPlanejada" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doacao_pkey" PRIMARY KEY ("idDoacao")
);

-- CreateTable
CREATE TABLE "AuditoriaProduto" (
    "idAuditoria" SERIAL NOT NULL,
    "idProduto" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "campoAlterado" VARCHAR(100) NOT NULL,
    "valorAntigo" TEXT,
    "valorNovo" TEXT,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditoriaProduto_pkey" PRIMARY KEY ("idAuditoria")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_telefone_key" ON "Usuario"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_imagem_key" ON "Produto"("imagem");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_idProduto_idDoador_key" ON "Produto"("idProduto", "idDoador");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_idDoador_fkey" FOREIGN KEY ("idDoador") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doacao" ADD CONSTRAINT "Doacao_idProduto_idDoador_fkey" FOREIGN KEY ("idProduto", "idDoador") REFERENCES "Produto"("idProduto", "idDoador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doacao" ADD CONSTRAINT "Doacao_idReceptor_fkey" FOREIGN KEY ("idReceptor") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaProduto" ADD CONSTRAINT "AuditoriaProduto_idProduto_fkey" FOREIGN KEY ("idProduto") REFERENCES "Produto"("idProduto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaProduto" ADD CONSTRAINT "AuditoriaProduto_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;
