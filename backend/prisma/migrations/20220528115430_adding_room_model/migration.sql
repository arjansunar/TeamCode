-- AlterTable
ALTER TABLE "users" ADD COLUMN     "meetingId" INTEGER;

-- CreateTable
CREATE TABLE "Room" (
    "id" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_id_key" ON "Room"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_ownerId_key" ON "Room"("ownerId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
