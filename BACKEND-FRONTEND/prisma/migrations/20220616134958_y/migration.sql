/*
  Warnings:

  - You are about to drop the column `utente_id_fk` on the `targa` table. All the data in the column will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `utenti` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verificationtokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_utente_id_fkey";

-- DropForeignKey
ALTER TABLE "parcheggi" DROP CONSTRAINT "parcheggi_utenteUtente_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "targa" DROP CONSTRAINT "targa_utente_id_fk_fkey";

-- DropForeignKey
ALTER TABLE "veicolo" DROP CONSTRAINT "veicolo_utente_id_fk_fkey";

-- DropIndex
DROP INDEX "targa_utente_id_fk_key";

-- AlterTable
ALTER TABLE "parcheggi" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "targa" DROP COLUMN "utente_id_fk",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "veicolo" ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "sessions";

-- DropTable
DROP TABLE "utenti";

-- DropTable
DROP TABLE "verificationtokens";

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerType" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "accessTokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "utenteUtente_id" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utente" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account.providerId_providerAccountId_unique" ON "Account"("providerId", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session.sessionToken_unique" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Session.accessToken_unique" ON "Session"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "Utente.email_unique" ON "Utente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest.token_unique" ON "VerificationRequest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest.identifier_token_unique" ON "VerificationRequest"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD FOREIGN KEY ("userId") REFERENCES "Utente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "Utente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veicolo" ADD FOREIGN KEY ("userId") REFERENCES "Utente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "targa" ADD FOREIGN KEY ("userId") REFERENCES "Utente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcheggi" ADD FOREIGN KEY ("userId") REFERENCES "Utente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "parcheggi_targa_id_fk_key" RENAME TO "parcheggi.targa_id_fk_unique";

-- RenameIndex
ALTER INDEX "parcheggi_veicolo_id_fk_key" RENAME TO "parcheggi.veicolo_id_fk_unique";

-- RenameIndex
ALTER INDEX "targa_email_key" RENAME TO "targa.email_unique";

-- RenameIndex
ALTER INDEX "targa_rfid_id_fk_key" RENAME TO "targa.rfid_id_fk_unique";

-- RenameIndex
ALTER INDEX "veicolo_utente_id_fk_key" RENAME TO "veicolo.utente_id_fk_unique";
