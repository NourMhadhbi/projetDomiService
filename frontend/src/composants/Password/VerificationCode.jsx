import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import image from '../../assets/img/background.jpg';

const VerificationCode = () => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { state } = useLocation();
    const identifier = state?.identifier;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!code) {
            setMessage("Veuillez entrer le code.");
            return;
        }
        navigate('/reset-password', { state: { identifier, code } });
    };

    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center login-container">
            <Row className="shadow-lg rounded" style={{ width: '900px', height: '600px', backgroundColor: 'white' }}>
                <Col md={6} className="p-5 d-flex flex-column justify-content-center">
                    <div className="mb-4 d-flex align-items-center logo-title-container">
                        <img src={logo} alt="logo" className="login-logo" />
                        <h3 className="login-title">Vérification du code</h3>
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                name="code"
                                placeholder="Code reçu"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" className="w-100 mb-3" style={{ backgroundColor: '#0d6efd', border: 'none' }}>
                            Valider le code
                        </Button>
                    </Form>
                    {message && <p className="text-danger text-center">{message}</p>}
                </Col>
                <Col md={6} className="p-0 d-none d-md-block">
                    <img src={image} alt="Vérification du code" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Col>
            </Row>
        </Container>
    );
};

export default VerificationCode;
