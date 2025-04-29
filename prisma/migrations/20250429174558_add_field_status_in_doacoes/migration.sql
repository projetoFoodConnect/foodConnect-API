-- CreateEnum
CREATE TYPE "StatusDoacao" AS ENUM ('PLANEJADA', 'PENDENTE', 'RECEBIDA', 'CANCELADA');

-- AlterTable
ALTER TABLE "Doacoes" ADD COLUMN     "status" "StatusDoacao" NOT NULL DEFAULT 'PLANEJADA';
