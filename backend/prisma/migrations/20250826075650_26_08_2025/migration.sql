-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `prenom` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `motDePasse` VARCHAR(255) NOT NULL,
    `role` ENUM('CLIENT', 'PRESTATAIRE', 'ADMIN', 'ENTREPRISE') NOT NULL,
    `genre` ENUM('FEMME', 'HOMME', 'AUTRE') NOT NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `utilisateurIdCl` INTEGER UNSIGNED NOT NULL,
    `adresse` VARCHAR(255) NOT NULL,
    `ville` VARCHAR(255) NOT NULL,
    `numTel` VARCHAR(255) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,

    UNIQUE INDEX `Client_utilisateurIdCl_key`(`utilisateurIdCl`),
    PRIMARY KEY (`utilisateurIdCl`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `utilisateurIdAd` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_utilisateurIdAd_key`(`utilisateurIdAd`),
    PRIMARY KEY (`utilisateurIdAd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prestataire` (
    `utilisateurIdPre` INTEGER UNSIGNED NOT NULL,
    `adresse` VARCHAR(191) NOT NULL,
    `ville` VARCHAR(191) NOT NULL,
    `numTel` VARCHAR(191) NULL,
    `tarifDeplacement` DOUBLE NULL,
    `experience` MEDIUMTEXT NULL,
    `competence` MEDIUMTEXT NULL,
    `Spécialite` MEDIUMTEXT NOT NULL,
    `descriptionCourte` MEDIUMTEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `serviceId` INTEGER NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,

    PRIMARY KEY (`utilisateurIdPre`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entreprise` (
    `prestataireId` INTEGER UNSIGNED NOT NULL,
    `nomEntreprise` VARCHAR(191) NOT NULL,
    `siteWeb` VARCHAR(191) NULL,
    `identifiant` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Entreprise_identifiant_key`(`identifiant`),
    PRIMARY KEY (`prestataireId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `etatArchive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RendezVous` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `raison` MEDIUMTEXT NULL,
    `lieuDintervention` VARCHAR(191) NOT NULL,
    `statut` ENUM('EN_ATTENTE', 'CONFIRME', 'TERMINE', 'ANNULE') NOT NULL DEFAULT 'EN_ATTENTE',
    `clientId` INTEGER UNSIGNED NOT NULL,
    `prestataireId` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Avis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commentaire` VARCHAR(191) NULL,
    `note` DOUBLE NULL,
    `aime` BOOLEAN NOT NULL DEFAULT false,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `etatArchive` BOOLEAN NOT NULL DEFAULT false,
    `clientId` INTEGER UNSIGNED NOT NULL,
    `prestataireId` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Signalement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `raison` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clientId` INTEGER UNSIGNED NOT NULL,
    `prestataireId` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contenu` VARCHAR(191) NOT NULL,
    `dateEnvoi` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estLue` BOOLEAN NOT NULL DEFAULT false,
    `utilisateurId` INTEGER UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistoriquePrestataire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientId` INTEGER UNSIGNED NOT NULL,
    `prestataireId` INTEGER UNSIGNED NOT NULL,
    `dateVisite` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FavorisPrestataire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientId` INTEGER UNSIGNED NOT NULL,
    `prestataireId` INTEGER UNSIGNED NOT NULL,
    `dateAjout` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `statut` ENUM('FAVORI', 'NON_FAVORI') NOT NULL DEFAULT 'FAVORI',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `FavorisPrestataire_clientId_prestataireId_key`(`clientId`, `prestataireId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistoriqueApp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateurId` INTEGER UNSIGNED NOT NULL,
    `dateVisite` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_utilisateurIdCl_fkey` FOREIGN KEY (`utilisateurIdCl`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_utilisateurIdAd_fkey` FOREIGN KEY (`utilisateurIdAd`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prestataire` ADD CONSTRAINT `Prestataire_utilisateurIdPre_fkey` FOREIGN KEY (`utilisateurIdPre`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prestataire` ADD CONSTRAINT `Prestataire_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entreprise` ADD CONSTRAINT `Entreprise_prestataireId_fkey` FOREIGN KEY (`prestataireId`) REFERENCES `Prestataire`(`utilisateurIdPre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RendezVous` ADD CONSTRAINT `RendezVous_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`utilisateurIdCl`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RendezVous` ADD CONSTRAINT `RendezVous_prestataireId_fkey` FOREIGN KEY (`prestataireId`) REFERENCES `Prestataire`(`utilisateurIdPre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avis` ADD CONSTRAINT `Avis_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`utilisateurIdCl`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avis` ADD CONSTRAINT `Avis_prestataireId_fkey` FOREIGN KEY (`prestataireId`) REFERENCES `Prestataire`(`utilisateurIdPre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Signalement` ADD CONSTRAINT `Signalement_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`utilisateurIdCl`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Signalement` ADD CONSTRAINT `Signalement_prestataireId_fkey` FOREIGN KEY (`prestataireId`) REFERENCES `Prestataire`(`utilisateurIdPre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoriquePrestataire` ADD CONSTRAINT `HistoriquePrestataire_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`utilisateurIdCl`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoriquePrestataire` ADD CONSTRAINT `HistoriquePrestataire_prestataireId_fkey` FOREIGN KEY (`prestataireId`) REFERENCES `Prestataire`(`utilisateurIdPre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavorisPrestataire` ADD CONSTRAINT `FavorisPrestataire_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`utilisateurIdCl`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavorisPrestataire` ADD CONSTRAINT `FavorisPrestataire_prestataireId_fkey` FOREIGN KEY (`prestataireId`) REFERENCES `Prestataire`(`utilisateurIdPre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoriqueApp` ADD CONSTRAINT `HistoriqueApp_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
