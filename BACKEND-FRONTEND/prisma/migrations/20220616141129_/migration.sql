/*
  Warnings:

  - You are about to drop the column `userId` on the `parcheggi` table. All the data in the column will be lost.
  - You are about to drop the column `utenteUtente_id` on the `parcheggi` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `targa` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `veicolo` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Utente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationRequest` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[utente_id_fk]` on the table `targa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `utente_id_fk` to the `targa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "parcheggi" DROP CONSTRAINT "parcheggi_userId_fkey";

-- DropForeignKey
ALTER TABLE "targa" DROP CONSTRAINT "targa_userId_fkey";

-- DropForeignKey
ALTER TABLE "veicolo" DROP CONSTRAINT "veicolo_userId_fkey";

-- AlterTable
ALTER TABLE "parcheggi" DROP COLUMN "userId",
DROP COLUMN "utenteUtente_id",
ADD COLUMN     "utenteUser_id" TEXT;

-- AlterTable
ALTER TABLE "targa" DROP COLUMN "userId",
ADD COLUMN     "utente_id_fk" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "veicolo" DROP COLUMN "userId";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "Utente";

-- DropTable
DROP TABLE "VerificationRequest";

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "compound_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider_type" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "access_token_expires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "session_token" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "utente_id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("utente_id")
);

-- CreateTable
CREATE TABLE "verification_requests" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts.compound_id_unique" ON "accounts"("compound_id");

-- CreateIndex
CREATE INDEX "providerAccountId" ON "accounts"("provider_account_id");

-- CreateIndex
CREATE INDEX "providerId" ON "accounts"("provider_id");

-- CreateIndex
CREATE INDEX "userId" ON "accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions.session_token_unique" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "sessions.access_token_unique" ON "sessions"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_requests.token_unique" ON "verification_requests"("token");

-- CreateIndex
CREATE UNIQUE INDEX "targa.utente_id_fk_unique" ON "targa"("utente_id_fk");

-- AddForeignKey
ALTER TABLE "veicolo" ADD FOREIGN KEY ("utente_id_fk") REFERENCES "users"("utente_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "targa" ADD FOREIGN KEY ("utente_id_fk") REFERENCES "users"("utente_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcheggi" ADD FOREIGN KEY ("utenteUser_id") REFERENCES "users"("utente_id") ON DELETE SET NULL ON UPDATE CASCADE;
