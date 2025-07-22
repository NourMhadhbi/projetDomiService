// components/AuthPanelModal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPanelModal = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = () => {
        // ⚙️ Ici tu mets la logique Google OAuth (Firebase ou autre)
        alert("Connexion avec Google déclenchée (remplace ça par Firebase)");
    };

    return (
        <div
            className="modal fade"
            id="authPanelModal"
            tabIndex="-1"
            aria-labelledby="authPanelModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">Bienvenue sur DomiService</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body text-center p-4">
                        <button
                            className="btn btn-danger w-100 mb-4"
                            onClick={handleGoogleLogin}
                        >
                            <i className="fab fa-google me-2"></i> Se connecter avec Google
                        </button>
                        <hr className="my-4" />
                        <div className="d-grid gap-2">
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => {
                                    document.getElementById('authPanelModal')?.classList.remove('show');
                                    document.body.classList.remove('modal-open');
                                    navigate('/login');
                                }}
                            >
                                Login
                            </button>
                            <button
                                className="btn btn-outline-success"
                                onClick={() => {
                                    document.getElementById('authPanelModal')?.classList.remove('show');
                                    document.body.classList.remove('modal-open');
                                    navigate('/register');
                                }}
                            >
                                Registre
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPanelModal;
