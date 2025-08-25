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
import ClientReducer from "../features/ClientSlice.js";
import statistiquesAdminReducer from "../features/statistiquesAdminSlice.js";
import historiqueAppReducer from '../features/historiqueAppSlice';
import signalementAppReducer from '../features/SignalementSlice.js';
import favorisReducer from "../features/favorisPrestataireSlice.js";
import contactReducer from '../features/ContactSlice.js';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import ongletReducer from "../features/ongletSlice.js";
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
const persistedReducer = persistReducer(persistConfig, authReducer)
const store = configureStore({
    reducer: {
        auth: persistedReducer,
        avis: avisReducer,
        service: serviceReducer,
        rendezVous: rendezVousReducer,
        utilisateur: utilisateurReducer,
        historique: HistoriqueReducer,
        prestataire: PrestataireReducer,
        notification: NotificationReducer,
        statistiquesAdmin: statistiquesAdminReducer,
        historiqueApp: historiqueAppReducer,
        signalement: signalementAppReducer,
        client: ClientReducer,
        contact: contactReducer,
        onglet: ongletReducer,
        favoris: favorisReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(logger),

});

export default store;
