import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIntervenant } from '../../features/UtilisateurSlice';
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
            <PrestatairesPopulaires isClientConnected={isLoggedIn} user={user} />
            {user?.utilisateur?.role === 'CLIENT' ? (
                <PrestatairesProche />
            ) : (
                <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
                    {/* <PrestatairesProche /> */}
                </div>
            )}
            {user?.utilisateur?.role === 'CLIENT' ? (
                <EtapesRendezVous />) : (
                <div style={{ opacity: 0.5, pointerEvents: 'none' }}>

                </div>
            )}
            <StatistiquesSection />
            <ContactForm isClientConnected={isLoggedIn} user={user} />

            <MapAccueil />
            <Footer />
        </>
    );
};

export default HomePage;
