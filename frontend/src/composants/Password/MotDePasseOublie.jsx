import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import image from '../../assets/img/background.jpg';
import AuthService from '../../services/Authservice';

const MotDePasseOublie = () => {
    const [identifier, setIdentifier] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Réponse du backend :", identifier);
        try {

            const response = await AuthService.forgot(identifier);
            console.log("Réponse du backend :", response.data);
            if (response.data.Status === "Success") {
                navigate('/verification-code', { state: { identifier } });
            } else {
                setMessage("Erreur d'envoi, réessayez.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Erreur serveur, réessayez.");
        }
    };

    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center login-container">
            <Row className="shadow-lg rounded" style={{ width: '900px', height: '600px', backgroundColor: 'white' }}>
                <Col md={6} className="p-5 d-flex flex-column justify-content-center">
                    <div className="mb-4 d-flex align-items-center logo-title-container">
                        <img src={logo} alt="logo" className="login-logo" />
                        <h3 className="login-title">Mot de passe oublié</h3>
                    </div>

                    {/* Boîte d'information */}
                    <Alert variant="light" className="mb-4">
                        Aucun problème. Entrez votre adresse e-mail ou numéro de téléphone et nous vous enverrons un code de réinitialisation qui vous permettra de choisir un nouveau mot de passe.
                    </Alert>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Adresse e-mail ou numéro de téléphone</Form.Label>
                            <Form.Control
                                type="text"
                                name="identifier"
                                placeholder="Email ou numéro"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" className="w-100 mb-3" style={{ backgroundColor: '#0d6efd', border: 'none' }}>
                            Envoyer le code
                        </Button>
                    </Form>
                    {message && <p className="text-danger text-center">{message}</p>}
                </Col>
                <Col md={6} className="p-0 d-none d-md-block">
                    <img src={image} alt="Mot de passe oublié" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Col>
            </Row>
        </Container>
    );
};

export default MotDePasseOublie;
