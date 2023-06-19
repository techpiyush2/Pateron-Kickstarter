-- AlterTable
ALTER TABLE `posts` ADD COLUMN `features` VARCHAR(191) NULL,
    MODIFY `images` VARCHAR(191) NULL,
    MODIFY `fileLink` VARCHAR(191) NULL;
