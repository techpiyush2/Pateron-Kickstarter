/*
  Warnings:

  - You are about to drop the column `paymentIntentId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `Insatgram` on the `user` table. All the data in the column will be lost.
  - Added the required column `fileLink` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tierId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_paymentIntentId_fkey`;

-- AlterTable
ALTER TABLE `category` MODIFY `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `posts` ADD COLUMN `fileLink` VARCHAR(191) NOT NULL,
    ADD COLUMN `fileType` ENUM('TEXT', 'IMAGE', 'VIDEO', 'AUDIO') NOT NULL,
    ADD COLUMN `tierId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `paymentIntentId`;

-- AlterTable
ALTER TABLE `tier` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `price` INTEGER NOT NULL DEFAULT 0,
    MODIFY `trial` INTEGER NOT NULL DEFAULT 7;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `Insatgram`,
    ADD COLUMN `Country` VARCHAR(191) NULL,
    ADD COLUMN `Instagram` VARCHAR(191) NULL,
    ADD COLUMN `State` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_tierId_fkey` FOREIGN KEY (`tierId`) REFERENCES `Tier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
