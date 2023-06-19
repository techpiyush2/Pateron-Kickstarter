/*
  Warnings:

  - You are about to drop the column `images` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `posts` DROP COLUMN `images`,
    ADD COLUMN `image` VARCHAR(191) NULL;
