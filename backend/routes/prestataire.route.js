const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
// chercher un prestataire email.
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
//carte contact prestataire

router.get('/carteContactPrestataire/:prestataireId', async (req, res) => {
  const { prestataireId } = req.params;

  try {
  
    const rendezVous = await prisma.rendezVous.findMany({
      where: {
        prestataireId: Number(prestataireId),
        statut: { in: ['CONFIRME', 'TERMINE'] }
      },
      include: {
        client: {
          include: {
            utilisateur: true
          }
        }
      }
    });

    //client n’a pas signalé ce prestataire
    const signales = await prisma.signalement.findMany({
      where: {
        prestataireId: Number(prestataireId)
      },
      select: { clientId: true }
    });

    const clientIdsSignales = new Set(signales.map(s => s.clientId));

    const clientsUniques = [];
    const dejaAjoutes = new Set();

    for (const rdv of rendezVous) {
      const clientId = rdv.clientId;
      if (!clientIdsSignales.has(clientId) && !dejaAjoutes.has(clientId)) {
        const client = rdv.client;

        clientsUniques.push({
          id: client.id,
          utilisateurId: client.utilisateur.id,
          prenom: client.utilisateur.prenom,
          nom: client.utilisateur.nom,
          email: client.utilisateur.email,
          image: client.utilisateur.image,
          numTel: client.numTel,
          adresse: client.adresse,
          ville: client.ville
        });

        dejaAjoutes.add(clientId);
      }
    }

    res.json(clientsUniques);
  } catch (error) {
    console.error("Erreur lors du chargement des clients :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;