/*
  Warnings:

  - A unique constraint covering the columns `[peerId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "peerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_peerId_key" ON "users"("peerId");
