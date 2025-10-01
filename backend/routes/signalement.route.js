const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();
//get signalements
router.get("/", async (req, res) => {
    try {
        const signales = await prisma.signalement.findMany({
            where: { etatArchive: false },
            include: {
                client: {
                    include: {
                        utilisateur: true
                    }
                },
                prestataire: {
                    include: {
                        utilisateur: true,
                        entreprise: true
                    }
                }
            }
        });

        // const cleanedSignales = signales.map((s) => ({
        //     id: s.id,
        //     raison: s.raison,
        //     date: s.date,
        //     clientId: s.clientId,
        //     prestataireId: s.prestataireId,
        //     client: {
        //         ...s.client,
        //         utilisateur: s.client?.utilisateur
        //             ? {
        //                 nom: s.client.utilisateur.nom,
        //                 prenom: s.client.utilisateur.prenom,
        //                 email: s.client.utilisateur.email,
        //                 image: s.client.utilisateur.image
        //             }
        //             : null
        //     },
        //     prestataire: {
        //         ...s.prestataire,
        //         utilisateur: s.prestataire?.utilisateur
        //             ? {
        //                 nom: s.prestataire.utilisateur.nom,
        //                 prenom: s.prestataire.utilisateur.prenom,
        //                 email: s.prestataire.utilisateur.email
        //             }
        //             : null,
        //         entreprise: s.prestataire?.entreprise
        //             ? {
        //                 nomEntreprise: s.prestataire.entreprise.nomEntreprise,
        //                 siteWeb: s.prestataire.entreprise.siteWeb
        //             }
        //             : null
        //     }
        // }));

        res.json(signales);
    } catch (error) {
        console.error("Erreur signalements :", error);
        res.status(500).json({ message: error.message });
    }
});
router.get("/mesSignalements/:clientId", async (req, res) => {
    try {
        const clientId = Number(req.params.clientId);

        if (!clientId) {
            return res.status(400).json({ message: "ClientId requis" });
        }

        const signales = await prisma.signalement.findMany({
            where: { clientId, etatArchive: false },
            include: {
                client: {
                    include: { utilisateur: true }
                },
                prestataire: {
                    include: { utilisateur: true, entreprise: true }
                }
            },
            orderBy: { date: 'desc' }
        });

        res.status(200).json(signales);
    } catch (error) {
        console.error("Erreur mesSignalements :", error);
        res.status(500).json({ message: error.message });
    }
});

// signaler prestataire
router.post("/AjoutSignale", async (req, res) => {
    try {
        const { raison, clientId, prestataireId } = req.body;

        if (!raison || !clientId || !prestataireId) {
            return res.status(400).json({ message: "Champs requis manquants" });
        }
        const datePlus = new Date();
        datePlus.setHours(datePlus.getHours() + 1);

        const signale = await prisma.signalement.create({
            data: {
                raison,
                date: datePlus,
                client: { connect: { utilisateurIdCl: Number(clientId) } },
                prestataire: { connect: { utilisateurIdPre: Number(prestataireId) } }
            }
        });


        const client = await prisma.client.findUnique({
            where: { utilisateurIdCl: Number(clientId) },
            include: { utilisateur: true }
        });

        const prestataire = await prisma.prestataire.findUnique({
            where: { utilisateurIdPre: Number(prestataireId) },
            include: { utilisateur: true }
        });


        const admins = await prisma.utilisateur.findMany({
            where: { role: "ADMIN" }
        });

        const notifications = await Promise.all(admins.map(admin => {
            return prisma.notification.create({
                data: {
                    contenu: `Le client ${client.utilisateur.prenom} ${client.utilisateur.nom} a signalé le prestataire ${prestataire.utilisateur.prenom} ${prestataire.utilisateur.nom}.`,
                    utilisateurId: admin.id
                }
            });
        }));

        res.json({ signale, notifications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Route pour archiver un signalement
router.post("/ArchiveSignale", async (req, res) => {
    try {
        const { signalId } = req.body;

        if (!signalId) {
            return res.status(400).json({ message: "L'id du signalement est requis" });
        }

        // Met à jour le signalement en le marquant comme archivé
        const archivedSignal = await prisma.signalement.update({
            where: { id: Number(signalId) },
            data: { etatArchive: true, updatedAt: new Date() },
        });

        res.json({ message: "Signalement supprimé avec succès", archivedSignal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

//detecte nombre signalement 
router.get("/checkSignalements", async (req, res) => {
    try {
        const utilisateurs = await prisma.utilisateur.findMany({
            where: {
                role: {
                    in: ["CLIENT", "PRESTATAIRE", "ENTREPRISE"]
                }

            },
            include: {
                client: true,
                prestataire: true
            }
        });

        const admin = await prisma.utilisateur.findFirst({
            where: { role: "ADMIN" }
        });

        const result = [];

        for (const user of utilisateurs) {
            let nbSignalements = 0;

            if (user.role === "CLIENT" && user.client) {
                nbSignalements = await prisma.signalement.count({
                    where: { clientId: user.client.utilisateurIdCl }
                });
            }

            if ((user.role === "PRESTATAIRE" || user.role === "ENTREPRISE") && user.prestataire) {
                nbSignalements = await prisma.signalement.count({
                    where: { prestataireId: user.prestataire.utilisateurIdPre, etatArchive: false }
                });
            }

            result.push({
                utilisateurId: user.id,
                nbSignalements: nbSignalements
            });

            // 🔔 Création notification sans vérifier si elle existe déjà
            if (nbSignalements >= 10 && admin) {
                await prisma.notification.create({
                    data: {
                        utilisateurId: admin.id,

                        contenu: `${user.nom} ${user.prenom} (${user.role}) a été signalé ${nbSignalements} fois.`,

                    }
                });
            }
        }

        res.status(200).json(result);

    } catch (error) {
        console.error("Erreur lors du check des signalements:", error);
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});



module.exports = router;