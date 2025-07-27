import { configureStore } from '@reduxjs/toolkit';  // Sans getDefaultMiddleware
import logger from 'redux-logger';
import authReducer from "../features/AuthSlice";
import avisReducer from "../features/AvisSlice.js";
import serviceReducer from "../features/ServiceSlice";
import rendezVousReducer from "../features/RendezVousSlice.js";
import utilisateurReducer from "../features/UtilisateurSlice.js";
import HistoriqueReducer from "../features/HistoriqueSlice.js";
import NotificationReducer from "../features/NotificationSlice.js";
import PrestataireReducer from "../features/PrestatairesSlice.js";
import statistiquesAdminReducer from "../features/statistiquesAdminSlice.js";
import historiqueAppReducer from '../features/historiqueAppSlice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        avis: avisReducer,
        service: serviceReducer,
        rendezVous: rendezVousReducer,
        utilisateur: utilisateurReducer,
        historique: HistoriqueReducer,
        prestataire: PrestataireReducer,
        notification: NotificationReducer,
        statistiquesAdmin: statistiquesAdminReducer,
        historiqueApp: historiqueAppReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
