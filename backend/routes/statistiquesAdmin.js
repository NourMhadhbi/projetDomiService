const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

//Répartition des utilisateurs
router.get('/getutilisateur', async (req, res) => {
    try {
        const [nbClients, nbPrestataires, nbEntreprises] = await Promise.all([
            prisma.utilisateur.count({
                where: { role: 'CLIENT', isActive: true }
            }),
            prisma.utilisateur.count({
                where: { role: 'PRESTATAIRE', isActive: true }
            }),
            prisma.utilisateur.count({
                where: { role: 'ENTREPRISE', isActive: true }
            })
        ]);

        res.json({
            clients: nbClients,
            prestataires: nbPrestataires,
            entreprises: nbEntreprises
        });
    } catch (error) {
        console.error("Erreur récupération utilisateurs :", error);
        res.status(500).json({
            message: error.message
        });
    }
});
//Répartition des rendez-vous
router.get('/getRendezVous', async (req, res) => {
    try {
        const [nbRendezVAnnuler, nbRendezVConfirmer, nbRendezVEnAttent,nbRendezVTerminer] = await Promise.all([
            prisma.rendezVous.count({
                where: { statut: 'ANNULE' }
            }),
            prisma.rendezVous.count({
                where: {  statut: 'CONFIRME'  }
            }),
            prisma.rendezVous.count({
                where: {  statut: 'EN_ATTENTE'}
            }),
            prisma.rendezVous.count({
                where: {  statut: 'TERMINE'}
            })
        ]);

        res.json({
            nbAnnuler: nbRendezVAnnuler,
            nbConfirmer: nbRendezVConfirmer,
            nbEnAttent: nbRendezVEnAttent,
            nbTerminer:nbRendezVTerminer
        });
    } catch (error) {
        console.error("Erreur récupération utilisateurs :", error);
        res.status(500).json({
            message: error.message
        });
    }
});
//Clients Interactions
router.get('/client-interactions', async (req, res) => {
  try {
  
    const [nbFavoris, nbNonFavoris, nbSignalements] = await Promise.all([
      prisma.avis.count({
        where: {
          aime: true,
          etatArchive: false
        }
      }),
      prisma.avis.count({
        where: {
          aime: false,
          etatArchive: false
        }
      }),
      prisma.signalement.count()
    ]);

    res.json({
      favoris: nbFavoris,
      nonFavoris: nbNonFavoris,
      signalements: nbSignalements
    });
  } catch (error) {
    console.error('Erreur interactions client:', error);
    res.status(500).json({ message: error.message });
  }
});
//nb d'inscription par moi
router.get('/inscriptions-par-mois', async (req, res) => {
  try {
    const clientsActifs = await prisma.client.findMany({
      where: { isActive: true },
      select: {
        utilisateur: { select: { createdAt: true } }
      }
    });

    const prestatairesActifs = await prisma.prestataire.findMany({
      where: { isActive: true },
      select: {
        utilisateur: { select: { createdAt: true } }
      }
    });

    // Regrouper par mois pour clients
    const moisClients = {};
    for (const cl of clientsActifs) {
      const date = new Date(cl.utilisateur.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      moisClients[key] = (moisClients[key] || 0) + 1;
    }

    // Regrouper par mois pour prestataires
    const moisPrestas = {};
    for (const pr of prestatairesActifs) {
      const date = new Date(pr.utilisateur.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      moisPrestas[key] = (moisPrestas[key] || 0) + 1;
    }


    const allMonths = Array.from(new Set([...Object.keys(moisClients), ...Object.keys(moisPrestas)])).sort();

    const moisNoms = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const result = allMonths.map((key) => {
      const [year, month] = key.split('-');
      return {
        mois: `${moisNoms[parseInt(month) - 1]} ${year}`,
        clients: moisClients[key] || 0,
        prestataires: moisPrestas[key] || 0
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: error.message });
  }
});
//nb de consultation utilisateur 
router.get('/consultations-mensuelles', async (req, res) => {
  try {
    const visites = await prisma.historiqueApp.findMany({
      where: {
        dateVisite: {
          gte: new Date(new Date().getFullYear(), 0, 1) // depuis janvier de cette année
        }
      },
      select: {
        dateVisite: true,
        utilisateur: {
          select: {
            role: true
          }
        }
      }
    });

    const result = {};

    visites.forEach(({ dateVisite, utilisateur }) => {
      const mois = dateVisite.toLocaleString('default', { month: 'short' }); // "Jan", "Feb", ...
      if (!result[mois]) {
        result[mois] = { CLIENT: 0, PRESTATAIRE: 0 };
      }

      if (utilisateur.role === 'CLIENT') result[mois].CLIENT++;
      if (utilisateur.role === 'PRESTATAIRE' || utilisateur.role === 'ENTREPRISE') {
        result[mois].PRESTATAIRE++;
      }
    });

    const moisOrdre = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = moisOrdre.map(mois => ({
      month: mois,
      clients: result[mois]?.CLIENT || 0,
      prestataires: result[mois]?.PRESTATAIRE || 0
    }));

    res.json(data);
  } catch (error) {
    console.error("Erreur lors du calcul des consultations mensuelles :", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;