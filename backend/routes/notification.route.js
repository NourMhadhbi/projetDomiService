const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
// //notification by client 
// router.get('/:idClient', async (req, res) => {
//     const idClient = Number(req.params.idClient);

//     try {
//         const notifications = await prisma.notification.findMany({
//             where: {
//                 utilisateurId: idClient,
//                 utilisateur: {
//                     role: "CLIENT"
//                 }
//             },
//             orderBy: {
//                 dateEnvoi: 'desc'
//             },
//             include: {
//                 utilisateur: true
//             }
//         });

//         res.json(notifications);
//     } catch (error) {
//         console.error("Erreur lors de la récupération des notifications du client :", error);
//         res.status(500).json({ message: "Erreur serveur" });
//     }
// });
//notification by prestataire 
// router.get('/:idPrestataire', async (req, res) => {
//     const idPrestataire = Number(req.params.idPrestataire);

//     try {
//         const notifications = await prisma.notification.findMany({
//             where: {
//                 utilisateurId: idPrestataire,
//                 utilisateur: {
//                     role: "PRESTATAIRE"
//                 }
//             },
//             orderBy: {
//                 dateEnvoi: 'desc'
//             },
//             include: {
//                 utilisateur: true
//             }
//         });

//         res.json(notifications);
//     } catch (error) {
//         console.error("Erreur lors de la récupération des notifications du prestataire :", error);
//         res.status(500).json({ message: "Erreur serveur" });
//     }
// });
//notification by admin 
// router.get('/:idAdmin', async (req, res) => {
//     const idAdmin = Number(req.params.idAdmin);

//     try {
//         const notifications = await prisma.notification.findMany({
//             where: {
//                 utilisateurId: idAdmin,
//                 utilisateur: {
//                     role: "ADMIN"
//                 }
//             },
//             orderBy: {
//                 dateEnvoi: 'desc'
//             },
//             include: {
//                 utilisateur: true
//             }
//         });

//         res.json(notifications);
//     } catch (error) {
//         console.error("Erreur lors de la récupération des notifications du admin :", error);
//         res.status(500).json({ message: "Erreur serveur" });
//     }
// });
router.get('/', async (req, res) => {
    const id = Number(req.query.id);
    const role = req.query.role?.toUpperCase();

    if (!id || !["CLIENT", "PRESTATAIRE", "ADMIN", "ENTREPRISE"].includes(role)) {
        return res.status(400).json({ message: "ID ou rôle invalide" });
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                utilisateurId: id,
                utilisateur: {
                    role: role
                }
            },
            orderBy: {
                dateEnvoi: 'desc'
            },
            include: {
                utilisateur: true
            }
        });

        res.json(notifications);
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
//mettre comme lue
router.put('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.notification.update({
            where: { id },
            data: { estLue: true }
        });
        res.json({ message: 'Notification mise à jour' });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
});
module.exports = router;