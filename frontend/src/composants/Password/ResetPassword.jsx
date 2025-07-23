import React from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';

import logo from '../../assets/img/logo.png';
import image from '../../assets/img/background.jpg';
import AuthService from '../../services/Authservice';

const schema = yup.object().shape({
    newPassword: yup
        .string()
        .required("Le mot de passe est obligatoire")
        .min(8, "Minimum 8 caractères")
        .matches(/[0-9]/, "Doit contenir un chiffre")
        .matches(/[^a-zA-Z0-9]/, "Doit contenir un symbole"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword'), null], "Les mots de passe ne correspondent pas")
        .required("La confirmation est obligatoire"),
});

const ResetPassword = () => {
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const navigate = useNavigate();
    const { state } = useLocation();
    const { identifier, code } = state || {};

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                const response = await AuthService.resetPass(identifier, code, values.newPassword);
                if (response.data.Status === "Mot de passe mis à jour") {
                    navigate('/login');
                } else {
                    setMessage(response.data.Status);
                }
            } catch (error) {
                console.error(error);
                setMessage("Erreur serveur, réessayez.");
            }
        },
    });

    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center login-container">
            <Row className="shadow-lg rounded" style={{ width: '900px', height: '600px', backgroundColor: 'white' }}>
                <Col md={6} className="p-5 d-flex flex-column justify-content-center">
                    <div className="mb-4 d-flex align-items-center logo-title-container">
                        <img src={logo} alt="logo" className="login-logo" />
                        <h3 className="login-title">Réinitialiser le mot de passe</h3>
                    </div>

                    <Form noValidate onSubmit={formik.handleSubmit}>
                        <Form.Group className="mb-3" controlId="formNewPassword">
                            <InputGroup>
                                <Form.Control
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="Nouveau mot de passe"
                                    name="newPassword"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={formik.touched.newPassword && !!formik.errors.newPassword}
                                    required
                                />
                                <InputGroup.Text
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={{ cursor: 'pointer' }}
                                    aria-label={showNewPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                >
                                    <i className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.newPassword}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formConfirmPassword">
                            <InputGroup>
                                <Form.Control
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirmer le mot de passe"
                                    name="confirmPassword"
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                                    required
                                />
                                <InputGroup.Text
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{ cursor: 'pointer' }}
                                    aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                >
                                    <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </InputGroup.Text>
                                <Form.Control.Feedback type="invalid">
                                    {formik.errors.confirmPassword}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Button type="submit" className="w-100 mb-3" style={{ backgroundColor: '#0d6efd', border: 'none' }}>
                            Réinitialiser
                        </Button>
                    </Form>

                    {message && <p className="text-danger text-center">{message}</p>}
                </Col>

                <Col md={6} className="p-0 d-none d-md-block">
                    <img
                        src={image}
                        alt="Réinitialiser le mot de passe"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopRightRadius: '0.375rem', borderBottomRightRadius: '0.375rem' }}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPassword;
