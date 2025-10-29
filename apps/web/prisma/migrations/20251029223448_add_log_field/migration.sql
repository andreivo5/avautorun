/*
  Warnings:

  - You are about to drop the column `level` on the `JobLog` table. All the data in the column will be lost.
  - You are about to drop the column `ts` on the `JobLog` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Job_status_createdAt_idx";

-- DropIndex
DROP INDEX "public"."Job_url_idx";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "log" TEXT;

-- AlterTable
ALTER TABLE "JobLog" DROP COLUMN "level",
DROP COLUMN "ts";
