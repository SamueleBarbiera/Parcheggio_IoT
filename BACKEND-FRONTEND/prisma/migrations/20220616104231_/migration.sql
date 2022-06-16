/*
  Warnings:

  - You are about to drop the column `accessToken` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `accessTokenExpires` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `providerType` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[provider,provider_account_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `utente_id` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropIndex
DROP INDEX "accounts_providerId_provider_account_id_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "accessToken",
DROP COLUMN "accessTokenExpires",
DROP COLUMN "createdAt",
DROP COLUMN "providerId",
DROP COLUMN "providerType",
DROP COLUMN "refreshToken",
DROP COLUMN "updatedAt",
DROP COLUMN "user_id",
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "utente_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "utenti" (
    "utente_id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targa_id_fk" TEXT NOT NULL,
    "veicolo_id_fk" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utenti_pkey" PRIMARY KEY ("utente_id")
);

-- CreateTable
CREATE TABLE "veicolo" (
    "veicolo_id" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "veicolo_pkey" PRIMARY KEY ("veicolo_id")
);

-- CreateTable
CREATE TABLE "targa" (
    "targa_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3) NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "rfid_id_fk" TEXT NOT NULL,

    CONSTRAINT "targa_pkey" PRIMARY KEY ("targa_id")
);

-- CreateTable
CREATE TABLE "rfids" (
    "rfid_id" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rfids_pkey" PRIMARY KEY ("rfid_id")
);

-- CreateTable
CREATE TABLE "durata" (
    "durata_id" TEXT NOT NULL,
    "tempo_calcolato" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "parcheggi_id_fk" TEXT NOT NULL,

    CONSTRAINT "durata_pkey" PRIMARY KEY ("durata_id")
);

-- CreateTable
CREATE TABLE "parcheggi" (
    "parcheggi_id" TEXT NOT NULL,
    "num_parcheggio" INTEGER NOT NULL,
    "stato" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "targa_id_fk" TEXT NOT NULL,
    "veicolo_id_fk" TEXT NOT NULL,

    CONSTRAINT "parcheggi_pkey" PRIMARY KEY ("parcheggi_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utenti_email_key" ON "utenti"("email");

-- CreateIndex
CREATE UNIQUE INDEX "targa_email_key" ON "targa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "utenti"("utente_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_utente_id_fkey" FOREIGN KEY ("utente_id") REFERENCES "utenti"("utente_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utenti" ADD CONSTRAINT "utenti_veicolo_id_fk_fkey" FOREIGN KEY ("veicolo_id_fk") REFERENCES "veicolo"("veicolo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utenti" ADD CONSTRAINT "utenti_targa_id_fk_fkey" FOREIGN KEY ("targa_id_fk") REFERENCES "targa"("targa_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "targa" ADD CONSTRAINT "targa_rfid_id_fk_fkey" FOREIGN KEY ("rfid_id_fk") REFERENCES "rfids"("rfid_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "durata" ADD CONSTRAINT "durata_parcheggi_id_fk_fkey" FOREIGN KEY ("parcheggi_id_fk") REFERENCES "parcheggi"("parcheggi_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcheggi" ADD CONSTRAINT "parcheggi_veicolo_id_fk_fkey" FOREIGN KEY ("veicolo_id_fk") REFERENCES "veicolo"("veicolo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcheggi" ADD CONSTRAINT "parcheggi_targa_id_fk_fkey" FOREIGN KEY ("targa_id_fk") REFERENCES "targa"("targa_id") ON DELETE RESTRICT ON UPDATE CASCADE;
