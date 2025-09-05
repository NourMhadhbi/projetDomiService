// src/App.js
import React, { useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ProfileSection from './ProfileSection';
import ExperienceSection from './ExperienceSection';
import StatisticsSection from './StatisticsSection';
// import MapPres from './MapPres';
import AvisSection from './AvisSection';
import '../../assets/css/FichePrestataire.css';
import '../../assets/css/Header.css';
import '../../assets/css/Footer.css';
import { fetchIntervenantbyId } from '../../features/UtilisateurSlice';
import { getAvisByPrestataire } from "../../features/AvisSlice";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { createHistorique, fetchDernierHistorique } from '../../features/HistoriqueSlice';
function App() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();

    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const {
        intervenant,
        loading: intervenantLoading,
        error: intervenantError,
    } = useSelector((state) => state.utilisateur);

    const {
        listeAvis,
        loading: avisLoading,
        error: avisError,
    } = useSelector((state) => state.avis);

    const isClientConnected = isLoggedIn;
    const avisP = listeAvis;

    const isFichePage = location.pathname.startsWith('/ficheintervenant/');

    useEffect(() => {
        if (id && isFichePage) {
            dispatch(fetchIntervenantbyId(id));
        }
    }, [id, dispatch, isFichePage]);

    useEffect(() => {
        if (id && isFichePage) {
            dispatch(getAvisByPrestataire(id));
        }
    }, [id, dispatch, isFichePage]);
    useEffect(() => {
        const ajouterEtRafraichir = async () => {
            try {
                const action = await dispatch(createHistorique({
                    clientId: user.utilisateurIdCl,
                    prestataireId: parseInt(id)
                }));

                if (createHistorique.fulfilled.match(action)) {
                    // Seulement si l'ajout a réussi
                    dispatch(fetchDernierHistorique({ clientId: user.utilisateurIdCl }));
                } else {
                    // Ajout refusé (ex: doublon minute)
                    console.warn("Historique déjà existant, pas de rechargement.");
                }
            } catch (err) {
                console.error("Erreur dans createHistorique :", err);
            }
        };

        if (isFichePage && isLoggedIn && id) {
            ajouterEtRafraichir();
        }
    }, [isFichePage, isLoggedIn, id, dispatch, user.utilisateurIdCl]);

    if (intervenantLoading || avisLoading) return <p>Chargement...</p>;
    if (intervenantError) return <p>Erreur Intervenant: {intervenantError}</p>;
    if (avisError) return <p>Erreur Avis: {avisError}</p>;

    return (
        <>
            <Header isClientConnected={isClientConnected} intervenant={intervenant} />
            <ProfileSection isClientConnected={isClientConnected} intervenant={intervenant} user={user} />
            <ExperienceSection isClientConnected={isClientConnected} intervenant={intervenant} />
            <StatisticsSection id={id} />
            {/* <MapPres /> */}
            <AvisSection userC={user} avisP={avisP} intervenant={intervenant} />
            <Footer />
        </>
    );
}

export default App;
