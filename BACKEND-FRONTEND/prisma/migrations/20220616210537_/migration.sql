/*
  Warnings:

  - You are about to drop the column `utente_id_fk` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `utente_id_fk` on the `parcheggi` table. All the data in the column will be lost.
  - You are about to drop the column `utente_id_fk` on the `targa` table. All the data in the column will be lost.
  - You are about to drop the column `utente_id_fk` on the `veicolo` table. All the data in the column will be lost.
  - You are about to drop the `Utente` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id_fk]` on the table `targa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id_fk]` on the table `veicolo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id_fk` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id_fk` to the `targa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id_fk` to the `veicolo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_utente_id_fk_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "parcheggi" DROP CONSTRAINT "parcheggi_utente_id_fk_fkey";

-- DropForeignKey
ALTER TABLE "targa" DROP CONSTRAINT "targa_utente_id_fk_fkey";

-- DropForeignKey
ALTER TABLE "veicolo" DROP CONSTRAINT "veicolo_utente_id_fk_fkey";

-- DropIndex
DROP INDEX "targa_utente_id_fk_key";

-- DropIndex
DROP INDEX "veicolo_utente_id_fk_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "utente_id_fk",
ADD COLUMN     "user_id_fk" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "parcheggi" DROP COLUMN "utente_id_fk",
ADD COLUMN     "user_id_fk" TEXT;

-- AlterTable
ALTER TABLE "targa" DROP COLUMN "utente_id_fk",
ADD COLUMN     "user_id_fk" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "veicolo" DROP COLUMN "utente_id_fk",
ADD COLUMN     "user_id_fk" TEXT NOT NULL;

-- DropTable
DROP TABLE "Utente";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "targa_user_id_fk_key" ON "targa"("user_id_fk");

-- CreateIndex
CREATE UNIQUE INDEX "veicolo_user_id_fk_key" ON "veicolo"("user_id_fk");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_id_fk_fkey" FOREIGN KEY ("user_id_fk") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veicolo" ADD CONSTRAINT "veicolo_user_id_fk_fkey" FOREIGN KEY ("user_id_fk") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "targa" ADD CONSTRAINT "targa_user_id_fk_fkey" FOREIGN KEY ("user_id_fk") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcheggi" ADD CONSTRAINT "parcheggi_user_id_fk_fkey" FOREIGN KEY ("user_id_fk") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
