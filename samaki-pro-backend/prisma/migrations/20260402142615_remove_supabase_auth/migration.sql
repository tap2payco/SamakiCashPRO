/*
  Warnings:

  - You are about to drop the column `userId` on the `profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passwordHash` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "profiles_userId_key";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "userId",
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profiles_phone_key" ON "profiles"("phone");
