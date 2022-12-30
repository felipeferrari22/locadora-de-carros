/*
  Warnings:

  - You are about to drop the column `carro` on the `locacao` table. All the data in the column will be lost.
  - You are about to drop the column `carro_id` on the `locacao` table. All the data in the column will be lost.
  - You are about to drop the `carro` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `veiculo` to the `locacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `veiculo_id` to the `locacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `locacao` DROP COLUMN `carro`,
    DROP COLUMN `carro_id`,
    ADD COLUMN `veiculo` VARCHAR(191) NOT NULL,
    ADD COLUMN `veiculo_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `carro`;

-- CreateTable
CREATE TABLE `veiculo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `preco` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `veiculo_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
