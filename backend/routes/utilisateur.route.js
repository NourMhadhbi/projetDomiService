const express = require('express');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const prisma = new PrismaClient();
const router = express.Router();
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'domiservicesmm@gmail.com',
        pass: 'qyxx txcw vzgf lvdu' // Remplace par ton vrai mdp ou mieux variable env
    },
    tls: { rejectUnauthorized: false }
});

const generateAccessToken = (user) => {
    return jwt.sign({ iduser: user.id, role: user.role }, process.env.SECRET, { expiresIn: '1y' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ iduser: user.id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
};
// function authMiddleware(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

//     const token = authHeader.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'Token manquant' });

//     jwt.verify(token, process.env.SECRET, (err, user) => {
//         if (err) return res.status(403).json({ message: 'Token invalide' });
//         req.user = user;
//         next();
//     });
// }

// async function geocodeAdresse(adresse) {
//     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresse)}`;
//     const response = await fetch(url);
//     const data = await response.json();

//     if (!data || data.length === 0) return null;

//     const { lat, lon } = data[0];
//     return {
//         latitude: parseFloat(lat),
//         longitude: parseFloat(lon),
//     };
// }
async function geocodeAdresse(adresse, ville) {
    // Nettoyer les caractères spéciaux
    let adresseClean = adresse.replace(/[،]/g, ',').trim();
    let villeClean = ville ? ville.replace(/[،]/g, ',').trim() : '';

    // Créer la requête finale
    const query = villeClean ? `${adresseClean}, ${villeClean}` : adresseClean;

    // Log pour debug
    console.log("Recherche géocodage:", query);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data || data.length === 0) {
            console.log("Aucune coordonnée trouvée pour:", query);
            return null;
        }

        const { lat, lon } = data[0];
        console.log("Coordonnées récupérées :", lat, lon);

        return {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
        };
    } catch (err) {
        console.error("Erreur géocodage :", err);
        return null;
    }
}

// router.post('/register', async (req, res) => {

//     try {
//         await prisma.$transaction(async (prisma) => {
//             const {
//                 nom,
//                 prenom,
//                 email,
//                 numTel,
//                 motDePasse,
//                 role,
//                 genre,
//                 adresse,
//                 ville,
//                 tarifDeplacement,
//                 serviceId,
//                 nomEntreprise,
//                 Spécialite, descriptionCourte,
//                 siteWeb,
//                 identifiant
//             } = req.body;
//             const emailCleaned = email && email.trim() !== "" ? email.trim() : undefined;

//             if (emailCleaned) {
//                 const existingClient = await prisma.utilisateur.findFirst({
//                     where: {
//                         email: emailCleaned,
//                         client: {
//                             isActive: true
//                         }
//                     },
//                     include: {
//                         client: true
//                     }
//                 });
//                 const existingPrestataire = await prisma.utilisateur.findFirst({
//                     where: {
//                         email: emailCleaned,
//                         prestataire: {
//                             isActive: true
//                         }
//                     },
//                     include: {
//                         prestataire: true
//                     }
//                 });

//                 if (existingClient || existingPrestataire) {
//                     return res.status(400).send({ success: false, message: "Cet email est déjà utilisé." });
//                 }
//             } else if (numTel) {
//                 const existingClient = await prisma.client.findFirst({ where: { numTel, isActive: true } });
//                 const existingPrestataire = await prisma.prestataire.findFirst({ where: { numTel, isActive: true } });
//                 if (existingClient || existingPrestataire) {
//                     return res.status(400).send({ success: false, message: "Numéro de téléphone déjà utilisé." });
//                 }
//             } else {
//                 return res.status(400).send({ success: false, message: "Email ou numéro de téléphone requis." });
//             }

//             const getImageByRole = (role) => {
//                 switch (role) {
//                     case 'ADMIN':
//                         return 'https://res.cloudinary.com/dmbkofiro/image/upload/v1713924474/images/xg1htshcaarthxvnj9vg.png';
//                     case 'CLIENT':
//                         return 'https://res.cloudinary.com/dmbkofiro/image/upload/v1713923916/images/ze5ytyshmweusb4gypsr.png';
//                     case 'PRESTATAIRE':
//                         return 'https://res.cloudinary.com/dmbkofiro/image/upload/v1713923916/images/xdvavia4ci9f25eywjxu.png';
//                     case 'ENTREPRISE':
//                         return 'https://res.cloudinary.com/dmbkofiro/image/upload/v1713923916/images/z2i2yr8gsct1qrgh1viv.png';
//                     default:
//                         return " ";
//                 }
//             };

//             const salt = await bcrypt.genSalt(10);
//             const motDePasseCrypte = await bcrypt.hash(motDePasse, salt);
//             const coords = await geocodeAdresse(`${adresse}, ${ville}`);
//             const userCreate = await prisma.utilisateur.create({
//                 data: {
//                     nom,
//                     prenom,
//                     email: emailCleaned,
//                     role,
//                     motDePasse: motDePasseCrypte,
//                     genre,
//                     image: getImageByRole(role)
//                 }
//             });

//             if (userCreate.role === 'CLIENT') {
//                 // const { adresse, ville, numTel } = req.body;
//                 const client = await prisma.client.create({
//                     data: {
//                         utilisateurIdCl: userCreate.id,
//                         numTel,
//                         adresse,
//                         ville,
//                         latitude: coords?.latitude ?? null,
//                         longitude: coords?.longitude ?? null,
//                     },
//                     include: { utilisateur: true }
//                 });
//                 if (email && email.trim() !== '') {

//                     const mailOption = {
//                         from: '"DomiService" <domiservicesmm@gmail.com>',
//                         to: userCreate.email,
//                         subject: 'Validation du compte',
//                         html: `  
//             <h2>Bienvenue, ${userCreate.nom}!</h2>
//             <h4>Cher(e) ${userCreate.nom},
//             Nous vous remercions pour votre inscription sur Domi Service ! Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :
//             <p><a href="http://${req.headers.host}/api/utilisateur/activeClient/utilisateur?email=${userCreate.email}">cliquez ici</a></p>.
//             Une fois votre compte activé, vous pourrez accéder à toutes les fonctionnalités de notre plateforme</h4>
//             <p>Cordialement,</p>
//             <p>----------</p>
//             <p>DomiServicer</p>
//           `
//                     };
//                     transporter.sendMail(mailOption, (error, info) => {
//                         if (error) console.log(error);
//                         else console.log('la validation du compte a été envoyée à votre compte');
//                     });

//                     return res.status(202).send({ success: true, message: "Succes", user: client });
//                 }
//                 else if (numTel && numTel.trim() !== '') {
//                     try {
//                         const activationLink = `https://${req.headers.host}/api/utilisateur/activeClient/utilisateur?numTel=${numTel}`;
//                         await twilioClient.messages.create({
//                             body: `Bonjour ${userCreate.nom}, merci pour votre inscription sur Domi Service. Activez votre compte ici : ${activationLink}`,
//                             from: process.env.TWILIO_PHONE_NUMBER,
//                             to: numTel.startsWith('+') ? numTel : '+216' + numTel
//                         }).then(message => {
//                             console.log('Message envoyé, SID :', message.sid);
//                         }).catch(error => {
//                             console.error('Erreur en envoyant SMS:', error);
//                         });
//                     } catch (smsError) {
//                         console.error(`Erreur lors de l'envoi du SMS de validation:`, smsError);
//                     }
//                 }
//             }
//             else if (userCreate.role === 'PRESTATAIRE') {
//                 // const { adresse, ville, numTel, tarifDeplacement, serviceId } = req.body;

//                 // IMPORTANT : selon ton modèle, Prestataire a un champ serviceId et entrepriseId, et utilisateurIdPre
//                 const prestataire = await prisma.prestataire.create({
//                     data: {
//                         utilisateurIdPre: userCreate.id,
//                         adresse,
//                         ville,
//                         numTel,
//                         latitude: coords?.latitude ?? null,
//                         longitude: coords?.longitude ?? null,
//                         descriptionCourte, Spécialite,
//                         tarifDeplacement: tarifDeplacement ? Number(tarifDeplacement) : 0.0,
//                         serviceId: Number(serviceId)
//                     },
//                     include: { utilisateur: true }
//                 });
//                 await prisma.notification.create({
//                     data: {
//                         contenu: `Nouveau compte PRESTATAIRE créé. Veuillez activer le compte de ${prestataire.utilisateur.nom} ${prestataire.utilisateur.prenom}.`,
//                         utilisateurId: prestataire.utilisateurIdPre
//                     }
//                 });
//                 return res.status(201).send({ success: true, message: "Compte created successfully", user: prestataire });
//             }
//             else if (userCreate.role === 'ENTREPRISE') {
//                 // const { nomEntreprise, adresse, ville, numTel, tarifDeplacement, siteWeb, identifiant, serviceId } = req.body;


//                 const prestataire = await prisma.prestataire.create({
//                     data: {
//                         utilisateurIdPre: userCreate.id,
//                         adresse,
//                         ville,
//                         numTel,
//                         latitude: coords?.latitude ?? null,
//                         longitude: coords?.longitude ?? null,
//                         tarifDeplacement: tarifDeplacement ? Number(tarifDeplacement) : 0.0,
//                         serviceId: Number(serviceId),
//                         isActive: false
//                     }
//                 });


//                 const entreprise = await prisma.entreprise.create({
//                     data: {
//                         prestataireId: prestataire.utilisateurIdPre,
//                         nomEntreprise,
//                         siteWeb,
//                         identifiant
//                     },
//                     include: {
//                         prestataire: true
//                     }
//                 });
//                 await prisma.notification.create({
//                     data: {
//                         contenu: `Nouveau compte ENTREPRISE créé. Veuillez activer le compte de ${entreprise.nomEntreprise}.`,
//                         utilisateurId: prestataire.utilisateurIdPre
//                     }
//                 });
//                 return res.status(201).send({ success: true, message: "Compte created successfully", user: entreprise });
//             }
//             else {
//                 // Admin 
//                 const admin = await prisma.admin.create({
//                     data: {
//                         utilisateurIdAd: userCreate.id
//                     }
//                 });
//                 return res.status(201).send({ success: true, message: "Compte created successfully", user: admin });
//             }
//         });
//         if (!coords) {
//             return res.status(400).json({ error: "Impossible de géocoder l'adresse" });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(500).send({ success: false, message: err.message });
//     }
// });

// router.get('/profil', authMiddleware, async (req, res) => {
//     try {
//         // req.user est défini dans authMiddleware
//         const user = await prisma.utilisateur.findUnique({
//             where: { id: req.user.iduser }
//         });
//         if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

//         const { motDePasse, ...userData } = user;
//         res.json({ user: userData });
//     } catch (error) {
//         res.status(500).json({ message: "Erreur serveur" });
//     }
// });
router.post('/register', async (req, res) => {
    try {
        await prisma.$transaction(async (prisma) => {
            const {
                nom,
                prenom,
                email,
                numTel,
                motDePasse,
                role,
                genre,
                adresse,
                ville,
                tarifDeplacement,
                serviceId,
                nomEntreprise,
                competence, experience,
                Spécialite, descriptionCourte,
                siteWeb,
                identifiant
            } = req.body;

            const emailCleaned = email && email.trim() !== "" ? email.trim() : undefined;

            if (emailCleaned) {
                const existingUserEmail = await prisma.utilisateur.findFirst({
                    where: {
                        email: emailCleaned,
                        OR: [
                            { client: { isActive: true } },
                            { prestataire: { isActive: true } }
                        ]
                    }
                });
                if (existingUserEmail) {
                    return res.status(400).send({ success: false, message: "Cet email est déjà utilisé." });
                }
            }

            if (numTel && numTel.trim() !== "") {
                const existingUserTel = await prisma.utilisateur.findFirst({
                    where: {
                        OR: [
                            { client: { numTel, isActive: true } },
                            { prestataire: { numTel, isActive: true } }
                        ]
                    }
                });
                if (existingUserTel) {
                    return res.status(400).send({ success: false, message: "Numéro de téléphone déjà utilisé." });
                }
            } else if (!emailCleaned) {
                return res.status(400).send({ success: false, message: "Email ou numéro de téléphone requis." });
            }
            const admin = await prisma.utilisateur.findFirst({
                where: { role: 'ADMIN' }
            });
            const getImageByRole = (role) => {
                switch (role) {
                    case 'ADMIN':
                        return 'https://res.cloudinary.com/dkhjej8yx/image/upload/v1760877894/admin-icon-vector_fholxu.jpg';
                    case 'CLIENT':
                        return 'https://res.cloudinary.com/dkhjej8yx/image/upload/v1760877823/client_6009978_o69jxq.png';
                    case 'PRESTATAIRE':
                        return 'https://res.cloudinary.com/dkhjej8yx/image/upload/v1760877824/prestataire_pivknb.png';
                    case 'ENTREPRISE':
                        return 'https://res.cloudinary.com/dkhjej8yx/image/upload/v1760878175/images_h3rzon.png';
                    default:
                        return " ";
                }
            };

            const salt = await bcrypt.genSalt(10);
            const motDePasseCrypte = await bcrypt.hash(motDePasse, salt);
            const coords = await geocodeAdresse(adresse, ville);

            const userCreate = await prisma.utilisateur.create({
                data: {
                    nom,
                    prenom,
                    email: emailCleaned,
                    role,
                    motDePasse: motDePasseCrypte,
                    genre,
                    image: getImageByRole(role)
                }
            });

            if (userCreate.role === 'CLIENT') {
                const client = await prisma.client.create({
                    data: {
                        utilisateurIdCl: userCreate.id,
                        numTel,
                        adresse,
                        ville,
                        latitude: coords?.latitude ?? null,
                        longitude: coords?.longitude ?? null,
                    },
                    include: { utilisateur: true }
                });
                if (email && email.trim() !== '') {
                    const mailOption = {
                        from: '"DomiService" <domiservicesmm@gmail.com>',
                        to: userCreate.email,
                        subject: 'Validation du compte',
                        html: `  
            <h2>Bienvenue, ${userCreate.nom}!</h2>
            <h4>Cher(e) ${userCreate.nom},
            Nous vous remercions pour votre inscription sur Domi Service ! Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :
            <p><a href="http://${req.headers.host}/api/utilisateur/activeClient/utilisateur?email=${userCreate.email}">cliquez ici</a></p>.
            Une fois votre compte activé, vous pourrez accéder à toutes les fonctionnalités de notre plateforme</h4>
            <p>Cordialement,</p>
            <p>----------</p>
            <p>DomiServicer</p>
          `
                    };
                    transporter.sendMail(mailOption, (error, info) => {
                        if (error) console.log(error);
                        else console.log('la validation du compte a été envoyée à votre compte');
                    });
                    return res.status(202).send({ success: true, message: "Succes", user: client });
                }
                else if (numTel && numTel.trim() !== '') {
                    try {
                        const activationLink = `https://${req.headers.host}/api/utilisateur/activeClient/utilisateur?numTel=${numTel}`;
                        await twilioClient.messages.create({
                            body: `Bonjour ${userCreate.nom}, merci pour votre inscription sur Domi Service. Activez votre compte ici : ${activationLink}`,
                            from: process.env.TWILIO_PHONE_NUMBER,
                            to: numTel.startsWith('+') ? numTel : '+216' + numTel
                        }).then(message => {
                            console.log('Message envoyé, SID :', message.sid);
                        }).catch(error => {
                            console.error('Erreur en envoyant SMS:', error);
                        });
                    } catch (smsError) {
                        console.error(`Erreur lors de l'envoi du SMS de validation:`, smsError);
                    }
                    return res.status(202).send({ success: true, message: "Succes", user: client });
                }
            }
            else if (userCreate.role === 'PRESTATAIRE') {
                const prestataire = await prisma.prestataire.create({
                    data: {
                        utilisateurIdPre: userCreate.id,
                        adresse,
                        ville,
                        numTel,
                        latitude: coords?.latitude ?? null,
                        longitude: coords?.longitude ?? null,
                        competence, experience,
                        descriptionCourte, Spécialite,
                        tarifDeplacement: tarifDeplacement ? Number(tarifDeplacement) : 0.0,
                        serviceId: Number(serviceId)
                    },
                    include: { utilisateur: true }
                });

                await prisma.notification.create({
                    data: {
                        contenu: `Nouveau compte PRESTATAIRE créé. Veuillez activer le compte de ${prestataire.utilisateur.nom} ${prestataire.utilisateur.prenom}.`,
                        utilisateurId: admin.id
                    }
                });
                return res.status(201).send({ success: true, message: "Compte created successfully", user: prestataire });
            }
            else if (userCreate.role === 'ENTREPRISE') {
                const prestataire = await prisma.prestataire.create({
                    data: {
                        utilisateurIdPre: userCreate.id,
                        adresse,
                        ville,
                        numTel,
                        latitude: coords?.latitude ?? null,
                        longitude: coords?.longitude ?? null, competence, experience,
                        tarifDeplacement: tarifDeplacement ? Number(tarifDeplacement) : 0.0,
                        serviceId: Number(serviceId),
                        isActive: false
                    }
                });
                const entreprise = await prisma.entreprise.create({
                    data: {
                        prestataireId: prestataire.utilisateurIdPre,
                        nomEntreprise,
                        siteWeb,
                        identifiant
                    },
                    include: {
                        prestataire: true
                    }
                });
                await prisma.notification.create({
                    data: {
                        contenu: `Nouveau compte ENTREPRISE créé. Veuillez activer le compte de ${entreprise.nomEntreprise}.`,
                        utilisateurId: admin.id
                    }
                });
                return res.status(201).send({ success: true, message: "Compte created successfully", user: entreprise });
            }
            else {
                const admin = await prisma.admin.create({
                    data: {
                        utilisateurIdAd: userCreate.id
                    }
                });
                return res.status(201).send({ success: true, message: "Compte created successfully", user: admin });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: err.message });
    }
});


//activer le compte
router.get('/activeClient/utilisateur', async (req, res) => {
    try {
        const { email, numTel } = req.query;
        let user;

        if (email) {
            user = await prisma.utilisateur.findFirst({ where: { email } });
        } else if (numTel) {
            const client = await prisma.client.findFirst({ where: { numTel } });
            if (client) {
                user = await prisma.utilisateur.findUnique({ where: { id: client.utilisateurIdCl } });
            }
        }

        if (!user) {
            return res.status(404).send("Utilisateur non trouvé.");
        }

        const utilisateur = await prisma.client.update({
            data: { isActive: true },
            where: { utilisateurIdCl: user.id },
            include: { utilisateur: true }
        });
        res.send(`
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmation d'activation du compte</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 20px;
                    }
                    
                    .modal-container {
                        max-width: 500px;
                        width: 100%;
                        background: #fff;
                        border-radius: 16px;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                        overflow: hidden;
                        animation: fadeIn 0.5s ease-out;
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    .modal-header {
                        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                        color: white;
                        padding: 15px 20px;
                        text-align: center;
                        position: relative;
                    }
                    
                    .icon-container {
                        width: 80px;
                        height: 80px;
                        background-color: rgba(255, 255, 255, 0.2);
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: 0 auto 15px;
                        animation: pulse 2s infinite;
                    }
                    
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                    
                  .icon-container i {
    font-size: 28px; 
    color: white;
}

.modal-header h2 {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 0; 
    letter-spacing: 0.5px;
}
                    
                    .modal-body {
                        padding: 30px;
                        text-align: center;
                    }
                    
                    .modal-body p {
                        color: #636363;
                        line-height: 1.6;
                        margin-bottom: 25px;
                        font-size: 16px;
                    }
                    
                    .btn {
                        display: inline-block;
                        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                        color: white;
                        text-decoration: none;
                        padding: 14px 30px;
                        border-radius: 50px;
                        font-weight: 600;
                        font-size: 16px;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
                        position: relative;
                        overflow: hidden;
                        z-index: 1;
                    }
                    
                    .btn:before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
                        opacity: 0;
                        transition: opacity 0.3s ease;
                        z-index: -1;
                    }
                    
                    .btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 7px 20px rgba(106, 17, 203, 0.4);
                    }
                    
                    .btn:hover:before {
                        opacity: 1;
                    }
                    
                    .btn:active {
                        transform: translateY(0);
                    }
                    
                    .modal-footer {
                        padding: 20px 30px;
                        text-align: center;
                        background-color: #f9f9f9;
                        border-top: 1px solid #eee;
                        font-size: 14px;
                        color: #888;
                    }
                    
                    @media (max-width: 576px) {
                        .modal-container {
                            width: 95%;
                            max-width: none;
                        }
                        
                        .modal-header {
                            padding: 20px;
                        }
                        
                        .icon-container {
                            width: 70px;
                            height: 70px;
                        }
                        
                        .modal-body {
                            padding: 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="modal-container">
                    <div class="modal-header">
                        <div class="icon-container">
                            <i class="fas fa-check"></i>
                        </div>
                        <h2>Activation réussie</h2>
                    </div>
                    <div class="modal-body">
                        <p>Votre compte a été activé avec succès! Vous pouvez maintenant vous connecter et profiter de toutes nos fonctionnalités.</p>
                        <a href="http://localhost:5173/login" class="btn">Se connecter</a>
                    </div>
                    <div class="modal-footer">
                        <p>Merci de nous rejoindre ! © 2025 Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message })
    }
})
//activer compte Prestataire et entrprise 
router.put('/activeUtilisateur', async (req, res) => {
    try {
        const { id } = req.query;
        const user = await prisma.utilisateur.findUnique({
            where: { id: Number(id) },
            include: {
                client: true,
                prestataire: true
            }
        });

        if (!user) {
            return res.status(404).send("Utilisateur non trouvé.");
        }
        let utilisateur;
        if (user.role === "CLIENT") {
            if (!user.client) {
                return res.status(404).json({ success: false, message: "Client introuvable." });
            }

            utilisateur = await prisma.client.update({
                where: { utilisateurIdCl: user.id },
                data: { isActive: true },
                include: { utilisateur: true }
            });
        } else if ((user.role === "PRESTATAIRE" || user.role === "ENTREPRISE") && user.prestataire) {
            utilisateur = await prisma.prestataire.update({
                data: { isActive: true },
                where: { utilisateurIdPre: user.id },
                include: { utilisateur: true, entreprise: true }
            });
        }

        const mailOption = {
            from: '"DomiService" <domiservicesmm@gmail.com>',
            to: user.email,
            subject: 'Activation du compte',
            html: `
        <h2>Bonjour ${user.nom + '  ' + user.prenom},</h2>
        <p>Votre compte a été activé avec succès.</p>
        <p>Si vous avez des questions, contactez-nous à domiservicesmm@gmail.com.</p>
        <p>Cordialement,<br>DomiService</p>
    `
        };

        transporter.sendMail(mailOption, (error) => {
            if (error) console.log("Erreur envoi email:", error);
        });
        return res.status(200).json({
            success: true,
            message: "Compte utilisateur activé avec succès",
            data: utilisateur
        });

    } catch (err) {
        return res.status(500).send({ success: false, message: err.message });
    }
});
//desactiver le compte
router.put('/desactive', async (req, res) => {
    try {
        const { id } = req.query;
        const { raison } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "ID requis." });
        }

        const user = await prisma.utilisateur.findUnique({
            where: { id: Number(id) },
            include: { client: true, prestataire: true }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
        }

        let result;

        if (user.role === "CLIENT") {
            if (!user.client) {
                return res.status(404).json({ success: false, message: "Client introuvable." });
            }

            result = await prisma.client.update({
                where: { utilisateurIdCl: user.id },
                data: { isActive: false },
                include: { utilisateur: true }
            });
        } else if ((user.role === "PRESTATAIRE" || user.role === "ENTREPRISE") && user.prestataire) {
            result = await prisma.prestataire.update({
                where: { utilisateurIdPre: user.id },
                data: { isActive: false },
                include: { utilisateur: true, entreprise: true }
            });
        } else {
            return res.status(400).json({ success: false, message: "Impossible de désactiver ce compte." });
        }

        const mailOption = {
            from: '"DomiService" <domiservicesmm@gmail.com>',
            to: user.email,
            subject: 'Désactivation du compte',
            html: `
        <h2>Bonjour ${user.nom},</h2>
        <p>Votre compte a été désactivé.</p>
        <p><strong>Raison :</strong> ${raison}</p>
        <p>Si ce n’est pas vous ou si vous avez des questions, contactez-nous à domiservicesmm@gmail.com.</p>
        <p>Cordialement,<br>DomiService</p>
      `
        };

        transporter.sendMail(mailOption, (error) => {
            if (error) console.log("Erreur envoi email:", error);
        });

        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

//se connecter
router.post('/login', async (req, res) => {
    try {
        const { identifiant, motDePasse } = req.body;

        if (!identifiant || !motDePasse) {
            return res.status(400).send({
                success: false,
                message: "Tous les champs sont obligatoires"
            });
        }

        let utilisateur = null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(identifiant)) {

            utilisateur = await prisma.utilisateur.findUnique({
                where: { email: identifiant },
                include: {
                    client: true,
                    prestataire: {
                        include: {
                            entreprise: true,
                        }
                    }
                }
            });
        } else {

            const client = await prisma.client.findFirst({ where: { numTel: identifiant } });
            if (client) {
                utilisateur = await prisma.utilisateur.findUnique({
                    where: { id: client.utilisateurIdCl },
                    include: {
                        client: true,
                        prestataire: {
                            include: {
                                entreprise: true,
                            }
                        }
                    }
                });
            } else {

                const prestataire = await prisma.prestataire.findFirst({ where: { numTel: identifiant } });
                if (prestataire) {
                    utilisateur = await prisma.utilisateur.findUnique({
                        where: { id: prestataire.utilisateurIdPre },
                        include: {
                            client: true,
                            prestataire: {
                                include: {
                                    entreprise: true,
                                }
                            }
                        }
                    });
                }
            }
        }
        if (!utilisateur) {
            return res.status(400).send({
                success: false, message: " le compte n'existe pas"
            })
        } else if (utilisateur && utilisateur.role == "CLIENT" && !utilisateur.client.isActive) {
            return res.status(400).send({
                success: false, message: "Votre compte est inactif. Veuillez consulter votre messagerie Gmail pour plus d'informations"
            })
        } else if ((utilisateur.role === "PRESTATAIRE" || utilisateur.role === "ENTREPRISE") &&
            (!utilisateur.prestataire || !utilisateur.prestataire.isActive)) {
            return res.status(400).send({
                success: false,
                message: "Votre compte est en cours de validation par l'administrateur. Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter à l'adresse suivante : DomiService@gmail.com"
            });

        }
        else {
            let isCorrectPass = await bcrypt.compare(motDePasse, utilisateur.motDePasse)
            if (isCorrectPass) {
                const token = generateAccessToken(utilisateur);
                const refreshToken = generateRefreshToken(utilisateur);
                if (utilisateur.role == 'CLIENT') {
                    const client = await prisma.client.findUnique({
                        where: {
                            utilisateurIdCl: utilisateur.id
                        },
                        include: {
                            utilisateur: true
                        }
                    })
                    const stats = {
                        rendezVous: await prisma.rendezVous.count({ where: { clientId: utilisateur.id } }),
                        avis: await prisma.avis.count({ where: { clientId: utilisateur.id } }),
                        signalements: await prisma.signalement.count({ where: { clientId: utilisateur.id } })
                    };


                    return res.status(200).send({
                        success: true, token, refreshToken, user: client, stats
                    })
                } else if (utilisateur.role == 'PRESTATAIRE' || utilisateur.role == 'ENTREPRISE') {
                    const prestataire = await prisma.prestataire.findUnique({
                        where: {
                            utilisateurIdPre: utilisateur.id
                        },
                        include: {
                            utilisateur: true, entreprise: true
                        }
                    })
                    const stats = {
                        rendezVous: await prisma.rendezVous.count({ where: { prestataireId: utilisateur.id } }),
                        avis: await prisma.avis.count({ where: { prestataireId: utilisateur.id } }),
                        signalements: await prisma.signalement.count({ where: { prestataireId: utilisateur.id } })
                    };
                    return res.status(200).send({
                        success: true, token, refreshToken, user: prestataire, stats
                    })

                } else {
                    const admin = await prisma.admin.findUnique({
                        where: {
                            utilisateurIdAd: utilisateur.id
                        },
                        include: {
                            utilisateur: true
                        }
                    })
                    return res.status(200).send({
                        success: true, token, refreshToken, user: admin
                    })
                }
            } else {
                return res.status(404).send({
                    success: false, message: "Veuillez vérifier votre mot de passe"
                })
            }
        }
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message })
    }
});
// tous les clients
router.get('/Allclients', async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            where: {
                isActive: true
            },
            include: {
                utilisateur: true
            }
        })
        res.status(200).json(clients);
    } catch (error) {
        res.status(404).json({ erreur: error.message })
    }
})

// tous les prestataires 
router.get('/Allprestataires', async (req, res) => {
    try {
        const prestataires = await prisma.prestataire.findMany({
            where: {
                isActive: true
            },
            include: {
                utilisateur: true, entreprise: true, service: true
            }
        })
        res.status(200).json(prestataires);
    } catch (error) {
        res.status(404).json({ erreur: error.message })
    }
})

// // tous les entreprises
// router.get('/Allentreprises', async (req, res) => {
//     try {
//         const entreprises = await prisma.entreprise.findMany({
//             include: { prestataire: { include: { utilisateur: true } } }
//         }
//         )
//         res.status(200).json(entreprises);
//     } catch (error) {
//         res.status(404).json({ erreur: error.message })
//     }
// })




// modifier le compte
router.put('/:id', async (req, res) => {
    let { nom, prenom, email, motDePasse, image, genre, currentPassword } = req.body;
    const id = Number(req.params.id);

    try {
        await prisma.$transaction(async (prisma) => {
            const user = await prisma.utilisateur.findUnique({
                where: { id },
                include: { prestataire: true, client: true }
            });

            if (!user) {
                return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
            }


            if (motDePasse) {
                if (!currentPassword) {
                    return res.status(400).json({
                        success: false,
                        message: "Le mot de passe actuel est requis pour modifier le mot de passe."
                    });
                }


                const isPasswordValid = await bcrypt.compare(currentPassword, user.motDePasse);
                if (!isPasswordValid) {
                    return res.status(400).json({
                        success: false,
                        message: "Le mot de passe actuel est incorrect."
                    });
                }

                // Hasher le nouveau mot de passe
                const salt = await bcrypt.genSalt(10);
                motDePasse = await bcrypt.hash(motDePasse, salt);
            }
            const admin = await prisma.utilisateur.findFirst({
                where: { role: 'ADMIN' }
            });
            const emailCleaned = email?.trim().toLowerCase();
            const emailChanged = email && email !== user.email;
            if (emailChanged) {
                const utilisateurActifAvecEmail = await prisma.utilisateur.findFirst({
                    where: {
                        email: emailCleaned,
                        id: { not: id },
                        OR: [
                            { client: { isActive: true } },
                            { prestataire: { isActive: true } }
                        ]
                    }
                });

                if (utilisateurActifAvecEmail) {
                    return res.status(400).json({
                        success: false,
                        message: "Cet email est déjà utilisé par un autre compte actif."
                    });
                }
            }
            const numTelChanged =
                (user.client && req.body.numTel && req.body.numTel !== user.client.numTel) ||
                (user.prestataire && req.body.numTel && req.body.numTel !== user.prestataire.numTel);

            if (numTelChanged) {
                const utilisateurActifAvecTel = await prisma.utilisateur.findFirst({
                    where: {
                        id: { not: id },
                        OR: [
                            { client: { numTel: req.body.numTel, isActive: true } },
                            { prestataire: { numTel: req.body.numTel, isActive: true } }
                        ]
                    }
                });

                if (utilisateurActifAvecTel) {
                    return res.status(400).json({
                        success: false,
                        message: "Ce numéro de téléphone est déjà utilisé par un autre compte actif."
                    });
                }
            }
            let dataU = { nom, prenom, email, image, genre }
            if (motDePasse) {
                dataU.motDePasse = motDePasse;
            }
            await prisma.utilisateur.update({
                data: dataU,
                where: { id },
            });

            if (user.role === 'CLIENT') {
                const { numTel, ville, adresse } = req.body;
                const coords = await geocodeAdresse(`${adresse}, ${ville}`);

                const updateData = {
                    numTel, ville, adresse, latitude: coords?.latitude ?? null,
                    longitude: coords?.longitude ?? null,
                };

                if (emailChanged || numTelChanged) {
                    updateData.isActive = false;
                }

                const client = await prisma.client.update({
                    data: updateData,
                    where: { utilisateurIdCl: id },
                    include: { utilisateur: true }
                });


                if (emailChanged) {
                    const mailOption = {

                        from: '"DomiService" <domiservicesmm@gmail.com>',
                        to: email,
                        subject: 'Validation du compte',
                        html: `  
                        <h2>Bienvenue, ${nom}!</h2>
                        <h4>Cher(e) ${nom},
                        Nous vous remercions pour votre inscription sur Domi Service ! Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :
                        <p><a href="http://${req.headers.host}/api/utilisateur/activeClient/utilisateur?email=${email}">cliquez ici</a></p>.
                        Une fois votre compte activé, vous pourrez accéder à toutes les fonctionnalités de notre plateforme</h4>
                        <p>Cordialement,</p>
                        <p>----------</p>
                        <p>DomiServicer</p>
                    `
                    };
                    transporter.sendMail(mailOption, function (error, info) {
                        if (error) {
                            console.error("Erreur d'envoi mail validation:", error);
                        } else {
                            console.log("Mail de validation envoyé:", info.response);
                        }
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Compte client mis à jour avec succès",
                    user: client
                });
            } else if (user.role === 'PRESTATAIRE' || user.role === 'ENTREPRISE') {
                const {
                    adresse, ville, numTel, tarifDeplacement,
                    experience, competence,
                    nomEntreprise, siteWeb, identifiant, Spécialite, descriptionCourte
                } = req.body;

                const coords = await geocodeAdresse(`${adresse}, ${ville}`);
                // 1. Mise à jour du prestataire
                const prestataireData = {
                    adresse, ville, numTel, tarifDeplacement:
                        tarifDeplacement && tarifDeplacement !== ""
                            ? parseFloat(tarifDeplacement)
                            : null,
                    experience, competence, Spécialite, descriptionCourte, latitude: coords?.latitude ?? null,
                    longitude: coords?.longitude ?? null,

                };

                if (emailChanged || numTelChanged) {
                    prestataireData.isActive = false;
                }

                const prestataireUpdated = await prisma.prestataire.update({
                    where: { utilisateurIdPre: id },
                    data: prestataireData,
                    include: { utilisateur: true, entreprise: true }
                });
                await prisma.notification.create({
                    data: {
                        contenu: `Le compte de ${prestataireUpdated.utilisateur.nom} ${prestataireUpdated.utilisateur.prenom} a été désactivé suite à la modification de l'email. Veuillez réactiver le compte pour le nouvel email.`,
                        utilisateurId: admin.id
                    }
                });

                if (user.role === 'ENTREPRISE') {
                    const entrepriseCurrent = await prisma.entreprise.findUnique({
                        where: { prestataireId: id },
                    });

                    const identifiantChanged = identifiant && identifiant !== entrepriseCurrent?.identifiant;

                    const entrepriseData = {
                        nomEntreprise,
                        siteWeb,
                    };
                    if (identifiant) entrepriseData.identifiant = identifiant;
                    if (emailChanged || identifiantChanged || numTelChanged) {
                        await prisma.prestataire.update({
                            where: { utilisateurIdPre: id },
                            data: { isActive: false },
                        });

                        await prisma.notification.create({
                            data: {
                                contenu: `Le compte de ${prestataireUpdated.entreprise.nomEntreprise}  a été désactivé suite à la modification de l'email ou de l'identifiant. Veuillez réactiver le compte.`,
                                utilisateurId: admin.id
                            }
                        });
                    }

                    const entrepriseUpdated = await prisma.entreprise.update({
                        where: { prestataireId: id },
                        data: entrepriseData,
                        // include: { prestataire: { include: { utilisateur: true } } }
                    });

                    return res.status(200).json({
                        success: true,
                        message: "Compte entreprise mis à jour",
                        user: {
                            ...prestataireUpdated,
                            entreprise: entrepriseUpdated,
                        },
                    });

                }
                return res.status(200).json({
                    success: true,
                    message: "Compte prestataire mis à jour",
                    user: prestataireUpdated
                });

            } else {
                let { email, nom, prenom, motDePasse, image, genre } = req.body;


                const admin = await prisma.admin.findUnique({
                    where: { utilisateurIdAd: Number(id) },
                    include: { utilisateur: true }
                });


                const adminUpdatedUtilisateur = await prisma.utilisateur.update({
                    where: { id: admin.utilisateur.id },
                    data: {
                        email: email ?? admin.utilisateur.email,
                        nom: nom ?? admin.utilisateur.nom,
                        prenom: prenom ?? admin.utilisateur.prenom,
                        motDePasse: motDePasse ?? admin.utilisateur.motDePasse,
                        image: image ?? admin.utilisateur.image,
                        genre: genre ?? admin.utilisateur.genre
                    }
                });


                const adminUpdated = {
                    ...admin,
                    utilisateur: adminUpdatedUtilisateur
                };


                return res.status(201).send({
                    success: true,
                    message: "Compte update successfully",
                    user: adminUpdated
                });

            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
});

// Stockage temporaire des codes (email ou numéro)
const resetCodes = new Map();
// Fonction générant un OTP 
function generateOTP() {
    const buffer = crypto.randomBytes(4);            // 32 bits aléatoires
    const number = buffer.readUInt32BE(0) % 900000;  // -> 0 à 899999
    return (100000 + number).toString();              // -> 100000 à 999999
}

// Demande d’envoi de code

router.post('/forgot-password', async (req, res) => {
    let { identifier } = req.body;
    identifier = identifier.trim().toLowerCase();
    try {
        const user = await prisma.utilisateur.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { client: { numTel: identifier } },
                    { prestataire: { numTel: identifier } }

                ]
            },
            include: {
                client: true,
                prestataire: true

            }
        });

        // if (!user) return res.send({ Status: "Success" });
        if (!user) return res.status(404).send({ Status: "UserNotFound", message: "Utilisateur non trouvé" });
        const code = generateOTP();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Stocker le code en mémoire
        resetCodes.set(identifier, { code, expiresAt });

        console.log('Code stocké pour', identifier, ':', resetCodes);
        // Envoi email ou SMS
        if (identifier.includes('@')) {
            const mailOptions = {
                from: '"Réinitialisation" <domiservicesmm@gmail.com>',
                to: identifier,
                subject: 'Code de réinitialisation',
                text: `Votre code est : ${code}\nValide 10 minutes.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.send({ Status: "Erreur d'envoi" });
                }
                console.log('E-mail envoyé :', info.response);
                return res.send({ Status: "Success" });
            });

        } else {
            console.log(identifier);
            twilioClient.messages.create({
                body: `Votre code est : ${code}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: "+216" + identifier
            })
                .then(message => {
                    console.log('SMS envoyé :', message.sid);
                    res.send({ Status: "Success" });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send({ Status: err.message });
                });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send({ Status: "Erreur serveur" });
    }
});

// Réinitialisation du mot de passe
router.post('/reset-password', async (req, res) => {
    let { identifier, code, newPassword } = req.body;
    identifier = identifier.trim().toLowerCase();

    console.log("Code stocké dans resetCodes pour", identifier, ":", code);

    try {
        const stored = resetCodes.get(identifier);
        console.log('Code stocké pour', identifier, ':', stored);

        if (!stored || stored.code !== code.toString() || Date.now() > stored.expiresAt) {
            return res.send({ Status: "Code invalide ou expiré" });
        }

        resetCodes.delete(identifier);

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await prisma.utilisateur.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { client: { numTel: identifier } },
                    { prestataire: { numTel: identifier } }


                ]
            },
            include: {
                client: true,
                prestataire: true

            }
        });
        console.log("Utilisateur trouvé :", user);
        if (!user) {
            return res.status(404).send({ Status: "Utilisateur non trouvé" });
        }

        // Mise à jour avec l'id de l'utilisateur
        await prisma.utilisateur.update({
            where: { id: user.id },
            data: { motDePasse: hashedPassword }
        });


        res.send({ Status: "Mot de passe mis à jour" });

    } catch (err) {
        console.error(err);
        res.status(500).send({ Status: "Erreur lors de la mise à jour" });
    }
});
//get utilisateur(prestataire&entreprise)
router.get('/getintervenant', async (req, res) => {
    try {
        const PRESTATAIRE = 'PRESTATAIRE';
        const ENTREPRISE = 'ENTREPRISE';

        const Intervenants = await prisma.utilisateur.findMany({
            where: {

                role: {
                    in: [PRESTATAIRE, ENTREPRISE]
                }, prestataire: {
                    isActive: true
                }
            },
            include: {
                prestataire: {
                    include: {
                        entreprise: true
                    }
                }

            }
        });

        res.json(Intervenants);
    } catch (error) {
        console.error("Erreur récupération intervenants :", error);
        res.status(500).json({
            message: error.message,
        });
    }
});

// intervenant by id 
router.get('/intervenant/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const intervenant = await prisma.utilisateur.findUnique({
            where: { id: Number(id) },
            include: {
                prestataire: { where: { isActive: true }, include: { entreprise: true } }
            }
        })
        res.status(200).json(intervenant);
    } catch (error) {
        res.status(404).json({ erreur: error.message })
    }
})

const toRadians = (deg) => deg * Math.PI / 180;

function calculerDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance en kilomètres
}

router.get('/prestataires-proches/:clientId', async (req, res) => {
    try {
        const client = await prisma.client.findUnique({
            where: { utilisateurIdCl: parseInt(req.params.clientId), isActive: true },
            include: { utilisateur: true }
        });

        if (!client || client.latitude == null || client.longitude == null) {
            return res.status(404).json({ message: "Client introuvable ou coordonnées manquantes" });
        }

        const prestataires = await prisma.prestataire.findMany({
            where: { isActive: true },
            include: { utilisateur: true, entreprise: true }
        });

        const proches = prestataires
            .map((p) => {
                if (p.latitude == null || p.longitude == null) return null;
                const distance = calculerDistance(client.latitude, client.longitude, p.latitude, p.longitude);
                return { ...p, distance };
            })
            .filter((p) => p && p.distance <= 20)
            .sort((a, b) => a.distance - b.distance)


        res.json(proches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
// GET /api/prestataires
router.get('/prestataires', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 8,
            type,
            ville,
            sort
        } = req.query;

        const take = parseInt(limit);
        const skip = (parseInt(page) - 1) * take;

        const whereClause = {
            isActive: true,
        };

        // Filtrer par type (PRESTATAIRE ou ENTREPRISE)
        if (type) {
            whereClause.utilisateur = {
                role: type
            };
        }

        // Filtrer par ville
        if (ville) {
            whereClause.ville = {
                equals: ville.toLowerCase()
            };
        }

        const orderByClause = {};

        if (sort === 'tarifAsc') {
            orderByClause.tarifDedeplacement = 'asc';
        } else if (sort === 'tarifDesc') {
            orderByClause.tarifDedeplacement = 'desc';
        } else if (sort === 'ville') {
            orderByClause.ville = 'asc';
        }

        const prestataires = await prisma.prestataire.findMany({
            where: whereClause,
            include: {
                utilisateur: true,
                entreprise: true
            },
            skip,
            take,
            orderBy: Object.keys(orderByClause).length > 0 ? orderByClause : undefined
        });

        const total = await prisma.prestataire.count({ where: whereClause });

        res.json({
            data: prestataires,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / take)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
router.get('/utilisateursA', async (req, res) => {
    try {
        const { role } = req.query;

        const where = {
            role: {
                not: 'ADMIN'
            }
        };

        if (role && role !== 'TOUS') {
            where.role = role;
        }

        const utilisateurs = await prisma.utilisateur.findMany({
            where,
            include: {
                client: true,
                prestataire: {
                    include: {
                        entreprise: true,
                        service: true
                    }
                }
            }
        });

        const utilisateursFormates = utilisateurs.map(u => {
            const base = {
                id: u.id,
                image: u.image,
                nom: u.nom,
                prenom: u.prenom,
                email: u.email,
                role: u.role,
                isActive: u.client?.isActive ?? u.prestataire?.isActive ?? false
            };

            if (u.role === 'CLIENT' && u.client) {
                return {
                    ...base,
                    ville: u.client.ville,
                    adresse: u.client.adresse,
                    numTel: u.client.numTel
                };
            }

            if ((u.role === 'PRESTATAIRE' || u.role === 'ENTREPRISE') && u.prestataire) {
                const data = {
                    ...base,
                    ville: u.prestataire.ville,
                    adresse: u.prestataire.adresse,
                    numTel: u.prestataire.numTel,
                    specialite: u.prestataire.Spécialite,
                    tarifDeplacement: u.prestataire.tarifDeplacement,
                    competence: u.prestataire.competence,
                    experience: u.prestataire.experience,
                    description: u.prestataire.descriptionCourte,
                    service: u.prestataire.service?.nom || null
                };

                if (u.role === 'ENTREPRISE' && u.prestataire.entreprise) {
                    data.nomEntreprise = u.prestataire.entreprise.nomEntreprise;
                    data.siteWeb = u.prestataire.entreprise.siteWeb;
                    data.identifiant = u.prestataire.entreprise.identifiant;
                }

                return data;
            }

            return base;
        });

        res.status(200).json(utilisateursFormates);
    } catch (error) {
        console.error("Erreur récupération utilisateurs :", error);
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});



module.exports = router;