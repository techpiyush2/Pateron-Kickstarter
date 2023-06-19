/*
  Warnings:

  - The values [PROVIDER,CLIENT] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_tierId_fkey`;

-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_userId_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('CREATOR', 'SUPPORTER') NULL;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_tierId_fkey` FOREIGN KEY (`tierId`) REFERENCES `Tier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
