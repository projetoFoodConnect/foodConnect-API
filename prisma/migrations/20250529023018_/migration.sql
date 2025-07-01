/*
  Warnings:

  - Changed the type of `perfilUsuario` on the `Usuarios` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('DOADOR', 'RECEPTOR', 'ADMINISTRADOR');

-- AlterTable
ALTER TABLE "Usuarios" DROP COLUMN "perfilUsuario",
ADD COLUMN     "perfilUsuario" "PerfilUsuario" NOT NULL;
