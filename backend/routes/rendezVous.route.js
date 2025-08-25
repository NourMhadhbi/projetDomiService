const express = require('express');
const { PrismaClient } = require('@prisma/client')
const nodemailer = require('nodemailer');
const cron = require("node-cron");
const twilio = require('twilio');
const prisma = new PrismaClient()
const router = express.Router();
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'domiservicesm@gmail.com',
        pass: 'kwql ykzw kdhd kggh'
    },
    tls: {
        rejectUnauthorized: false
    }
})
const sendMailToUser = async (userEmail, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: '"DomiService" <domiservicesm@gmail.com>',
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
//Ajouter rendezVous
router.post("/ajoutRendezvous", async (req, res) => {
    const {
        date,
        lieuDintervention,
        raison,
        clientId,
        prestataireId,
    } = req.body;

    // Validation des champs obligatoires
    if (!date || !lieuDintervention || !clientId || !prestataireId) {
        return res.status(400).json({ message: "Champs obligatoires manquants." });
    }

    try {
        const client = await prisma.client.findUnique({
            where: { utilisateurIdCl: clientId },
            include: { utilisateur: true },
        });

        if (!client) {
            return res.status(404).json({ message: "Client non trouvé." });
        }

        const datePlus = new Date(new Date(date).setHours(new Date(date).getHours() + 1));

        const data = {
            date: datePlus,
            raison,
            lieuDintervention,
            statut: "EN_ATTENTE",
            client: { connect: { utilisateurIdCl: clientId } },
            prestataire: { connect: { utilisateurIdPre: prestataireId } }, 
        };

        const rendezVous = await prisma.rendezVous.create({ data });

        const utilisateurIdNotification = prestataireId;

        const prestataire = await prisma.prestataire.findUnique({
            where: { utilisateurIdPre: prestataireId },
            include: { utilisateur: true, entreprise: true },
        });

        if (!prestataire || !prestataire.utilisateur) {
            return res.status(404).json({ message: "Prestataire non trouvé." });
        }
        let destinataireNom = "";
        if (prestataire.entreprise) {
            destinataireNom = prestataire.entreprise.nomEntreprise;
        } else {
            destinataireNom = prestataire.utilisateur.nom;
        }


        const destinataireUser = prestataire.utilisateur;

        // Formatage date
        const dateFormattee = datePlus.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC'
        });

        // Formatage heure
        const heureFormattee = datePlus.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'UTC'
        });
        if (destinataireUser.email && destinataireUser.email.trim() !== "") {

            const sujet = "Nouveau rendez-vous - DomiService";
            const messageHtml = `
            <p>Bonjour ${destinataireNom},</p>
            <p>Un nouveau rendez-vous a été ajouté par le client ${client.utilisateur.nom} ${client.utilisateur.prenom} le ${dateFormattee} à ${heureFormattee}.</p>
            <p>Lieu : ${lieuDintervention}</p>
            <p>Cordialement,<br>DomiService</p>
        `;

            await sendMailToUser(destinataireUser.email, sujet, messageHtml);
        }


        const notification = await prisma.notification.create({
            data: {
                contenu: `Un nouveau rendez-vous avec le client ${client.utilisateur.nom} ${client.utilisateur.prenom} le ${dateFormattee} à ${heureFormattee} a été ajouté.`,
                utilisateurId: utilisateurIdNotification,

            },
        });

        res.status(201).json({ rendezVous, notification });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

//Modifier rendez Vous
router.put("/modifierRendezVous/:id", async (req, res) => {
    const id = Number(req.params.id);
    const {
        date,
        raison,
        lieuDintervention,
        clientId,
        prestataireId

    } = req.body;

    // if (!date || !heure || !lieuDintervention || !clientId) {
    //     return res.status(400).json({ message: "Champs obligatoires manquants." });
    // }

    try {
        const datePlus = new Date(new Date(date).setHours(new Date(date).getHours() + 1));


        const ancienRdv = await prisma.rendezVous.findUnique({
            where: { id },
            include: {
                client: { include: { utilisateur: true } },
                prestataire: { include: { utilisateur: true, entreprise: true } },

            },
        });
        const updatedRdv = await prisma.rendezVous.update({
            where: { id },
            data: {
                date: datePlus,
                raison,
                lieuDintervention,
                client: { connect: { utilisateurIdCl: clientId } },
                prestataire: { connect: { utilisateurIdPre: prestataireId } },

            },
        });


        let destinataireNom = "";
        if (ancienRdv.prestataire.entreprise) {
            destinataireNom = ancienRdv.prestataire.entreprise.nomEntreprise;
        } else {
            destinataireNom = ancienRdv.prestataire.utilisateur.nom;
        }

        const destinataireUser = ancienRdv.prestataire.utilisateur;

        if (destinataireUser?.email && destinataireUser.email.trim() !== "") {
            const sujet = "Modification de rendez-vous - DomiService";
            const messageHtml = `
           
                <p>Bonjour ${destinataireNom},</p>
                <p>Le rendez-vous du client ${ancienRdv.client.utilisateur.nom} ${ancienRdv.client.utilisateur.prenom} prévu le ${ancienRdv.date.toLocaleDateString()} a été modifié.</p>
                <p>Cordialement,<br>DomiService</p>
            `;
            await sendMailToUser(destinataireUser.email, sujet, messageHtml);
        }


        const destinataireNotif = prestataireId;
        if (destinataireNotif) {
            const messageNotif = `Le rendez-vous du client ${ancienRdv.client.utilisateur.nom} ${ancienRdv.client.utilisateur.prenom} initialement prévu le ${ancienRdv.date.toLocaleDateString()} a été modifié.`;
            await prisma.notification.create({
                data: {
                    contenu: messageNotif,
                    utilisateurId: destinataireNotif,

                },
            });
        }

        res.json({
            updatedRdv,
            message: "Rendez-vous modifié, notification interne et mail envoyés.",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

//supprimer rendezVous
router.delete("/supprimerRendezVous/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {

        const rdv = await prisma.rendezVous.findUnique({
            where: { id },
            include: {
                client: { include: { utilisateur: true } },
                prestataire: { include: { utilisateur: true, entreprise: true } },

            },
        });

        await prisma.rendezVous.delete({
            where: { id },
        });
        let destinataireNom = "";
        if (rdv.prestataire.entreprise) {
            destinataireNom = rdv.prestataire.entreprise.nomEntreprise;
        } else {
            destinataireNom = rdv.prestataire.utilisateur.nom;
        }


        const destinataireUser = rdv.prestataire.utilisateur;

        if (destinataireUser?.email && destinataireUser.email.trim() !== "") {
            const sujet = "Suppression de rendez-vous - DomiService";
            const messageHtml = `
           
                <p>Bonjour ${destinataireNom},</p>
                <p>Le rendez-vous du client ${rdv.client.utilisateur.nom} ${rdv.client.utilisateur.prenom} prévu le ${rdv.date.toLocaleDateString()} a été supprimé.</p>
                <p>Cordialement,<br>DomiService</p>
            `;
            await sendMailToUser(destinataireUser.email, sujet, messageHtml);
        }
        const destinataireNotif = rdv.prestataireId;
        if (destinataireNotif) {
            await prisma.notification.create({
                data: {
                    contenu: `Le rendez-vous du client ${rdv.client.utilisateur.nom} ${rdv.client.utilisateur.prenom} prévu le ${rdv.date.toLocaleDateString()} a été supprimé.`,
                    utilisateurId: destinataireNotif,
                },
            });
        }

        res.json({ message: "Rendez-vous supprimé et notifications envoyées." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
//confirmer rendezVous
router.put("/confirmerRDV/:id", async (req, res) => {
    const id = Number(req.params.id);
    try {
        const confirmerRDV = await prisma.rendezVous.update({
            where: { id },
            data: { statut: "CONFIRME" },
            include: {
                prestataire: {
                    include: {
                        utilisateur: true,
                        service: true,
                        entreprise: true,
                    },
                },

                client: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
        });

        const destinataireNotif = confirmerRDV.clientId;
        const client = confirmerRDV.client;
        const lieu = confirmerRDV.lieuDintervention;

        let nomAuteur = "";
        let nomService = "";

        if (confirmerRDV.prestataire?.entreprise) {

            nomAuteur = confirmerRDV.prestataire.entreprise.nomEntreprise;
        } else if (confirmerRDV.prestataire) {

            nomAuteur = confirmerRDV.prestataire.utilisateur.nom;
        }


        nomService = confirmerRDV.prestataire.service.nom;
        const dateRDV = new Date(confirmerRDV.date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC'
        });

        const heureFormattee = new Date(confirmerRDV.date).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        });

        const message = `Votre rendez-vous a été confirmé par "${nomAuteur}" pour le service "${nomService}". Il aura lieu le ${dateRDV} à ${heureFormattee}, au lieu suivant : ${lieu}.`;

        if (destinataireNotif) {
            await prisma.notification.create({
                data: {
                    contenu: message,
                    utilisateurId: destinataireNotif,

                },
            });
        }
        if (client.utilisateur.email && client.utilisateur.email.trim() !== "") {
            const sujet = "Confirmation de votre rendez-vous - DomiService";
            const messageHtml = `
            <p>Bonjour ${client.utilisateur.prenom},</p>
            <p>Nous vous confirmons que votre rendez-vous avec <strong>${nomAuteur}</strong> (service : <strong>${nomService}</strong>) a bien été validé.</p>
            <p><strong>Date :</strong> ${dateRDV} à ${heureFormattee}<br>
            <strong>Lieu :</strong> ${lieu}</p>
            <p>Merci de votre confiance.<br>
            L’équipe DomiService</p>
        `;

            await sendMailToUser(client.utilisateur.email, sujet, messageHtml);
        }
        res.json({
            confirmerRDV,
            message: "Rendez-vous confirmé, notification interne et mail envoyés.",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
//Annuler rendezVous
router.put("/annulerRDV/:id", async (req, res) => {
    const id = Number(req.params.id);
    try {
        const annulerRDV = await prisma.rendezVous.update({
            where: { id },
            data: { statut: "ANNULE" },
            include: {
                prestataire: {
                    include: {
                        utilisateur: true,
                        service: true,
                        entreprise: true,
                    },
                },

                client: {
                    include: {
                        utilisateur: true,
                    },
                },
            },
        });

        const destinataireNotif = annulerRDV.clientId;
        const client = annulerRDV.client;
        const lieu = annulerRDV.lieuDintervention;

        let nomAuteur = "";
        let nomService = "";

        if (annulerRDV.prestataire?.entreprise) {

            nomAuteur = annulerRDV.prestataire.entreprise.nomEntreprise;
        } else if (annulerRDV.prestataire) {

            nomAuteur = annulerRDV.prestataire.utilisateur.nom;
        }

        nomService = annulerRDV.prestataire.service.nom;
        const dateRDV = new Date(annulerRDV.date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC'
        });

        const heureFormattee = new Date(annulerRDV.date).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        });
        const message = `Votre rendez-vous prévu avec "${nomAuteur}" pour le service "${nomService}" le ${dateRDV} à ${heureFormattee}, au lieu : ${lieu}, a été annulé.`;

        if (destinataireNotif) {
            await prisma.notification.create({
                data: {
                    contenu: message,
                    utilisateurId: destinataireNotif,

                },
            });
        }
        if (client.utilisateur.email && client.utilisateur.email.trim() !== "") {
            const sujet = "Annulation de votre rendez-vous - DomiService";
            const messageHtml = `
            <p>Bonjour ${client.utilisateur.prenom},</p>
            <p>Nous vous informons que votre rendez-vous avec <strong>${nomAuteur}</strong> (service : <strong>${nomService}</strong>) prévu le ${dateRDV} à ${heureFormattee} a été <strong>annulé</strong>.</p>
            <p><strong>Lieu prévu :</strong> ${lieu}</p>
            <p>Nous restons à votre disposition pour toute nouvelle prise de rendez-vous.</p>
            <p>Merci de votre compréhension.<br>
            L’équipe DomiService</p>
        `;

            await sendMailToUser(client.utilisateur.email, sujet, messageHtml);
        }
        res.json({
            annulerRDV,
            message: "Rendez-vous annulé, notification interne et mail envoyés.",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
//  TERMINE rendez Vous 
router.put("/terminerRDV/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const terminerRDV = await prisma.rendezVous.update({
            where: { id },
            data: { statut: "TERMINE" },
        });

        res.json({
            terminerRDV,
            message: "Rendez-vous terminé avec succès.",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

//envoyer notification avant jour et le jour j de rendez vous 
cron.schedule("0 9 * * *", async () => {
    try {
        const dansDeuxJours = new Date();
        dansDeuxJours.setDate(dansDeuxJours.getDate() + 1);
        const debutJournee = new Date(
            dansDeuxJours.getFullYear(),
            dansDeuxJours.getMonth(),
            dansDeuxJours.getDate()
        );

        const finJournee = new Date(
            dansDeuxJours.getFullYear(),
            dansDeuxJours.getMonth(),
            dansDeuxJours.getDate() + 1
        );

        const rdvs = await prisma.rendezVous.findMany({
            where: {
                date: {
                    gte: debutJournee,
                    lt: finJournee,
                },
                statut: "CONFIRME",
            },
            include: {
                client: { include: { utilisateur: true } },
                prestataire: { include: { utilisateur: true, service: true, entreprise: true } },

            },
        });


        for (const rdv of rdvs) {
            //  Client 
            const clientUser = rdv.client.utilisateur;
            const emailClient = clientUser.email;
            const prenomClient = clientUser.prenom;
            const numTelClient = rdv.client?.numTel;

            // Prestataire (ou entreprise) 
            const prestataire = rdv.prestataire;
            const prestataireUser = prestataire.utilisateur;
            const emailPresta = prestataireUser.email;

            const numTelPresta = prestataire.numTel;

            const nomIntervenant = prestataire.entreprise ? prestataire.entreprise.nomEntreprise : prestataireUser.nom;

            const libelleService = prestataire.service?.nom || "";
            const dateFormattee = new Date(rdv.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC'
            });
            // Formatage heure locale 
            const heureFormattee = new Date(rdv.date).toLocaleDateString('fr-FR', {
                timeZone: 'UTC',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
            const lieuRdv = rdv.lieuDintervention;

            const contenuNotif = `Rappel : votre rendez-vous avec ${nomIntervenant},pour le service (${libelleService}) aura lieu le ${dateFormattee} à ${heureFormattee}.`;

            await prisma.notification.create({
                data: {
                    contenu: contenuNotif,
                    utilisateurId: rdv.client.utilisateurIdCl,

                },
            });

            if (emailClient && emailClient.trim() !== "") {
                const sujetEmail = "Rappel : Rendez-vous - DomiService";
                const contenuEmail = `
  <p>Bonjour ${prenomClient},</p>

  <p>Nous vous rappelons que votre rendez-vous avec <strong>${nomIntervenant}</strong>, pour le service <strong>${libelleService}</strong>, est prévu le <strong>${dateFormattee}</strong> à <strong>${heureFormattee}</strong>, à l’adresse suivante : <strong>${lieuRdv}</strong>.</p>

  <p>Merci pour votre confiance.<br>
  <strong>L’équipe DomiService</strong></p>
`;

                console.log(`Envoi du rappel email à : ${emailClient}`);
                await sendMailToUser(emailClient, sujetEmail, contenuEmail);
            } else if (numTelClient && numTelClient.trim() !== "") {
                // Envoi du SMS si pas d'email mais numéro disponible
                const messageSms = `Bonjour ${prenomClient}, rappel: votre rendez-vous avec ${nomIntervenant} (${libelleService}) est prévu le ${dateFormattee} à ${heureFormattee}. Merci, DomiService.`;
                //ouvrir dernier jours de projet
                // try {
                //     const toNumber = numTelClient.startsWith('+') ? numTelClient : '+216' + numTelClient;
                //     await twilioClient.messages.create({
                //         body: messageSms,
                //         from: process.env.TWILIO_PHONE_NUMBER,
                //         to: toNumber
                //     });
                //     console.log(`SMS de rappel envoyé au ${toNumber}`);
                // } catch (error) {
                //     console.error(`Erreur en envoyant SMS au ${numTelClient} :`, error);
                // }
            } else {
                console.warn(`Pas d'email ni de numéro téléphone valide pour le client ${prenomClient}`);
            }

            // --- Créer notification pour prestataire ---
            await prisma.notification.create({
                data: {
                    contenu: contenuNotif,
                    utilisateurId: prestataireUser.id,

                },
            });

            // --- Envoi mail/SMS au prestataire ---
            if (emailPresta && emailPresta.trim() !== "") {
                const sujetEmailPresta = "Rappel : Rendez-vous - DomiService";
                const contenuEmailPresta = `
<p>Bonjour ${nomIntervenant},</p>
<p>Nous vous rappelons que vous avez un rendez-vous avec le client <strong>${clientUser.nom} ${clientUser.prenom}</strong>, pour le service <strong>${libelleService}</strong>, prévu le <strong>${dateFormattee}</strong> à <strong>${heureFormattee}</strong>, au lieu suivant : <strong>${lieuRdv}</strong>.</p>
<p>Merci pour votre collaboration.<br><strong>L’équipe DomiService</strong></p>
        `;
                await sendMailToUser(emailPresta, sujetEmailPresta, contenuEmailPresta);
            } else if (numTelPresta && numTelPresta.trim() !== "") {
                // Envoi SMS au prestataire
                // const messageSmsPresta = `Bonjour ${nomIntervenant}, rappel: rendez-vous avec ${clientUser.nom} ${clientUser.prenom} (${libelleService}) prévu le ${dateFormattee} à ${heureFormattee}. Merci, DomiService.`;
                // try {
                //         const toNumberPresta = numTelPresta.startsWith('+') ? numTelPresta : '+216' + numTelPresta;
                //     await twilioClient.messages.create({
                //         body: messageSmsPresta,
                // from: process.env.TWILIO_PHONE_NUMBER,
                // to: toNumberPresta
                //     });
                //     console.log(`SMS de rappel envoyé au ${toNumber}`);
                // } catch (error) {
                //     console.error(`Erreur en envoyant SMS au ${numTelClient} :`, error);
                // }
            }
        }

        console.log("Tous les rappels ont été envoyés avec notifications.");

    } catch (error) {
        console.error("Erreur lors de l'envoi des rappels :", error);
    }
});

//get RendezVous by client 

router.get('/rendezVousByClient/:idClient', async (req, res) => {
    const idClient = Number(req.params.idClient);

    try {
        const rendezVous = await prisma.rendezVous.findMany({
            where: {
                client: {
                    utilisateurIdCl: idClient
                }
            },
            orderBy: {
                date: 'asc'
            },
            include: {
                client: {
                    include: { utilisateur: true }
                },
                prestataire: {
                    include: {
                        utilisateur: true,
                        entreprise: true
                    }
                }

            }
        });

        res.json(rendezVous);
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous du client :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
// GET rendez-vous d’un presetatire
// router.get('/getRendezVousByPrestataire/:idPrestataire', async (req, res) => {
//     const idPrestataire = Number(req.params.idPrestataire);

//     try {
//         const rendezVous = await prisma.rendezVous.findMany({
//             where: {
//                 prestataire: {
//                     utilisateurIdPre: idPrestataire
//                 }
//             },
//             orderBy: {
//                 date: 'asc'
//             },
//             include: {
//                 prestataire: {
//                     include: { utilisateur: true }
//                 },

//             }
//         });

//         res.json(rendezVous);
//     } catch (error) {
//         console.error("Erreur lors de la récupération des rendez-vous du prestataire :", error);
//         res.status(500).json({ message: "Erreur serveur" });
//     }
// });
// GET rendez-vous d’un entreprise
// router.get('/getRendezVousByEntreprise/:idEntreprise', async (req, res) => {
//     const idEntreprise = Number(req.params.idEntreprise);

//     try {
//         const rendezVous = await prisma.rendezVous.findMany({
//             where: {
//                 entreprise: {
//                     utilisateurIdCl: idEntreprise
//                 }
//             },
//             orderBy: {
//                 date: 'asc'
//             },
//             include: {
//                 entreprise: {
//                     include: { utilisateur: true }
//                 },

//             }
//         });

//         res.json(rendezVous);
//     } catch (error) {
//         console.error("Erreur lors de la récupération des rendez-vous du entreprise :", error);
//         res.status(500).json({ message: "Erreur serveur" });
//     }
// });
// Afficher un rendez-vous avec détails
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const rendezVous = await prisma.rendezVous.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                client: {
                    include: {
                        utilisateur: true,
                    },
                },
                prestataire: {
                    include: {
                        utilisateur: true,
                        service: true,
                        entreprise: true,
                    },
                },

            },
        });

        res.json(rendezVous);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
router.get('/rendezVousByintervenant/:idIntervenant', async (req, res) => {
    const id = Number(req.params.idIntervenant);

    try {
        const rendezVous = await prisma.rendezVous.findMany({
            where: {
                prestataire: {
                    utilisateurIdPre: id
                }
            },
            orderBy: { date: 'asc' },
            include: {
                prestataire: {
                    include: {
                        utilisateur: true,
                        entreprise: true,   
                        service: true
                    }
                },
                client: {
                    include: {
                        utilisateur: true
                    }
                }
            }
        });

        if (rendezVous.length > 0) {
           
            const role = rendezVous[0].prestataire.entreprise ? 'ENTREPRISE' : 'PRESTATAIRE';

            return res.json({ role, rendezVous });
        }

        res.status(404).json({ message: 'Aucun rendez-vous trouvé pour cet intervenant' });

    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


module.exports = router;