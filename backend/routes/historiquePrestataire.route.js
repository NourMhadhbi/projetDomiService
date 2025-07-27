const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
const { endOfMinute, startOfMinute, startOfWeek, endOfWeek } = require('date-fns');

// Ajoute automatiquement le prestataire à l'historique lors de la visite du profil
router.post('/ajouter/:prestataireId', async (req, res) => {
    const clientId = parseInt(req.body.clientId);
    const prestataireId = parseInt(req.params.prestataireId);

    const now = new Date();
    const offsetMs = 60 * 60 * 1000; // +1h
    const adjusted = new Date(now.getTime() + offsetMs);

    const start = new Date(adjusted);
    start.setSeconds(0, 0);

    const end = new Date(start);
    end.setSeconds(59, 999);

    try {
        const existing = await prisma.historiquePrestataire.findFirst({
            where: {
                clientId,
                prestataireId,
                dateVisite: {
                    gte: start,
                    lte: end,
                }
            }
        });

        if (existing) {
            return res.status(409).json({ message: 'Historique déjà enregistré pour cette minute.' });
        }

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
                    lte: end,
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

// router.delete('/supprimer/:id', async (req, res) => {
//    const id = parseInt(req.params.id);
//     try {
//         await prisma.historiquePrestataire.delete({
//             where: { id }
//         });
//         res.status(200).json({ message: 'Historique supprimé avec succès.' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });



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

//methode les prestataire et entreprise les plus consulter dans semaine 


router.get('/populaires-semaine', async (req, res) => {
  try {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 }); // lundi
    const end = endOfWeek(now, { weekStartsOn: 1 });     // dimanche

    // 1. Récupère toutes les visites cette semaine
    const historiques = await prisma.historiquePrestataire.findMany({
      where: {
        dateVisite: {
          gte: start,
          lte: end,
        },
      },
      select: {
        clientId: true,
        prestataireId: true,
        dateVisite: true,
      },
    });

    // 2. On construit un Set de clés uniques par minute
    const vuesUniques = new Set();

    historiques.forEach(({ clientId, prestataireId, dateVisite }) => {
      const d = new Date(dateVisite);
      const cle = `${clientId}-${prestataireId}-${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}`;
      vuesUniques.add(cle);
    });

    // 3. Compter par prestataire
    const compteur = new Map();

    for (const cle of vuesUniques) {
      const [, prestataireId] = cle.split('-'); // clientId est ignoré ici
      const id = parseInt(prestataireId);
      compteur.set(id, (compteur.get(id) || 0) + 1);
    }

    // 4. Top 10 prestataires
    const topPrestataires = [...compteur.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // 5. Récupérer leurs données
    const result = await Promise.all(
      topPrestataires.map(async ([id, consultations]) => {
        const prestataire = await prisma.prestataire.findUnique({
          where: { utilisateurIdPre: id },
          include: {
            utilisateur: true,
            entreprise: true,
            service: true,
          },
        });

        return {
          consultations,
          ...prestataire,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Erreur /populaires-semaine :', error);
    res.status(500).json({ error: 'Erreur interne serveur' });
  }
});

module.exports = router;