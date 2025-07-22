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
//chercher un prestataire par service
router.get('/servicePrestataire', async (req, res,) => {
    const { serviceId } = req.body
    try {
        const prestataire = await prisma.prestataire.findMany({
            where: {
                serviceId: Number(serviceId)
            },
            include: {
                service: true, entreprise: true,
            }
        })
        res.json(prestataire)
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
});
module.exports = router;