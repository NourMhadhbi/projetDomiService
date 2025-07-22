const express = require('express');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const prisma = new PrismaClient();
const router = express.Router();
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'domiservicesm@gmail.com',
        pass: 'kwql ykzw kdhd kggh' // Remplace par ton vrai mdp ou mieux variable env
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
                Spécialite, descriptionCourte,
                siteWeb,
                identifiant
            } = req.body;
            const emailCleaned = email && email.trim() !== "" ? email.trim() : undefined;

            if (emailCleaned) {
                const existingUser = await prisma.utilisateur.findUnique({ where: { email: emailCleaned } });
                if (existingUser) {
                    return res.status(400).send({ success: false, message: "Cet email est déjà utilisé." });
                }
            } else if (numTel) {
                const existingClient = await prisma.client.findFirst({ where: { numTel } });
                const existingPrestataire = await prisma.prestataire.findFirst({ where: { numTel } });
                if (existingClient || existingPrestataire) {
                    return res.status(400).send({ success: false, message: "Numéro de téléphone déjà utilisé." });
                }
            } else {
                return res.status(400).send({ success: false, message: "Email ou numéro de téléphone requis." });
            }

            const getImageByRole = (role) => {
                switch (role) {
                    case 'ADMIN':
                        return 'https://res.cloudinary.com/dmbkofiro/image/upload/v1713924474/images/xg1htshcaarthxvnj9vg.png';
                    case 'CLIENT':
                        return 'https://res.cloudinary.com/dmbkofiro/image/upload/v1713923916/images/ze5ytyshmweusb4gypsr.png';
                    case 'PRESTATAIRE':
                        return 'https://res.cloudinary.com/dmbkofiro/image/upload/v1713923916/images/xdvavia4ci9f25eywjxu.png';
                    case 'ENTREPRISE':
                        return 'https://res.cloudinary.com/dmbkofiro/image/upload/v1713923916/images/z2i2yr8gsct1qrgh1viv.png';
                    default:
                        return " ";
                }
            };

            const salt = await bcrypt.genSalt(10);
            const motDePasseCrypte = await bcrypt.hash(motDePasse, salt);

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
                // const { adresse, ville, numTel } = req.body;
                const client = await prisma.client.create({
                    data: {
                        utilisateurIdCl: userCreate.id,
                        numTel,
                        adresse,
                        ville
                    },
                    include: { utilisateur: true }
                });
                if (email && email.trim() !== '') {

                    const mailOption = {
                        from: '"DomiService" <domiservicesm@gmail.com>',
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
                }
            }
            else if (userCreate.role === 'PRESTATAIRE') {
                // const { adresse, ville, numTel, tarifDeplacement, serviceId } = req.body;

                // IMPORTANT : selon ton modèle, Prestataire a un champ serviceId et entrepriseId, et utilisateurIdPre
                const prestataire = await prisma.prestataire.create({
                    data: {
                        utilisateurIdPre: userCreate.id,
                        adresse,
                        ville,
                        numTel,
                        descriptionCourte, Spécialite,
                        tarifDeplacement: tarifDeplacement ? Number(tarifDeplacement) : 0.0,
                        serviceId: Number(serviceId)
                    },
                    include: { utilisateur: true }
                });

                return res.status(201).send({ success: true, message: "Compte created successfully", user: prestataire });
            }
            else if (userCreate.role === 'ENTREPRISE') {
                // const { nomEntreprise, adresse, ville, numTel, tarifDeplacement, siteWeb, identifiant, serviceId } = req.body;


                const prestataire = await prisma.prestataire.create({
                    data: {
                        utilisateurIdPre: userCreate.id,
                        adresse,
                        ville,
                        numTel,
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

                return res.status(201).send({ success: true, message: "Compte created successfully", user: entreprise });
            }
            else {
                // Admin 
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
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 100px auto;
                        background-color: #fff;
                        border-radius: 8px;
                        padding: 30px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h2 {
                        color: #333;
                    }
                    .center {
                        text-align: center;
                    }
                    p {
                        color: #666;
                        margin-bottom: 20px;
                    }
                    a {
                        display: inline-block;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                    }                     
                    a:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Votre compte a été activé avec succès!</h2>
                    <p>Vous pouvez maintenant vous connecter à votre compte.</p>
                    <div class="center">
                   <a href="http://localhost:3000/login">Se connecter</a>
                </div>                
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message })
    }
})

//desactiver le compte
router.put('/desactive/utilisateur', async (req, res) => {
    try {
        const { email, numTel } = req.query;
        const raison = req.body.raison
        if (!email && !numTel) {
            return res.status(400).send({ success: false, message: "Email ou numTel requis" });
        }

        let user;

        if (email) {
            user = await prisma.utilisateur.findFirst({ where: { email } });
        } else if (numTel) {
            let client = await prisma.client.findFirst({ where: { numTel } });
            if (client) {
                user = await prisma.utilisateur.findUnique({ where: { id: client.utilisateurIdCl } });
            } else {

                const prestataire = await prisma.prestataire.findFirst({ where: { numTel } });
                if (prestataire) {
                    user = await prisma.utilisateur.findUnique({ where: { id: prestataire.utilisateurIdPre } });
                }
            }
        }

        if (!user) {
            return res.status(404).send({ success: false, message: "Utilisateur non trouvé" });
        }

        if (user.role === "CLIENT") {
            const utilisateur = await prisma.client.update({
                data: { isActive: false },
                where: { utilisateurIdCl: user.id },
                include: { utilisateur: true }
            });

            const userCl = await prisma.utilisateur.findUnique({
                where: { id: utilisateur.utilisateurIdCl },
                include: { client: true }
            });
            res.status(200).send(userCl)
        } else if (user.role === "PRESTATAIRE" || user.role === "ENTREPRISE") {

            const prestataire = await prisma.prestataire.findUnique({
                where: { utilisateurIdPre: user.id }
            });
            if (!prestataire) {
                return res.status(404).send({ success: false, message: "Prestataire non trouvé" });
            }

            const updatedPrestataire = await prisma.prestataire.update({
                where: { id: prestataire.id },
                data: { isActive: false },
                include: {
                    utilisateur: true,
                    entreprise: true
                }
            });
            return res.status(200).send(updatedPrestataire);
        }

        var mailOption = {
            from: ' "DomiService" <domiservicesm@gmail.com>',
            to: user.email,
            subject: 'Desactivation du compte',
            html: `  
                    <h2>Bienvenue,${user.nom}!</h2>
                    <h4>Cher(e) ${user.nom},
                   <p> Nous espérons que vous vous portez bien. Nous tenons à vous informer que votre compte sur DomiService a été désactivé.
                   <p><strong>Raison :${"  "}</strong> ${raison}</p>
                  <p> Si vous estimez que cette désactivation est une erreur ou si vous avez des questions concernant cette décision, n'hésitez pas à nous contacter à DomiService@gmail.com. Nous serons heureux de vous fournir toute clarification nécessaire et d'examiner votre situation.</p>                   
                   Nous vous remercions de votre compréhension et de votre coopération.   
                   <p>Cordialement,</p>
                    <p>----------</p>
                    <p>DomiService</p>
                `
        }
        transporter.sendMail(mailOption, function (error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log('la validation du compte a été envoyé a votre compte')
            }
        })
        console.log(raison)
    } catch (err) {
        return res.status(404).send({ success: false, message: err.message })
    }
})

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
                    return res.status(200).send({
                        success: true, token, refreshToken, user: client
                    })
                } else if (utilisateur.role == 'PRESTATAIRE') {
                    const prestataire = await prisma.prestataire.findUnique({
                        where: {
                            utilisateurIdPre: utilisateur.id
                        },
                        include: {
                            utilisateur: true
                        }
                    })
                    return res.status(200).send({
                        success: true, token, refreshToken, user: prestataire
                    })
                } else if (utilisateur.role == 'entreprise') {
                    const entreprise = await prisma.entreprise.findUnique({
                        where: { prestataireId: utilisateur.prestataire.id },
                        include: { prestataire: { include: { utilisateur: true } } }
                    });
                    return res.status(200).send({
                        success: true, token, refreshToken, user: entreprise
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
                        success: true, token, refreshToken, utilisateur: admin
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

            include: {
                utilisateur: true
            }
        })
        res.status(200).json(prestataires);
    } catch (error) {
        res.status(404).json({ erreur: error.message })
    }
})

// tous les entreprises
router.get('/Allentreprises', async (req, res) => {
    try {
        const entreprises = await prisma.entreprise.findMany({
            include: { prestataire: { include: { utilisateur: true } } }
        }
        )
        res.status(200).json(entreprises);
    } catch (error) {
        res.status(404).json({ erreur: error.message })
    }
})




// modifier le compte
router.put('/:id', async (req, res) => {
    let { nom, prenom, email, motDePasse, image, genre } = req.body;
    const id = Number(req.params.id);

    try {
        await prisma.$transaction(async (prisma) => {
            const user = await prisma.utilisateur.findUnique({
                where: { id },
            });

            if (!user) {
                return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
            }

            const emailChanged = email && email !== user.email;
            let dataU = { nom, prenom, email, motDePasse, image, genre }
            if (motDePasse) {
                const salt = await bcrypt.genSalt(10);
                dataU.motDePasse = await bcrypt.hash(motDePasse, salt);
            }
            await prisma.utilisateur.update({
                data: dataU,
                where: { id },
            });

            if (user.role === 'CLIENT') {
                const { numTel, ville, adresse } = req.body;

                const updateData = { numTel, ville, adresse };

                if (emailChanged) {
                    updateData.isActive = false;
                }

                const client = await prisma.client.update({
                    data: updateData,
                    where: { utilisateurIdCl: id },
                    include: { utilisateur: true }
                });


                if (emailChanged) {
                    const mailOption = {

                        from: '"DomiService" <domiservicesm@gmail.com>',
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

                // 1. Mise à jour du prestataire
                const prestataireData = {
                    adresse, ville, numTel, tarifDeplacement,
                    experience, competence, Spécialite, descriptionCourte

                };

                if (emailChanged) prestataireData.isActive = false;

                const prestataireUpdated = await prisma.prestataire.update({
                    where: { id },
                    data: prestataireData,
                    include: { utilisateur: true }
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
                    if (emailChanged || identifiantChanged) entrepriseData.isActive = false;

                    const entrepriseUpdated = await prisma.entreprise.update({
                        where: { prestataireId: id },
                        data: entrepriseData,
                        include: { prestataire: { include: { utilisateur: true } } }
                    });

                    return res.status(200).json({
                        success: true,
                        message: "Compte entreprise mis à jour",
                        user: entrepriseUpdated
                    });

                }
                return res.status(200).json({
                    success: true,
                    message: "Compte prestataire mis à jour",
                    user: prestataireUpdated
                });

            } else {
                let { email, nom, prenom, motDePasse, image, genre } = req.body
                const admin = await prisma.admin.findUnique({
                    where: {
                        utilisateurIdAd: Number(id),
                    },
                    include: {
                        utilisateur: true
                    }
                })
                return res.status(201).send({
                    success: true, message: "Compte update successfully", user: admin
                })
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
                from: '"Réinitialisation" <domiservicesm@gmail.com>',
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
                }
            },
            include: {
                prestataire: true

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
                prestataire: { include: { entreprise: true } }
            }
        })
        res.status(200).json(intervenant);
    } catch (error) {
        res.status(404).json({ erreur: error.message })
    }
})
module.exports = router;