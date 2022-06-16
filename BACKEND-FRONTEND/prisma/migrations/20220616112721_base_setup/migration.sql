/*
  Warnings:

  - You are about to drop the column `descrizione` on the `rfids` table. All the data in the column will be lost.
  - You are about to drop the column `targa_id_fk` on the `utenti` table. All the data in the column will be lost.
  - You are about to drop the column `veicolo_id_fk` on the `utenti` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[utente_id_fk]` on the table `targa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[utente_id_fk]` on the table `veicolo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codice` to the `rfids` table without a default value. This is not possible if the table is not empty.
  - Added the required column `utente_id_fk` to the `targa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `utente_id_fk` to the `veicolo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "utenti" DROP CONSTRAINT "utenti_targa_id_fk_fkey";

-- DropForeignKey
ALTER TABLE "utenti" DROP CONSTRAINT "utenti_veicolo_id_fk_fkey";

-- DropIndex
DROP INDEX "utenti_veicolo_id_fk_key";

-- AlterTable
ALTER TABLE "rfids" DROP COLUMN "descrizione",
ADD COLUMN     "codice" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "targa" ADD COLUMN     "utente_id_fk" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "utenti" DROP COLUMN "targa_id_fk",
DROP COLUMN "veicolo_id_fk";

-- AlterTable
ALTER TABLE "veicolo" ADD COLUMN     "utente_id_fk" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "targa_utente_id_fk_key" ON "targa"("utente_id_fk");

-- CreateIndex
CREATE UNIQUE INDEX "veicolo_utente_id_fk_key" ON "veicolo"("utente_id_fk");

-- AddForeignKey
ALTER TABLE "veicolo" ADD CONSTRAINT "veicolo_utente_id_fk_fkey" FOREIGN KEY ("utente_id_fk") REFERENCES "utenti"("utente_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "targa" ADD CONSTRAINT "targa_utente_id_fk_fkey" FOREIGN KEY ("utente_id_fk") REFERENCES "utenti"("utente_id") ON DELETE RESTRICT ON UPDATE CASCADE;
