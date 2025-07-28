// /routes/historiqueApp.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/consulter', async (req, res) => {
  const { utilisateurId } = req.body;

  try {
  
    const maintenant = new Date();

    const debutMinuteUTC = new Date(Date.UTC(
      maintenant.getUTCFullYear(),
      maintenant.getUTCMonth(),
      maintenant.getUTCDate(),
      maintenant.getUTCHours(),
      maintenant.getUTCMinutes(),
      0,
      0
    ));

    const finMinuteUTC = new Date(debutMinuteUTC);
    finMinuteUTC.setSeconds(59, 999);

    const dejaVu = await prisma.historiqueApp.findFirst({
      where: {
        utilisateurId: parseInt(utilisateurId),
        dateVisite: {
          gte: debutMinuteUTC,
          lte: finMinuteUTC
        }
      }
    });

    if (!dejaVu) {
      await prisma.historiqueApp.create({
        data: {
          utilisateurId: parseInt(utilisateurId)
        }
      });
    }

    res.status(200).json({ message: "Consultation enregistrée." });
  } catch (error) {
    console.error("Erreur historique app:", error);
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
