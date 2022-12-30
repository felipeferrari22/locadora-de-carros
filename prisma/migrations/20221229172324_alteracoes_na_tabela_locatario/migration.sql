/*
  Warnings:

  - You are about to drop the column `usuario_id` on the `locacao` table. All the data in the column will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `locatario_id` to the `locacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `locacao` DROP COLUMN `usuario_id`,
    ADD COLUMN `locatario_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `usuario`;

-- CreateTable
CREATE TABLE `locatario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `locatario_nome_key`(`nome`),
    UNIQUE INDEX `locatario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
