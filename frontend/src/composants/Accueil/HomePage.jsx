import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIntervenant } from '../../features/UtilisateurSlice'; // ou rendezVousSlice selon ton setup
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import AProposSection from './AProposSection';
import ServiceSecion from './ServiceSection';
import PrestatairesPopulaires from './PrestatairesPopulaires ';
import MapAccueil from './MapAccueil';
import EtapesRendezVous from './EtapesRendezVous';
import ContactForm from './ContactForm';
import PrestatairesProche from './PrestatiresProche'
import StatistiquesSection from './StatistiquesSection';
const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { intervenants, loading, error } = useSelector(state => state.utilisateur);
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    useEffect(() => {
        dispatch(fetchIntervenant());
    }, [dispatch]);

    const handleClick = (id, role) => {
        // Naviguer vers fiche avec id et role dans URL
        navigate(`/ficheintervenant/${id}`);

    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur : {error}</div>;

    return (
        <><Header isClientConnected={isLoggedIn} />
            <AProposSection />
            <ServiceSecion />
            <PrestatairesPopulaires />
            <PrestatairesProche />
            <EtapesRendezVous />
            <StatistiquesSection />
            <ContactForm />

            <MapAccueil />
            <Footer />
        </>
    );
};

export default HomePage;
