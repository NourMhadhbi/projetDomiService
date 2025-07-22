const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
// Ajoute automatiquement le prestataire à l'historique lors de la visite du profil
router.post('/ajouter/:prestataireId', async (req, res) => {
    const clientId = parseInt(req.body.clientId);
    const prestataireId = parseInt(req.params.prestataireId);

    try {
        // Upsert : si existe, met simplement à jour la dateVisite
        await prisma.historiquePrestataire.upsert({
            where: { clientId_prestataireId: { clientId, prestataireId } },
            update: { dateVisite: new Date() },
            create: { clientId, prestataireId },
        });
        res.status(200).json({ message: 'Prestataire ajouté à l’historique.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Supprimer  l'historique d'un client
router.delete('/supprimer/:prestataireId', async (req, res) => {
    const clientId = parseInt(req.body.clientId);
    const prestataireId = parseInt(req.params.prestataireId);

    try {
        await prisma.historiquePrestataire.delete({
            where: { clientId_prestataireId: { clientId, prestataireId } },
        });
        res.status(200).json({ message: 'Entrée supprimée de l’historique.' });
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Entrée non trouvée.' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Récupérer tout l'historique de visite d'un client
router.get('/:clientId', async (req, res) => {
    const clientId = parseInt(req.params.clientId);

    try {
        const historique = await prisma.historiquePrestataire.findMany({
            where: { clientId },
            include: {
                prestataire: {
                    include: {
                        utilisateur: true,
                        service: true,
                    },
                },
            },
            orderBy: { dateVisite: 'desc' },
        });
        res.status(200).json(historique);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;