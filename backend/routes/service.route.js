const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const router = express.Router();
//Ajout Service
router.post("/ajoutS", async (req, res) => {
    const { nom, description } = req.body;
    try {
        const service = await prisma.service.create({
            data: {
                nom: nom,
                description: description ?? null,

            },
        });
        res.json(service);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
//Modifier Service
router.put("/modifierS/:id", async (req, res) => {
    const { nom, description } = req.body;
    const id = req.params.id;
    try {
        const service = await prisma.service.update({
            data: {
                nom: nom,
                description: description ?? null,
            },
            where: { id: Number(id) },
        });
        res.json(service);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
//Archiver Service
router.put("/archive/:id", async (req, res) => {
    const id = req.params.id;
    const service = await prisma.service.findUnique({
        where: { id: Number(id) },
        include: {
            prestataires: true,
            entreprises: true,
        },
    });
    if (service.prestataires.length > 0 || service.entreprises.length > 0) {
        return res.status(400).json({
            message: "Impossible d'archiver ce service car il est utilisé par un ou plusieurs prestataires ou entreprises.",
        });
    }
    try {
        const updatedService = await prisma.service.update({
            data: {
                etatArchive: true,
            },
            where: { id: Number(id) },
        });

        res.json(updatedService);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
// afficher la liste des services(sans non Archiver).
router.get("/", async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            where: {
                etatArchive: false,
            },
            orderBy: {
                id: "desc",
            },

        });
        res.json(services);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
// afficher la liste des services (Archiver et non archiver).
router.get("/adminServices", async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            orderBy: {
                id: "desc",
            },

        });
        res.json(services);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
//les top 5 de service selon les rendezVous
// Récupérer tous les services avec leurs prestataires et entreprises.

// Compter les rendez-vous associés à chaque service via prestataires et entreprises.

// Additionner les deux pour chaque service.

// Trier les services par total décroissant.

// Retourner les 5 premiers.
router.get("/top", async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            select: {
                id: true,
                nom: true,
                _count: {
                    select: {
                        prestataires: true, // nombre de prestataires (optionnel)
                    }
                },
                prestataires: {
                    select: {
                        _count: {
                            select: {
                                rendezVous: true // nombre de rdv par prestataire
                            }
                        }
                    }
                }
            }
        });

        // Calculer le totalRDV par service (somme des rdv par prestataire)
        const servicesAvecStats = services.map(service => {
            const totalRDV = service.prestataires.reduce(
                (acc, p) => acc + (p._count?.rendezVous || 0),
                0
            );

            return {
                id: service.id,
                nom: service.nom,
                totalRDV
            };
        });

        // Trier et prendre les 5 premiers
        const top5 = servicesAvecStats
            .sort((a, b) => b.totalRDV - a.totalRDV)
            .slice(0, 5);

        res.json(top5);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// afficher une service.
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const service = await prisma.service.findUnique({
            where: {
                id: Number(id),
            },
        });
        res.json(service);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
// chercher une service par nom.
router.put("/nomService", async (req, res) => {
    const { nom } = req.body;
    try {
        const services = await prisma.service.findMany({
            where: {
                etatArchive: false,

            },
        });
        const filteredServices = services.filter(s =>
            s.nom.toLowerCase().includes(nom.toLowerCase())
        );

        res.json(filteredServices);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
        console.log(error.message);
    }
});




module.exports = router;