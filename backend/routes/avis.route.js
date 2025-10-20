const express = require('express');
const { PrismaClient } = require('@prisma/client')
const nodemailer = require('nodemailer');
const prisma = new PrismaClient()
const router = express.Router();
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'domiservicesmm@gmail.com',
        pass: 'qyxx txcw vzgf lvdu'
    },
    tls: {
        rejectUnauthorized: false
    }
})
const sendMailToUser = async (userEmail, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: '"DomiService" <mhadhbi.nour106@gmail.com>',
            to: userEmail,
            subject: subject,
            html: htmlContent,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email envoyé à ${userEmail}`);
    } catch (error) {
        console.error(`Erreur envoi mail à ${userEmail} :`, error);
    }
};
// ajouter avis 
router.post("/Ajouteravis", async (req, res) => {
    const {
        commentaire,
        note,
        aime,
        clientId,
        prestataireId,

    } = req.body;

    if (!clientId || !prestataireId) {
        return res.status(400).json({ message: "clientId est obligatoire." });
    }



    try {
        // Créer l'avis
        const nouvelAvis = await prisma.avis.create({
            data: {
                commentaire: commentaire || null,
                note: note,
                aime: aime,
                client: { connect: { utilisateurIdCl: clientId } },
                prestataire: { connect: { utilisateurIdPre: prestataireId } },

            },
            include: {
                client: { include: { utilisateur: true } },
                prestataire: {
                    include: {
                        utilisateur: true,
                        entreprise: true
                    }
                }

            },
        });
        destinataireNom = nouvelAvis.prestataire.entreprise
            ? nouvelAvis.prestataire.entreprise.nomEntreprise
            : nouvelAvis.prestataire.utilisateur.nom;


        destinataireUser = nouvelAvis.prestataire.utilisateur;
        const commentairePreview = nouvelAvis.commentaire
            ? nouvelAvis.commentaire.split('.')[0] + '...'
            : '';
        if (destinataireUser?.email && destinataireUser?.email.trim() !== "") {
            const sujet = "Nouvel avis reçu - DomiService";
            const messageHtml = `
                <p>Bonjour ${destinataireNom},</p>
                <p>Vous avez reçu un nouvel avis de la part de ${nouvelAvis.client.utilisateur.nom} ${nouvelAvis.client.utilisateur.prenom}.</p>
                <p>
                    Note: ${nouvelAvis.note ?? 'Non spécifiée'}<br>
                    ${nouvelAvis.aime ? "Ils aiment votre service.<br>" : ""}
                    ${nouvelAvis.commentaire ? `Commentaire: ${nouvelAvis.commentaire}<br>` : ""}
                </p>
                <p>Cordialement,<br>DomiService</p>
            `;


            await sendMailToUser(destinataireUser.email, sujet, messageHtml);



        }
        const contenuNotification = `
                Vous avez reçu un nouvel avis de ${nouvelAvis.client.utilisateur.nom} ${nouvelAvis.client.utilisateur.prenom}.
                Note: ${nouvelAvis.note ?? 'Non spécifiée'}.
                ${nouvelAvis.aime ? "Ils aiment votre service." : ""}
              ${commentairePreview ? `Commentaire: ${commentairePreview}` : ""}
            `;

        await prisma.notification.create({
            data: {
                contenu: contenuNotification.trim(),
                utilisateurId: prestataireId,
            },
        });
        res.status(201).json(nouvelAvis);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
//modifier avis 
router.put("/Modifieravis/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { commentaire, note, aime } = req.body;

    try {

        const avisModifie = await prisma.avis.update({
            where: { id },
            data: {
                commentaire: commentaire ?? undefined,
                note: note !== undefined && note !== null && note !== '' ? Number(note) : null,
                aime: aime === 'like' ? true : aime === 'dislike' ? false : false,
            },
            include: {
                client: { include: { utilisateur: true } },
                prestataire: { include: { utilisateur: true, entreprise: true } },
            },
        });


        //     const contenuNotif = `
        //   Avis modifié :
        //   Note : ${avisModifie.note ?? 'Non spécifiée'}.
        //   ${avisModifie.aime ? "Le client apprécie votre service." : ""}
        //   ${avisModifie.commentaire ? `Commentaire : ${avisModifie.commentaire}` : ""}
        // `.trim();


        let destinataireNom = "";
        const utilisateurDestinataire = avisModifie.prestataire?.utilisateur;

        if (avisModifie.prestataire.entreprise) {
            destinataireNom = avisModifie.prestataire.entreprise.nomEntreprise;
        } else {
            destinataireNom = utilisateurDestinataire.nom;
        }
        //     if (utilisateurDestinataire) {

        //         await prisma.notification.create({
        //             data: {
        //                 contenu: contenuNotif,
        //                 utilisateurId: utilisateurDestinataire.id,

        //             },
        //         });

        //         if (utilisateurDestinataire.email && utilisateurDestinataire.email.trim() !== "") {
        //             const sujet = "Mise à jour de votre avis - DomiService";
        //             const messageHtml = `
        //     <p>Bonjour ${destinataireNom},</p>
        //     <p>Un client a modifié son avis concernant votre service :</p>
        //     <p>
        //       <strong>Note :</strong> ${avisModifie.note ?? 'Non spécifiée'}<br>
        //       ${avisModifie.aime ? "Le client apprécie votre service.<br>" : ""}
        //       ${avisModifie.commentaire ? `Commentaire : ${avisModifie.commentaire}<br>` : ""}
        //     </p>
        //     <p>Cordialement,<br>L’équipe DomiService</p>
        //   `;

        //             await sendMailToUser(utilisateurDestinataire.email, sujet, messageHtml);
        //         }
        //     }

        res.json(avisModifie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

//Archiver avis 
router.put("/archiveAvis/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const avisArchive = await prisma.avis.update({
            where: { id },
            data: { etatArchive: true },
        });
        res.json({ message: "Avis archivé avec succès", avisArchive });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
//Récupérer un avis par ID
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
    }
    try {
        const avis = await prisma.avis.findUnique({
            where: { id },
            include: {
                client: { include: { utilisateur: true } },
                prestataire: { include: { utilisateur: true, entreprise: { include: { utilisateur: true } } } },
            },
        });

        if (!avis) return res.status(404).json({ message: "Avis non trouvé." });

        res.json(avis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
//Lister avis d’un client (commentaire non nul, non archivé)
router.get("/client/:clientId", async (req, res) => {
    const clientId = Number(req.params.clientId);

    try {
        const avisClient = await prisma.avis.findMany({
            where: {
                clientId,
                // commentaire: { not: null },
                etatArchive: false,
            },
            include: {
                prestataire: { include: { utilisateur: true, entreprise: true } },
            },
        });

        res.json(avisClient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
// afficher la liste des avis par prestataire
router.get('/prestataire/:prestataireId', async (req, res) => {
    try {
        const { prestataireId } = req.params;

        const avis = await prisma.avis.findMany({
            where: { prestataireId: Number(prestataireId), etatArchive: false },
            include: {
                client: { include: { utilisateur: true } },
                prestataire: { include: { utilisateur: true, entreprise: true } },
            },
        });

        res.json({ success: true, avis });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Erreur lors de la récupération des avis du prestataire" });
    }
});


// afficher la liste des avis par entreprise
// router.get('/entreprise/:entrepriseId', async (req, res) => {
//     try {
//         const { entrepriseId } = req.params;

//         const avis = await prisma.avis.findMany({
//             where: { entrepriseId: Number(entrepriseId), etatArchive: false },
//             include: {
//                 client: { include: { utilisateur: true } },
//             },
//         });

//         res.json({ success: true, avis });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, error: "Erreur lors de la récupération des avis de l'entreprise" });
//     }
// });


//statistique intervenant
router.get("/statistiques/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
    }

    try {
        const avis = await prisma.avis.findMany({
            where: { prestataireId: id, etatArchive: false },
            include: {
                prestataire: {
                    include: {
                        entreprise: true
                    }
                }
            },
        });

        const totalAvis = avis.length;
        const totalAime = avis.filter(a => a.aime).length;
        const sommeNotes = avis.reduce((sum, a) => sum + (a.note ?? 0), 0);/*reduce est une méthode JavaScript utilisée sur les tableaux.
Elle sert à transformer un tableau en une seule valeur (par exemple : une somme, une moyenne, un objet, etc.).*/
        const moyenneNote = totalAvis ? (sommeNotes / totalAvis) : 0;
        const tauxSatisfaction = totalAvis ? (totalAime / totalAvis) * 100 : 0;

        res.json({
            totalAvis,
            totalAime,
            moyenneNote: Number(moyenneNote.toFixed(1)),
            tauxSatisfaction: Number(tauxSatisfaction.toFixed(1)),
        });
    } catch (error) {
        console.error("Erreur statistiques dynamique :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

//statistique application



router.get("/", async (req, res) => {
    try {
        //  Récupérer les données nécessaires
        const [rendezVous, avis, favoris, prestataires] = await Promise.all([
            prisma.rendezVous.findMany(),
            prisma.avis.findMany({
                where: {
                    etatArchive: false
                }
            }),
            prisma.favorisPrestataire.findMany(),
            prisma.prestataire.findMany(),
        ]);

        // Successful Projects (terminé + aime ou favoris)
        const successfulProjects = rendezVous.filter(rdv => {
            if (rdv.statut !== "TERMINE") return false;

            const avisMatch = avis.find(a =>
                a.clientId === rdv.clientId &&
                a.prestataireId === rdv.prestataireId &&
                a.aime === true
            );

            const favoriMatch = favoris.find(f =>
                f.clientId === rdv.clientId &&
                f.prestataireId === rdv.prestataireId &&
                f.statut === "FAVORI"
            );

            return avisMatch || favoriMatch;
        }).length;


        // 3Satisfied Customers
        const satisfiedClientIds = avis.filter(a => {
            const favori = favoris.find(f =>
                f.prestataireId === a.prestataireId &&
                f.clientId === a.clientId &&
                f.statut === "FAVORI"
            );
            return a.aime === true || favori;
        }).map(a => a.clientId);
        const satisfiedCustomerCount = [...new Set(satisfiedClientIds)].length;

        //  Expert  (moyenne >= 8)
        const expertPrestataires = prestataires.filter(p => {
            const avisForP = avis.filter(a => a.prestataireId === p.utilisateurIdPre);
            if (avisForP.length === 0) return false;

            const avg = avisForP.reduce((acc, a) => acc + (a.note || 0), 0) / avisForP.length;
            return avg >= 7;
        }).length;

        //  Quality Products (% prestataires avec moyenne >= 7)
        const wellRated = prestataires.filter(p => {
            const avisForP = avis.filter(a => a.prestataireId === p.utilisateurIdPre);
            if (avisForP.length === 0) return false;

            const avg = avisForP.reduce((acc, a) => acc + (a.note || 0), 0) / avisForP.length;
            return avg >= 7;
        });
        const qualityPercent = prestataires.length > 0
            ? Math.round((wellRated.length / prestataires.length) * 100)
            : 0;

        //  Réponse JSON
        return res.json({
            successfulProjects,
            satisfiedCustomerCount,
            expertPrestataires,
            qualityPercent,
        });

    } catch (error) {
        console.error("Erreur statistiques:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;

module.exports = router;