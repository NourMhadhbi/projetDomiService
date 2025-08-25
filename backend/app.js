const express = require('express');
const cors = require('cors')
const app = express()
app.use(express.json());
app.use(cors())
const utilisateurRouter = require("./routes/utilisateur.route")
app.use('/api/utilisateur', utilisateurRouter);
const prestataireRouter = require("./routes/prestataire.route")
app.use('/api/utilisateur/prestataire', prestataireRouter);
const clientRouter = require("./routes/client.route")
app.use('/api/utilisateur/client', clientRouter);
const serviceRouter = require("./routes/service.route")
app.use('/api/service', serviceRouter);
const rendezVousRouter = require("./routes/rendezVous.route")
app.use('/api/rendezVous', rendezVousRouter);
const avisRouter = require("./routes/avis.route")
app.use('/api/avis', avisRouter);
const HistoriquePrestataire = require("./routes/historiquePrestataire.route")
app.use('/api/historique', HistoriquePrestataire);
const Notification = require("./routes/notification.route")
app.use('/api/notification', Notification);
const StatistiqueAdmin = require("./routes/statistiquesAdmin.route")
app.use('/api/statistiquesAdmin', StatistiqueAdmin);
const historiqueApp = require("./routes/historiqueApp.route")
app.use('/api/historiqueApp', historiqueApp);
const favorisPrestataire = require("./routes/favorisPrestataire.route")
app.use('/api/favorisPres', favorisPrestataire);
const signalePrestataire = require("./routes/signalement.route")
app.use('/api/signalement', signalePrestataire);
const ContactMessage = require("./routes/ContactMessage.route")
app.use('/api/Contact', ContactMessage);
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))