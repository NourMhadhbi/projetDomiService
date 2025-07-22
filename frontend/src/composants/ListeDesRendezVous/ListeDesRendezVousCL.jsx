import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchByClient } from '../../features/RendezVousSlice';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const ListeRendezVous = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { listeRendezVous } = useSelector((state) => state.rendezVous); // adapte si ton slice est différent

    useEffect(() => {
        if (isLoggedIn && user?.utilisateurIdCl) {
            dispatch(fetchByClient(user.utilisateurIdCl));
        }
    }, [isLoggedIn, user, dispatch]);

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <div className="container mt-4">
                <h2 className="mb-3">Mes rendez-vous</h2>
                {listeRendezVous?.length > 0 ? (
                    <ul className="list-group">
                        {listeRendezVous.map((rdv) => (
                            <li key={rdv.id} className="list-group-item">
                                <strong>{rdv.raison}</strong> - {new Date(rdv.date).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucun rendez-vous trouvé.</p>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ListeRendezVous;
