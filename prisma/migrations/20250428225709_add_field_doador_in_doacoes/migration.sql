-- AddForeignKey
ALTER TABLE "Doacoes" ADD CONSTRAINT "Doacoes_idDoador_fkey" FOREIGN KEY ("idDoador") REFERENCES "Usuarios"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;
