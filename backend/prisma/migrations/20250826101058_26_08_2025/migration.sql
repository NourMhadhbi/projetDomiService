/*
  Warnings:

  - The values [AUTRE] on the enum `Utilisateur_genre` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `utilisateur` MODIFY `genre` ENUM('FEMME', 'HOMME', 'ENTITÉ') NOT NULL;
