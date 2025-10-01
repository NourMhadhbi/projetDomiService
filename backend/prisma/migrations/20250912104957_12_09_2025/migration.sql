/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Service_nom_key` ON `Service`(`nom`);
