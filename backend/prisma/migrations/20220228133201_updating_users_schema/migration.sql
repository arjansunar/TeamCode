/*
  Warnings:

  - You are about to drop the column `hasedRt` on the `users` table. All the data in the column will be lost.
  - Added the required column `photo` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileUrl` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "hasedRt",
ADD COLUMN     "hashedRt" TEXT,
ADD COLUMN     "photo" TEXT NOT NULL,
ADD COLUMN     "profileUrl" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
