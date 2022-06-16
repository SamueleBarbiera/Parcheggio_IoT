/*
  Warnings:

  - A unique constraint covering the columns `[targa_id_fk]` on the table `parcheggi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[veicolo_id_fk]` on the table `parcheggi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rfid_id_fk]` on the table `targa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[veicolo_id_fk]` on the table `utenti` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "parcheggi" ADD COLUMN     "utenteUtente_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "parcheggi_targa_id_fk_key" ON "parcheggi"("targa_id_fk");

-- CreateIndex
CREATE UNIQUE INDEX "parcheggi_veicolo_id_fk_key" ON "parcheggi"("veicolo_id_fk");

-- CreateIndex
CREATE UNIQUE INDEX "targa_rfid_id_fk_key" ON "targa"("rfid_id_fk");

-- CreateIndex
CREATE UNIQUE INDEX "utenti_veicolo_id_fk_key" ON "utenti"("veicolo_id_fk");

-- AddForeignKey
ALTER TABLE "parcheggi" ADD CONSTRAINT "parcheggi_utenteUtente_id_fkey" FOREIGN KEY ("utenteUtente_id") REFERENCES "utenti"("utente_id") ON DELETE SET NULL ON UPDATE CASCADE;
