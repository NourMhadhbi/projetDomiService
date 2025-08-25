const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const nodemailer = require('nodemailer');
router.use(express.json());
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
router.post('/ajout', async (req, res) => {
    try {
        const { nom, prenom, email, telephone, sujet, message } = req.body;

        if (!nom || !message || (!email && !telephone)) {
            return res.status(400).json({
                message: 'Nom, message et au moins un contact (email ou téléphone) sont requis'
            });
        }

        // Déterminer le contact à afficher et à utiliser comme replyTo
        const contact = email || telephone;
        const contactLabel = email ? 'Email' : 'Téléphone';

        const mailOptions = {
            from: '"DomiService" <domiservicesm@gmail.com>',
            to: 'domiservicesm@gmail.com',
            replyTo: email || undefined, // replyTo fonctionne uniquement si email fourni
            subject: `Nouveau message : ${sujet || 'Sans sujet'}`,
            html: `
                <h3>Nouveau message de contact</h3>
                <p><strong>Nom:</strong> ${nom} ${prenom || ''}</p>
                <p><strong>${contactLabel}:</strong> ${contact}</p>
                <p><strong>Message:</strong><br>${message}</p>
            `
        };

        // Envoyer email
        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Message enregistré et email envoyé' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});



// router.post('/ajout', async (req, res) => {
//     try {
//         const { utilisateurId, sujet, message } = req.body;

//         if (!utilisateurId || !message) {
//             return res.status(400).json({ message: 'Utilisateur et message sont requis' });
//         }

//         const utilisateur = await prisma.utilisateur.findUnique({
//             where: { id: Number(utilisateurId) },
//             include: { client: true, prestataire: true }
//         });

//         if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });

//         const newMessage = await prisma.contactMessage.create({
//             data: {
//                 message,
//                 sujet,
//                 clientId: utilisateur.client ? utilisateur.client.utilisateurIdCl : undefined,
//                 prestataireId: utilisateur.prestataire ? utilisateur.prestataire.utilisateurIdPre : undefined
//             }
//         });



//         const mailOptions = {
//             from: '"DomiService" <domiservicesm@gmail.com>',
//             to: 'domiservicesm@gmail.com',
//             replyTo: utilisateur.email,
//             subject: `Nouveau message : ${sujet || 'Sans sujet'}`,
//             html: `
//         <h3>Nouveau message de contact</h3>
//         <p><strong>Nom:</strong> ${utilisateur.nom} ${utilisateur.prenom}</p>
//         <p><strong>Email:</strong> ${utilisateur.email}</p>
//         <p><strong>Message:</strong><br>${message}</p>
//       `
//         };

//         // Envoyer email
//         await transporter.sendMail(mailOptions);

//         res.status(201).json({ message: 'Message enregistré et email envoyé', newMessage });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erreur serveur' });
//     }
// });

module.exports = router;
