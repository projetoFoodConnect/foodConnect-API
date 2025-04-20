/*
  Warnings:

  - You are about to drop the column `lastEdit` on the `Usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usuarios" DROP COLUMN "lastEdit",
ADD COLUMN     "lastLogin" TIMESTAMP(3);
