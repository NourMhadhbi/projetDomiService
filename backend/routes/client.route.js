const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();

// chercher un client par email,nom,prenom,....
router.get('/recherche-clients', async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === '') {
        return res.status(400).json({ message: 'Paramètre de recherche manquant' });
    }
    const searchQuery = q.toLowerCase();
    try {
        const result = await prisma.utilisateur.findMany({
            where: {
                role: { in: ['CLIENT'] },

                OR: [
                    { nom: { contains: searchQuery } },
                    { prenom: { contains: searchQuery } },
                    { email: { contains: searchQuery } },
                    {
                        client: {
                            isActive: true,
                            OR: [
                                { ville: { contains: searchQuery } },
                                { adresse: { contains: searchQuery } },
                            
                                { numTel: { contains: searchQuery } },
                             
                            ]
                        }
                    }
                ]
            },
            include: {
                client: true
            }
        });

        res.json(result);
    } catch (error) {
        console.error("Erreur recherche clients :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
});
module.exports = router;