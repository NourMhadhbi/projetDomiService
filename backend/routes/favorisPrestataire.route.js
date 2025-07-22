const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
//Marquer un prestataire comme  FAVORI
router.post('/ajouter/:prestataireId', async (req, res) => {
    const clientId = parseInt(req.body.clientId);
    const prestataireId = parseInt(req.params.prestataireId);

    try {
        await prisma.favorisPrestataire.upsert({
            //upsert = "update or insert". Chercher si une entrée existe selon le where. Si elle existe ➔ faire un update. Si elle n’existe pas ➔ faire un create.
            where: { clientId_prestataireId: { clientId, prestataireId } },
            //identifie l'entrée existante selon la clé composite unique @@unique([clientId, prestataireId])
            update: { statut: 'FAVORI', dateAjout: new Date() },
            create: { clientId, prestataireId, statut: 'FAVORI' },
        });
        res.status(200).json({ message: 'Prestataire ajouté aux favoris.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Marquer un prestataire comme NON FAVORI
router.post('/marquer-non-favori/:prestataireId', async (req, res) => {
    const clientId = parseInt(req.body.clientId);
    const prestataireId = parseInt(req.params.prestataireId);

    try {
        await prisma.favorisPrestataire.upsert({
            where: { clientId_prestataireId: { clientId, prestataireId } },
            update: { statut: 'NON_FAVORI', dateAjout: new Date() },
            create: { clientId, prestataireId, statut: 'NON_FAVORI' },
        });
        res.status(200).json({ message: 'Prestataire marqué comme non favori.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Supprimer le favori ou non favori du client
router.delete('/supprimer/:prestataireId', async (req, res) => {
    const clientId = parseInt(req.body.clientId);
    const prestataireId = parseInt(req.params.prestataireId);

    // if (isNaN(clientId) || isNaN(prestataireId)) {
    //     return res.status(400).json({ error: 'clientId ou prestataireId invalide.' });
    // }

    try {
        await prisma.favorisPrestataire.delete({
            where: { clientId_prestataireId: { clientId, prestataireId } },
        });
        res.status(200).json({ message: 'Prestataire retiré des favoris/non favoris.' });
    } catch (error) {
        if (error.code === 'P2025') {
            // P2025 = aucune entrée trouvée à supprimer
            res.status(404).json({ error: 'Entrée non trouvée.' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

//Récupérer la liste des FAVORIS
router.get('/favoris/:clientId', async (req, res) => {
    const clientId = parseInt(req.params.clientId);

    try {
        const favoris = await prisma.favorisPrestataire.findMany({
            where: { clientId, statut: 'FAVORI' },
            include: {
                prestataire: {
                    include: {
                        utilisateur: true,
                        service: true,
                    },
                },
            },
            orderBy: { dateAjout: 'desc' },
        });
        res.status(200).json(favoris);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//Récupérer la liste des NON FAVORIS
router.get('/non-favoris/:clientId', async (req, res) => {
    const clientId = parseInt(req.params.clientId);

    try {
        const nonFavoris = await prisma.favorisPrestataire.findMany({
            where: { clientId, statut: 'NON_FAVORI' },
            include: {
                prestataire: {
                    include: {
                        utilisateur: true,
                        service: true,
                    },
                },
            },
            orderBy: { dateAjout: 'desc' },
        });
        res.status(200).json(nonFavoris);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;