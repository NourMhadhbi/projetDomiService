const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

//Répartition des utilisateurs
router.get('/getutilisateur', async (req, res) => {
    try {
        const [nbClients, nbPrestataires, nbEntreprises] = await Promise.all([
            prisma.utilisateur.count({
                where: {
                    role: 'CLIENT',
                    client: {
                        is: { isActive: true }
                    }
                }
            }),
            prisma.utilisateur.count({
                where: {
                    role: 'PRESTATAIRE',
                    prestataire: {
                        is: { isActive: true }
                    }
                }
            }),
            prisma.utilisateur.count({
                where: {
                    role: 'ENTREPRISE',
                    prestataire: {
                        is: { isActive: true }
                    }
                }
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
        const [nbRendezVAnnuler, nbRendezVConfirmer, nbRendezVEnAttent, nbRendezVTerminer] = await Promise.all([
            prisma.rendezVous.count({
                where: { statut: 'ANNULE' }
            }),
            prisma.rendezVous.count({
                where: { statut: 'CONFIRME' }
            }),
            prisma.rendezVous.count({
                where: { statut: 'EN_ATTENTE' }
            }),
            prisma.rendezVous.count({
                where: { statut: 'TERMINE' }
            })
        ]);

        res.json({
            nbAnnuler: nbRendezVAnnuler,
            nbConfirmer: nbRendezVConfirmer,
            nbEnAttent: nbRendezVEnAttent,
            nbTerminer: nbRendezVTerminer
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
        const moisClients = {};
        for (const cl of clientsActifs) {
            const date = new Date(cl.utilisateur.createdAt);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            moisClients[key] = (moisClients[key] || 0) + 1;
        }

        const moisPrestas = {};
        for (const pr of prestatairesActifs) {
            const date = new Date(pr.utilisateur.createdAt);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            moisPrestas[key] = (moisPrestas[key] || 0) + 1;
        }

        const currentYear = new Date().getFullYear();
        const moisNoms = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const result = [];
        for (let i = 0; i < 12; i++) {
            const key = `${currentYear}-${i + 1}`;
            result.push({
                mois: `${moisNoms[i]}`,
                clients: moisClients[key] || 0,
                prestataires: moisPrestas[key] || 0
            });
        }

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
          gte: new Date(new Date().getFullYear(), 0, 1) // depuis janvier cette année
        }
      },
      select: {
        utilisateurId: true,
        dateVisite: true,
        utilisateur: {
          select: {
            role: true
          }
        }
      }
    });

    const vuesUniques = new Map();

    // Créer une map de vues uniques par minute et utilisateur
    visites.forEach(({ dateVisite, utilisateurId, utilisateur }) => {
      const date = new Date(dateVisite);
      const minuteKey = `${utilisateurId}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
      if (!vuesUniques.has(minuteKey)) {
        vuesUniques.set(minuteKey, { role: utilisateur.role, date });
      }
    });

    // Regrouper par mois
    const result = {};

    for (const { role, date } of vuesUniques.values()) {
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!result[key]) {
        result[key] = { CLIENT: 0, PRESTATAIRE: 0 };
      }

      if (role === 'CLIENT') result[key].CLIENT++;
      if (role === 'PRESTATAIRE' || role === 'ENTREPRISE') result[key].PRESTATAIRE++;
    }

    // Générer les 12 mois de l’année courante
    const moisNoms = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const anneeCourante = new Date().getFullYear();

    const data = moisNoms.map((mois, index) => {
      const key = `${anneeCourante}-${index + 1}`;
      return {
        month: mois,
        clients: result[key]?.CLIENT || 0,
        prestataires: result[key]?.PRESTATAIRE || 0
      };
    });

    res.json(data);
  } catch (error) {
    console.error("Erreur lors du calcul des consultations mensuelles :", error);
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;