// const express = require('express');
// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient()
// const router = express.Router();
// // chercher un entreprise par email.
// router.get('/emailEntreprise', async (req, res,) => {
//     const { email } = req.body
//     try {
//         const utilisateur = await prisma.utilisateur.findUnique({
//             where: {
//                 email
//             },
//             include: {
//                 entreprise: true
//             }
//         })
//         res.json(utilisateur)
//     } catch (error) {
//         res.status(500).json({
//             message: error.message,
//         })
//     }
// });
// //chercher un entreprise par service
// router.get('/serviceEntreprise', async (req, res,) => {
//     const { serviceId } = req.body
//     try {
//         const entreprise = await prisma.entreprise.findMany({
//             where: {
//                 serviceId: Number(serviceId)
//             },
//             include: {
//                 service: true
//             }
//         })
//         res.json(entreprise)
//     } catch (error) {
//         res.status(500).json({
//             message: error.message,
//         })
//     }
// });
// module.exports = router;