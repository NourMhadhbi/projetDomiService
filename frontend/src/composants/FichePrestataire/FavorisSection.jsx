// FavorisSection.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaHeartBroken, FaFlag, FaRegFlag, FaTimes, FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
    ajouterFavori,
    marquerNonFavori,
    supprimerFavori,
    checkStatutPrestataire
} from "../../features/favorisPrestataireSlice";
import {
    ajouterSignaleThunk,
    checkSignales
} from "../../features/SignalementSlice";

const FavorisSection = ({ prestataireId }) => {
    const dispatch = useDispatch();
    const { statutPrestataire, loading: favorisLoading } = useSelector(state => state.favoris);
    const { signalementsParUtilisateur, loading: signalementLoading } = useSelector(state => state.signalement);
    const { user } = useSelector(state => state.auth);

    const [showSignalementPanel, setShowSignalementPanel] = useState(false);
    const [raisonSelectionnee, setRaisonSelectionnee] = useState("");
    const [raisonPersonnalisee, setRaisonPersonnalisee] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [signalementTemporaire, setSignalementTemporaire] = useState(false);

    const timeoutRef = useRef(null);

    const statut = statutPrestataire[prestataireId] || 'AUCUN';
    const clientId = user?.utilisateur.id;

    // Vérifier si ce prestataire est déjà signalé par l'utilisateur
    const estSignale = signalementsParUtilisateur.some(s => s.prestataireId === prestataireId);

    useEffect(() => {
        if (clientId && prestataireId) {
            dispatch(checkStatutPrestataire({ prestataireId, clientId }));
            dispatch(checkSignales());
        }

        // Nettoyer le timeout lorsque le composant est démonté
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [dispatch, clientId, prestataireId]);

    const handleFavori = () => {
        if (clientId) {
            if (statut === 'FAVORI') {
                dispatch(supprimerFavori({ prestataireId, clientId }));
            } else {
                dispatch(ajouterFavori({ prestataireId, clientId }));
            }
        }
    };

    const handleNonFavori = () => {
        if (clientId) {
            if (statut === 'NON_FAVORI') {
                dispatch(supprimerFavori({ prestataireId, clientId }));
            } else {
                dispatch(marquerNonFavori({ prestataireId, clientId }));
            }
        }
    };

    const handleSignalement = () => {
        if (estSignale || signalementTemporaire) {
            // Afficher la confirmation de signalement existant
            setShowConfirmation(true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setShowConfirmation(false);
            }, 3000);
        } else {
            setShowSignalementPanel(true);
        }
    };

    const soumettreSignalement = () => {
        if (clientId && (raisonSelectionnee || raisonPersonnalisee)) {
            const raison = raisonPersonnalisee || raisonSelectionnee;

            dispatch(ajouterSignaleThunk({
                prestataireId,
                clientId,
                raison
            })).then(() => {
                setShowSignalementPanel(false);
                setRaisonSelectionnee("");
                setRaisonPersonnalisee("");

                // Activer l'état temporaire jaune
                setSignalementTemporaire(true);

                // Désactiver l'état temporaire après 2 minutes
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                    setSignalementTemporaire(false);
                }, 2 * 60 * 1000); // 2 minutes

                // Afficher la confirmation de signalement réussi
                setShowConfirmation(true);
                timeoutRef.current = setTimeout(() => {
                    setShowConfirmation(false);
                }, 3000);
            });
        }
    };

    const annulerSignalement = () => {
        setShowSignalementPanel(false);
        setRaisonSelectionnee("");
        setRaisonPersonnalisee("");
    };

    const fermerConfirmation = () => {
        setShowConfirmation(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const raisonsPredifinies = [
        "Contenu inapproprié",
        "Comportement suspect",
        "Prestations de mauvaise qualité",
        "Ne respecte pas les engagements",
        "Propos offensants"
    ];

    const loading = favorisLoading || signalementLoading;
    const showSignalementActif = estSignale || signalementTemporaire;

    return (
        <div className="favoris-signalement-section">
            {/* Bouton Favori */}
            <button
                className={`btn-action ${statut === 'FAVORI' ? 'btn-favori active' : 'btn-favori'}`}
                onClick={handleFavori}
                disabled={loading}
                aria-label={statut === 'FAVORI' ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
                <FaHeart className="icon-favori" />
                <span>{statut === 'FAVORI' ? 'Favori' : 'Ajouter aux favoris'}</span>
            </button>

            {/* Bouton Non Favori */}
            <button
                className={`btn-action ${statut === 'NON_FAVORI' ? 'btn-non-favori active' : 'btn-non-favori'}`}
                onClick={handleNonFavori}
                disabled={loading}
                aria-label="Marquer comme non favori"
            >
                <FaHeartBroken className="icon-non-favori" />
                <span>{statut === 'NON_FAVORI' ? 'Non favori' : 'Marquer non favori'}</span>
            </button>

            {/* Bouton Signalement */}
            <button
                className={`btn-action ${showSignalementActif ? 'btn-signalement active' : 'btn-signalement'}`}
                onClick={handleSignalement}
                disabled={loading}
                aria-label={showSignalementActif ? "Déjà signalé" : "Signaler"}
            >
                {showSignalementActif ? (
                    <FaFlag className="icon-signalement" />
                ) : (
                    <FaRegFlag className="icon-signalement" />
                )}
                <span>{showSignalementActif ? 'Signalé' : 'Signaler'}</span>
            </button>

            {/* Panneau de signalement amélioré */}
            {showSignalementPanel && (
                <div className="signalement-panel-overlay">
                    <div className="signalement-panel">
                        <div className="panel-header">
                            <div className="header-content">
                                <FaFlag className="header-icon" />
                                <h3>Signaler ce prestataire</h3>
                            </div>
                            <button className="close-btn" onClick={annulerSignalement} aria-label="Fermer">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="panel-content">
                            <p className="panel-description">
                                Aidez-nous à comprendre le problème. Pourquoi souhaitez-vous signaler ce prestataire ?
                            </p>

                            <div className="raisons-container">
                                <h4 className="raisons-title">Choisissez une raison principale</h4>

                                <div className="raisons-list">
                                    {raisonsPredifinies.map((raison, index) => (
                                        <div key={index} className="raison-item">
                                            <input
                                                type="radio"
                                                id={`raison-${index}`}
                                                name="raison"
                                                value={raison}
                                                checked={raisonSelectionnee === raison}
                                                onChange={(e) => {
                                                    setRaisonSelectionnee(e.target.value);
                                                    setRaisonPersonnalisee("");
                                                }}
                                                className="raison-input"
                                            />
                                            <label htmlFor={`raison-${index}`} className="raison-label">
                                                <span className="custom-radio"></span>
                                                {raison}
                                            </label>
                                        </div>
                                    ))}

                                    <div className="raison-item">
                                        <input
                                            type="radio"
                                            id="raison-personnalisee"
                                            name="raison"
                                            value="personnalisee"
                                            checked={raisonSelectionnee === "personnalisee"}
                                            onChange={() => {
                                                setRaisonSelectionnee("personnalisee");
                                                setRaisonPersonnalisee("");
                                            }}
                                            className="raison-input"
                                        />
                                        <label htmlFor="raison-personnalisee" className="raison-label">
                                            <span className="custom-radio"></span>
                                            Autre raison
                                        </label>
                                    </div>
                                </div>

                                {raisonSelectionnee === "personnalisee" && (
                                    <div className="custom-reason-container">
                                        <label htmlFor="raison-textarea" className="custom-reason-label">
                                            Décrivez la raison de votre signalement
                                        </label>
                                        <textarea
                                            id="raison-textarea"
                                            className="raison-textarea"
                                            placeholder="Décrivez brièvement le problème rencontré..."
                                            value={raisonPersonnalisee}
                                            onChange={(e) => setRaisonPersonnalisee(e.target.value)}
                                            rows={4}
                                            maxLength={500}
                                        />
                                        <div className="character-count">
                                            {raisonPersonnalisee.length}/500 caractères
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="panel-actions">
                                <button className="btn-annuler" onClick={annulerSignalement}>
                                    Annuler
                                </button>
                                <button
                                    className="btn-soumettre"
                                    onClick={soumettreSignalement}
                                    disabled={!raisonSelectionnee || (raisonSelectionnee === "personnalisee" && !raisonPersonnalisee)}
                                >
                                    Envoyer le signalement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Message de confirmation style SWAL avec icône de check */}
            {showConfirmation && (
                <div className="swal-overlay">
                    <div className="swal-modal">
                        <div className="swal-icon">
                            <FaCheckCircle />
                        </div>
                        <div className="swal-title">Signalement enregistré</div>
                        <div className="swal-text">
                            {estSignale
                                ? "Vous avez déjà signalé ce prestataire"
                                : "Votre signalement a été pris en compte"}
                        </div>
                        <div className="swal-footer">
                            <button className="swal-button" onClick={fermerConfirmation}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .favoris-signalement-section {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid #eaeaea;
                    position: relative;
                }
                
                .btn-action {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 10px 15px;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }
                
                .btn-action:hover:not(:disabled) {
                    background-color: #f8f9fa;
                    transform: translateY(-2px);
                }
                
                .btn-action:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .btn-favori {
                    color: #95a5a6;
                }
                
                .btn-favori.active {
                    color: #e74c3c;
                }
                
                .btn-non-favori {
                    color: #95a5a6;
                }
                
                .btn-non-favori.active {
                    color: #000000;
                }
                
                .btn-signalement {
                    color: #95a5a6;
                }
                
                .btn-signalement.active {
                    color: #f39c12;
                }
                
                .icon-favori, .icon-non-favori, .icon-signalement {
                    font-size: 1.6rem;
                    margin-bottom: 8px;
                }
                
                .btn-action span {
                    font-size: 0.85rem;
                    font-weight: 500;
                }
                
                /* Styles pour le panneau de signalement amélioré */
                .signalement-panel-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    padding: 20px;
                    animation: fadeIn 0.3s ease;
                }
                
                .signalement-panel {
                    background-color: white;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 520px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    overflow: hidden;
                    animation: slideUp 0.3s ease;
                }
                
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 24px;
                    border-bottom: 1px solid #f0f0f0;
                    background-color: #fafafa;
                }
                
                .header-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .header-icon {
                    font-size: 1.2rem;
                    color: #f39c12;
                }
                
                .panel-header h3 {
                    margin: 0;
                    color: #333;
                    font-size: 1.25rem;
                    font-weight: 600;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: #888;
                    padding: 5px;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }
                
                .close-btn:hover {
                    background-color: #f0f0f0;
                    color: #333;
                }
                
                .panel-content {
                    padding: 24px;
                }
                
                .panel-description {
                    margin-top: 0;
                    color: #666;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }
                
                .raisons-container {
                    margin-bottom: 24px;
                }
                
                .raisons-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 16px;
                }
                
                .raisons-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .raison-item {
                    display: flex;
                    align-items: center;
                }
                
                .raison-input {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                }
                
                .raison-label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    font-size: 0.95rem;
                    color: #444;
                    transition: color 0.2s ease;
                    padding: 8px 0;
                }
                
                .raison-label:hover {
                    color: #333;
                }
                
                .custom-radio {
                    position: relative;
                    height: 20px;
                    width: 20px;
                    background-color: #fff;
                    border: 2px solid #ddd;
                    border-radius: 50%;
                    margin-right: 12px;
                    transition: all 0.2s ease;
                }
                
                .raison-input:checked + .raison-label .custom-radio {
                    border-color: #f39c12;
                    background-color: #f39c12;
                }
                
                .raison-input:checked + .raison-label .custom-radio::after {
                    content: "";
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    width: 8px;
                    height: 8px;
                    background-color: white;
                    border-radius: 50%;
                }
                
                .custom-reason-container {
                    margin-top: 16px;
                    padding-left: 32px;
                }
                
                .custom-reason-label {
                    display: block;
                    font-size: 0.9rem;
                    color: #555;
                    margin-bottom: 8px;
                    font-weight: 500;
                }
                
                .raison-textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    font-family: inherit;
                    resize: vertical;
                    transition: border-color 0.2s ease;
                    font-size: 0.95rem;
                }
                
                .raison-textarea:focus {
                    outline: none;
                    border-color: #f39c12;
                    box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1);
                }
                
                .character-count {
                    font-size: 0.8rem;
                    color: #888;
                    text-align: right;
                    margin-top: 4px;
                }
                
                .panel-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 24px;
                }
                
                .btn-annuler, .btn-soumettre {
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 0.95rem;
                    transition: all 0.2s ease;
                }
                
                .btn-annuler {
                    background-color: #f8f9fa;
                    border: 1px solid #e0e0e0;
                    color: #555;
                }
                
                .btn-annuler:hover {
                    background-color: #e9ecef;
                    border-color: #d0d0d0;
                }
                
                .btn-soumettre {
                    background-color: #f39c12;
                    border: none;
                    color: white;
                }
                
                .btn-soumettre:hover:not(:disabled) {
                    background-color: #e67e22;
                }
                
                .btn-soumettre:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                    opacity: 0.7;
                }
                
                /* Styles pour le message de confirmation style SWAL */
                .swal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1001;
                }
                
                .swal-modal {
                    background-color: white;
                    border-radius: 10px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    overflow: hidden;
                    text-align: center;
                    padding: 20px;
                }
                
                .swal-icon {
                    font-size: 3rem;
                    color: #27ae60;
                    margin-bottom: 15px;
                }
                
                .swal-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10px;
                }
                
                .swal-text {
                    font-size: 1rem;
                    color: #555;
                    margin-bottom: 20px;
                }
                
                .swal-footer {
                    display: flex;
                    justify-content: center;
                }
                
                .swal-button {
                    background-color: #27ae60;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.3s ease;
                }
                
                .swal-button:hover {
                    background-color: #219955;
                }
                
                /* Animations */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @media (max-width: 768px) {
                    .favoris-signalement-section {
                        gap: 10px;
                    }
                    
                    .btn-action {
                        padding: 8px 10px;
                    }
                    
                    .icon-favori, .icon-non-favori, .icon-signalement {
                        font-size: 1.4rem;
                    }
                    
                    .btn-action span {
                        font-size: 0.75rem;
                    }
                    
                    .signalement-panel-overlay {
                        padding: 10px;
                    }
                    
                    .signalement-panel {
                        max-width: 100%;
                    }
                    
                    .panel-header,
                    .panel-content {
                        padding: 16px;
                    }
                    
                    .custom-reason-container {
                        padding-left: 24px;
                    }
                    
                    .panel-actions {
                        flex-direction: column-reverse;
                    }
                    
                    .btn-annuler, .btn-soumettre {
                        width: 100%;
                    }
                    
                    .swal-modal {
                        width: 95%;
                        padding: 15px;
                    }
                    
                    .swal-icon {
                        font-size: 2.5rem;
                        margin-bottom: 10px;
                    }
                    
                    .swal-title {
                        font-size: 1.3rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default FavorisSection;