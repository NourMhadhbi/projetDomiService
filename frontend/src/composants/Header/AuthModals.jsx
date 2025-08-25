import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

const AuthPanelModal = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    const closeModal = () => setIsOpen(false);
    const handleNavigate = (path) => {
        closeModal();
        navigate(path);
    };

    const buttonStyle = (color) => ({
        border: `2px solid ${color}`,
        color: color,
        background: "#fff",
        fontWeight: "400",
        fontSize: "0.9rem",
        transition: "all 0.3s ease",
        padding: "0.5rem 1rem",
    });

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1050,
                backgroundColor: "rgba(0,0,0,0.3)",
            }}
        >
            <div
                className="modal-dialog modal-dialog-centered"
                style={{ zIndex: 1060 }}
            >
                <div
                    className="modal-content shadow-lg rounded-4"
                    style={{
                        backgroundColor: "#fff",
                        width: "500px",
                        maxWidth: "90vw",
                        padding: "1.5rem 1rem"
                    }}
                >

                    <div className="modal-header border-0 bg-light d-flex flex-column align-items-center position-relative">
                        <h5
                            className="modal-title fw-light mb-2"
                            style={{
                                fontSize: "1.3rem",
                                letterSpacing: "0.5px",
                                color: "#1a3a6c",
                            }}
                        >
                            Connexion à DomiService
                        </h5>


                        <div
                            style={{
                                width: "60px",
                                height: "2px",
                                backgroundColor: "#ff6b00",
                                marginBottom: "0.5rem",
                            }}
                        ></div>


                        <button
                            type="button"
                            className="btn-close position-absolute top-0 end-0 m-3"
                            onClick={closeModal}
                        ></button>
                    </div>

                    <div className="modal-body text-center px-4 pb-4">
                        <p
                            className="fw-light mb-4"
                            style={{
                                fontSize: "0.95rem",
                                lineHeight: "1.5",
                                color: "#1a3a6c",
                            }}
                        >
                            Connectez-vous ou créez un compte pour accéder à tous les services
                        </p>

                        <div className="d-grid gap-2">
                            <button
                                className="btn rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 py-2"
                                style={buttonStyle("#1a3a6c")}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#1a3a6c";
                                    e.currentTarget.style.color = "#fff";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "#fff";
                                    e.currentTarget.style.color = "#1a3a6c";
                                }}
                                onClick={() => handleNavigate("/login")}
                            >
                                <FaSignInAlt size={18} />
                                <span className="fw-light">Se connecter</span>
                            </button>

                            <button
                                className="btn rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 py-2"
                                style={buttonStyle("#ff6b00")}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#ff6b00";
                                    e.currentTarget.style.color = "#fff";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "#fff";
                                    e.currentTarget.style.color = "#ff6b00";
                                }}
                                onClick={() => handleNavigate("/registre")}
                            >
                                <FaUserPlus size={18} />
                                <span className="fw-light">Créer un compte</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPanelModal;
