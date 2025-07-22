import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIntervenant } from '../features/UtilisateurSlice'; // ou rendezVousSlice selon ton setup
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { intervenants, loading, error } = useSelector(state => state.utilisateur);

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
        <div className="container">
            <h2>Tous les Prestataires et Entreprises</h2>
            <div className="row">
                {intervenants.map((intervenant) => (
                    <div
                        key={intervenant.id}
                        className="col-md-4 mb-3"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleClick(intervenant.id, intervenant.role)}
                    >
                        <div className="card p-3 shadow-sm">
                            <h5>{intervenant.nom}</h5>
                            <p>Type : {intervenant.role}</p>
                            {/* Tu peux afficher plus d’infos ici */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
