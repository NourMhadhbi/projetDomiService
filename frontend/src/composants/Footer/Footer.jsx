import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTop5Thunk } from '../../features/ServiceSlice';

const Footer = () => {
    const dispatch = useDispatch();
    const { topServices, loading, error } = useSelector(state => state.service);

    useEffect(() => {
        dispatch(getTop5Thunk());
    }, [dispatch]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <footer>
            <div className="footer-content">
                <div className="footer-column">
                    <h3>DomiService</h3>
                    <p><i className="fas fa-handshake"></i> Trouvez facilement des professionnels qualifiés pour tous vos besoins à domicile. Simple, rapide et fiable.</p>
                </div>

                <div className="footer-column">
                    <h3>Liens rapides</h3>
                    <ul>
                        <li><a href="#">À propos</a></li>
                        <li><a href="#">Portfolio</a></li>
                        <li><a href="#">Aide & FAQs</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Services les plus actifs</h3>
                    <ul>
                        {topServices && topServices.filter(service => service.totalRDV > 0).length > 0 ? (
                            topServices
                                .filter(service => service.totalRDV > 0)
                                .map(service => (
                                    <li key={service.id}>
                                        <i className="fas fa-check-circle me-2" style={{ color: '#ff9d00' }}></i>
                                        {service.nom}
                                    </li>
                                ))
                        ) : (
                            <li>Aucun service disponible.</li>
                        )}
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Newsletter</h3>
                    <p>Inscrivez-vous pour nos actualités :</p>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Votre email" />
                        <button type="submit"><i className="fas fa-paper-plane"></i></button>
                    </form>
                </div>
            </div>

            <div className="copyright">
                <p>
                    Copyright © {new Date().getFullYear()} <span className="brand">DomiService</span>. Tous droits réservés.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
