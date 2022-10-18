-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_meetingId_fkey";

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "meetingId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
