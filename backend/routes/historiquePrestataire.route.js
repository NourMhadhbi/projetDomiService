const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { endOfMinute, startOfMinute } = require('date-fns');
// Ajoute automatiquement le prestataire à l'historique lors de la visite du profil
router.post('/ajouter/:prestataireId', async (req, res) => {
    const clientId = parseInt(req.body.clientId);
    const prestataireId = parseInt(req.params.prestataireId);
    const now = new Date();
    const offsetMs = 60 * 60 * 1000; // +1h
    const adjusted = new Date(now.getTime() + offsetMs);
    try {
        await prisma.historiquePrestataire.create({
            data: {
                dateVisite: adjusted,
                clientId,
                prestataireId,
            },
        });
        res.status(200).json({ message: 'Historique enregistré.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Supprimer  l'historique d'un client
router.post('/supprimer', async (req, res) => {
    const { clientId, prestataireId, dateVisite } = req.body;

    try {

        const date = new Date(dateVisite);
        const start = startOfMinute(date);
        const end = endOfMinute(date);
        const deleted = await prisma.historiquePrestataire.deleteMany({
            where: {
                clientId,
                prestataireId,
                dateVisite: {
                    gte: start,
                    lt: end,
                }
            }
        });

        if (deleted.count === 0) {
            return res.status(404).json({ error: 'Aucune entrée trouvée.' });
        }

        res.status(200).json({ message: `${deleted.count} entrée(s) supprimée(s).` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});




// Récupérer tout l'historique de visite d'un client
router.get('/dernier', async (req, res) => {
    const clientId = parseInt(req.query.clientId);

    try {
        const historiques = await prisma.historiquePrestataire.findMany({
            where: { clientId },
            orderBy: { dateVisite: 'desc' },
            include: {
                prestataire: {
                    include: {
                        utilisateur: true,
                        service: true,
                        entreprise: true,
                    },
                },
            },
        });
        const uniquePrestataires = new Map();

        historiques.forEach((item) => {
            const prestataireId = item.prestataireId;
            if (!uniquePrestataires.has(prestataireId)) {
                uniquePrestataires.set(prestataireId, item);
            }
        });

        // Convertir en tableau
        const dernieresVisites = Array.from(uniquePrestataires.values());

        res.status(200).json(dernieresVisites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/all', async (req, res) => {
    const result = await prisma.historiquePrestataire.findMany();
    res.json(result);
});






router.post('/trouver', async (req, res) => {
    const { clientId, prestataireId, dateVisite } = req.body;

    if (!clientId || !prestataireId || !dateVisite) {
        return res.status(400).json({ error: 'Paramètres requis : clientId, prestataireId, dateVisite' });
    }

    try {
        const date = new Date(dateVisite);
        const start = startOfMinute(date);
        const end = endOfMinute(date);

        const result = await prisma.historiquePrestataire.findFirst({
            where: {
                clientId: parseInt(clientId),
                prestataireId: parseInt(prestataireId),
                dateVisite: {
                    gte: start,
                    lte: end
                }
            }
        });

        if (!result) {
            return res.status(404).json({ error: 'Aucune entrée trouvée.' });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;