const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
// chercher un prestataire par email.
router.get('/emailPrestataire', async (req, res,) => {
    const { email } = req.body
    try {
        const utilisateur = await prisma.utilisateur.findUnique({
            where: {
                email
            },
            include: {
                prestataire: {
                    include: {
                        entreprise: true,
                        service: true
                    }
                }
            }
        })
        res.json(utilisateur)
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
});
// chercher un prestataire par email,nom,prenom,....
router.get('/recherche-prestataires', async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === '') {
        return res.status(400).json({ message: 'Paramètre de recherche manquant' });
    }
    const searchQuery = q.toLowerCase();
    try {
        const result = await prisma.utilisateur.findMany({
            where: {
                role: { in: ['PRESTATAIRE', 'ENTREPRISE'] },

                OR: [
                    { nom: { contains: searchQuery } },
                    { prenom: { contains: searchQuery } },
                    { email: { contains: searchQuery } },
                    {
                        prestataire: {
                            isActive: true,
                            OR: [
                                { ville: { contains: searchQuery } },
                                { adresse: { contains: searchQuery } },
                                { Spécialite: { contains: searchQuery } },
                                { numTel: { contains: searchQuery } },
                                {
                                    entreprise: {
                                        OR: [
                                            { nomEntreprise: { contains: searchQuery } },
                                            { siteWeb: { contains: searchQuery } },
                                            { identifiant: { contains: searchQuery } }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
            include: {
                prestataire: {
                    include: {
                        entreprise: true,
                        service: true
                    }
                }
            }
        });

        res.json(result);
    } catch (error) {
        console.error("Erreur recherche prestataires :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
});


//afficher  prestataires par service
//afficher les prestataires de service id

router.get("/servicePres", async (req, res) => {
    const id = req.query.id; 

    try {
        const prestataires = await prisma.prestataire.findMany({
            where: {
                serviceId: Number(id),
            },
            include: { utilisateur: true, entreprise: true }
        });
        res.json(prestataires);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;