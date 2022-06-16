/*
  Warnings:

  - You are about to drop the column `userId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `utenteUser_id` on the `parcheggi` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `targa` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `targa` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `targa` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `targa` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `utente_id_fk` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sigla` to the `targa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "parcheggi" DROP CONSTRAINT "parcheggi_utenteUser_id_fkey";

-- DropForeignKey
ALTER TABLE "targa" DROP CONSTRAINT "targa_utente_id_fk_fkey";

-- DropForeignKey
ALTER TABLE "veicolo" DROP CONSTRAINT "veicolo_utente_id_fk_fkey";

-- DropIndex
DROP INDEX "targa.email_unique";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "userId",
ADD COLUMN     "utente_id_fk" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "parcheggi" DROP COLUMN "utenteUser_id",
ADD COLUMN     "utente_id_fk" TEXT;

-- AlterTable
ALTER TABLE "targa" DROP COLUMN "email",
DROP COLUMN "email_verified",
DROP COLUMN "image",
DROP COLUMN "name",
ADD COLUMN     "sigla" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Utente" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Utente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utente_email_key" ON "Utente"("email");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_utente_id_fk_fkey" FOREIGN KEY ("utente_id_fk") REFERENCES "Utente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Utente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veicolo" ADD CONSTRAINT "veicolo_utente_id_fk_fkey" FOREIGN KEY ("utente_id_fk") REFERENCES "Utente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "targa" ADD CONSTRAINT "targa_utente_id_fk_fkey" FOREIGN KEY ("utente_id_fk") REFERENCES "Utente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcheggi" ADD CONSTRAINT "parcheggi_utente_id_fk_fkey" FOREIGN KEY ("utente_id_fk") REFERENCES "Utente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Account.providerId_providerAccountId_unique" RENAME TO "Account_providerId_providerAccountId_key";

-- RenameIndex
ALTER INDEX "Session.accessToken_unique" RENAME TO "Session_accessToken_key";

-- RenameIndex
ALTER INDEX "Session.sessionToken_unique" RENAME TO "Session_sessionToken_key";

-- RenameIndex
ALTER INDEX "VerificationRequest.identifier_token_unique" RENAME TO "VerificationRequest_identifier_token_key";

-- RenameIndex
ALTER INDEX "VerificationRequest.token_unique" RENAME TO "VerificationRequest_token_key";

-- RenameIndex
ALTER INDEX "parcheggi.targa_id_fk_unique" RENAME TO "parcheggi_targa_id_fk_key";

-- RenameIndex
ALTER INDEX "parcheggi.veicolo_id_fk_unique" RENAME TO "parcheggi_veicolo_id_fk_key";

-- RenameIndex
ALTER INDEX "targa.rfid_id_fk_unique" RENAME TO "targa_rfid_id_fk_key";

-- RenameIndex
ALTER INDEX "targa.utente_id_fk_unique" RENAME TO "targa_utente_id_fk_key";

-- RenameIndex
ALTER INDEX "veicolo.utente_id_fk_unique" RENAME TO "veicolo_utente_id_fk_key";
