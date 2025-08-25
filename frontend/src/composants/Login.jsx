import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import image from '../assets/img/background.jpg';
import '../assets/css/Login.css';
import logo from '../assets/img/logo.png';
import { login } from '../features/AuthSlice';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useGoogleLogin } from '@react-oauth/google';
import * as jwt_decode from "jwt-decode";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleChange = e => {
        setUtilisateur({ ...utilisateur, [e.target.name]: e.target.value });

    };

    const { isLoggedIn, user, errorMessage } = useSelector((state) => state.auth);
    const [errors, setErrors] = React.useState({});
    const [utilisateur, setUtilisateur] = React.useState({});

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();
        if (!utilisateur.identifiant || !utilisateur.motDePasse) {
            setErrors({ email: !utilisateur.identifiant ? "L'adresse e-mail est requise" : '', password: !utilisateur.motDePasse ? 'Le mot de passe est requis' : '' });
        } else {
            dispatch(login(utilisateur)).then((res) => {
                if (res.type === "auth/login/rejected") {

                    setMessage(res.payload);
                } else if (res.type === "auth/login/fulfilled") {
                    setMessage("");

                    if (res.payload.user?.utilisateur?.role === "ADMIN") {
                        navigate("/admin/dashboard");
                    } else {
                        navigate("/accueil");
                    }
                }
            })
        }
    };
    React.useEffect(() => {
        if (isLoggedIn && user?.utilisateur?.role === "ADMIN") {
            navigate("/admin/dashboard");
        } else if (isLoggedIn) {
            navigate("/accueil");
        }
    }, [navigate, isLoggedIn, user]);
    const loginGoogle = useGoogleLogin({
        onSuccess: (tokenResponse) => {

            if (tokenResponse?.access_token || tokenResponse?.credential) {
                const credential = tokenResponse.credential || tokenResponse.access_token;


                const decoded = jwt_decode(credential);
                console.log("Infos Google :", decoded);

                const email = decoded.email;
                const nom = decoded.name;
                const photo = decoded.picture;

                // Ici tu peux connecter l'utilisateur dans ton app
                // par exemple dispatcher vers Redux
                // dispatch(loginGoogle({email, nom, photo}));
            } else {
                console.log("Aucun token reçu !");
            }
        },
        onError: () => {
            console.log("Google Login Failed");
        },
    });

    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center login-container" >
            <Row className="shadow-lg rounded" style={{ width: '900px', height: '600px', backgroundColor: 'white' }}>
                <Col md={6} className="p-5 d-flex flex-column justify-content-center">
                    <div className="mb-4 d-flex align-items-center logo-title-container">
                        <img src={logo} alt="logo" className="login-logo" />
                        <h3 className="login-title">Connectez-vous</h3>
                    </div>

                    <div className="mb-4 d-flex justify-content-center gap-3">
                        <Button variant="outline-primary" className="rounded-circle d-flex align-items-center justify-content-center p-0" style={{ width: 40, height: 40 }}>
                            <i className="fab fa-facebook-f"></i>
                        </Button>
                        <Button
                            variant="outline-danger"
                            className="rounded-circle d-flex align-items-center justify-content-center p-0"
                            style={{ width: 40, height: 40 }}
                            onClick={() => loginGoogle()}
                        >
                            <i className="fab fa-google"></i>
                        </Button>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                        <div className="flex-grow-1 border-top"></div>
                        <div className="px-2 text-muted" style={{ fontSize: '0.9rem' }}>ou continuez via email ou téléphone</div>
                        <div className="flex-grow-1 border-top"></div>
                    </div>

                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-3" controlId="formEmailPhone">
                            <Form.Control
                                type="text"
                                placeholder="Email ou Numéro"
                                name="identifiant"

                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">{errors.emailOrPhone}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formPassword">
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Mot de passe"
                                    name="motDePasse"


                                    onChange={handleChange}
                                />
                                <InputGroup.Text onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                    <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </InputGroup.Text>
                                <Form.Control.Feedback type="invalid">{errors.motDePasse}</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <div className="text-start mb-3">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/mot-de-passe-oublie');
                                }}
                                style={{ fontSize: '0.9rem', textDecoration: 'none' }}
                            >
                                Mot de passe oublié ?
                            </a>
                        </div>
                        <Button type="submit" className="w-100 mb-3" style={{ backgroundColor: '#0d6efd', border: 'none' }}>
                            Connexion
                        </Button>
                    </Form>

                    {message && (
                        <Typography color="error" className="text-center mt-2">
                            {message}
                        </Typography>
                    )}


                    <div className="text-center mt-auto" style={{ fontSize: '0.85rem' }}>
                        Vous n'avez pas de compte ?{' '}
                        <a href="#" onClick={e => {
                            e.preventDefault();
                            navigate('/Registre');
                        }}>
                            Créer un compte
                        </a>
                    </div>
                </Col>

                <Col md={6} className="p-0 d-none d-md-block">
                    <img
                        src={image}
                        alt="Connexion"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderTopRightRadius: '0.375rem',
                            borderBottomRightRadius: '0.375rem'
                        }}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
