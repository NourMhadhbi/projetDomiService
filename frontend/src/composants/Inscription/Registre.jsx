import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import validationSchema from './validationSchema'; // adapte le chemin
import '../../assets/css/register.css';
import logo from '../../assets/img/logo.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { register } from "../../features/AuthSlice";
import { useDispatch } from "react-redux";

export default function Registre() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [services, setServices] = useState([]);

    const toggleShowPassword = () => setShowPassword(prev => !prev);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);

    useEffect(() => {
        // Exemple statique : remplacer par appel API si besoin
        setServices([
            { id: 1, nom: 'Plomberie' },
            { id: 2, nom: 'Electricité' },
            { id: 3, nom: 'Jardinage' },
        ]);
    }, []);

    const formik = useFormik({
        initialValues: {
            nom: '',
            prenom: '',
            role: 'CLIENT',
            email: '',
            numTel: '',
            motDePasse: '',
            confirmationMotDePasse: '',
            genre: '',
            adresse: '',
            ville: '',
            tarifDeplacement: "",
            experience: '',
            competence: '',
            nomEntreprise: '',

            siteWeb: '',

            identifiant: '',
            serviceId: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const payload = {
                    ...values,
                    tarifDeplacement: values.tarifDeplacement ? Number(values.tarifDeplacement) : 0.0,
                    serviceId: Number(values.serviceId),
                };
                console.log("Payload envoyé au register :", payload);

                const response = await dispatch(register(payload)).unwrap();

                console.log("Réponse reçue du backend :", response);
                if (!response.success) {
                    console.error("Erreur lors de l'inscription:", values);
                    alert(response.message || "Erreur lors de l'inscription, veuillez réessayer.");
                    setSubmitting(false);
                    return;
                }
                navigate('/login');
            } catch (error) {
                console.error("Erreur lors de l'inscription:", error);
                alert(error?.response?.data?.message || error?.message || "Erreur lors de l'inscription, veuillez réessayer.");
            }
            setSubmitting(false);
        },


    });

    // Mise à jour automatique du genre à AUTRE si role ENTREPRISE
    useEffect(() => {
        console.log("Valeurs du formulaire :", formik.values);
        if (formik.values.role === 'ENTREPRISE') {
            formik.setFieldValue('genre', 'AUTRE');
        }
    }, [formik.values.role]);
    console.log("Formik values en temps réel :", formik.values);
    return (
        <div className="registre-background">
            <div className="container py-5" >
                <div className="card mx-auto p-4 shadow-lg" style={{ maxWidth: '600px', backgroundColor: "white" }}>
                    <div className="text-center mb-4">
                        <img src={logo} alt="logo" />
                        <h3 className="mt-2 h3">Inscription à DomiService</h3>
                    </div>
                    <form onSubmit={formik.handleSubmit} noValidate >
                        {/* Nom & Prénom dynamiques */}
                        <div className="mb-3">
                            <label htmlFor="nom" className="form-label">
                                {formik.values.role === 'ENTREPRISE' ? 'Nom du responsable *' : 'Nom  *'}
                            </label>
                            <input
                                id="nom"
                                name="nom"
                                type="text"
                                className={`form-control ${formik.touched.nom && formik.errors.nom ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.nom}
                            />
                            {formik.touched.nom && formik.errors.nom && (
                                <div className="invalid-feedback">{formik.errors.nom}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="prenom" className="form-label">
                                {formik.values.role === 'ENTREPRISE' ? 'Prénom du responsable *' : 'Prénom *'}
                            </label>
                            <input
                                id="prenom"
                                name="prenom"
                                type="text"
                                className={`form-control ${formik.touched.prenom && formik.errors.prenom ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.prenom}
                            />
                            {formik.touched.prenom && formik.errors.prenom && (
                                <div className="invalid-feedback">{formik.errors.prenom}</div>
                            )}
                        </div>

                        {/* Rôle */}
                        <fieldset className="mb-3">
                            <legend className="col-form-label pt-0">Statut *</legend>
                            <div className="d-flex gap-3">
                                {['CLIENT', 'PRESTATAIRE', 'ENTREPRISE'].map((role) => (
                                    <div className="form-check" key={role}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="role"
                                            id={role.toLowerCase()}
                                            value={role}
                                            checked={formik.values.role === role}
                                            onChange={formik.handleChange}
                                        />
                                        <label className="form-check-label" htmlFor={role.toLowerCase()}>
                                            {role.charAt(0) + role.slice(1).toLowerCase()}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {formik.touched.role && formik.errors.role && (
                                <div className="text-danger small">{formik.errors.role}</div>
                            )}
                        </fieldset>
                        {/* Champs dynamiques pour ENTREPRISE */}
                        {formik.values.role === 'ENTREPRISE' && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="nomEntreprise" className="form-label">Nom entreprise *</label>
                                    <input
                                        id="nomEntreprise"
                                        name="nomEntreprise"
                                        type="text"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.nomEntreprise}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="siteWeb" className="form-label">Site web</label>
                                    <input
                                        id="siteWeb"
                                        name="siteWeb"
                                        type="url"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.siteWeb}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="identifiant" className="form-label">Identifiant unique *</label>
                                    <input
                                        id="identifiant"
                                        name="identifiant"
                                        type="text"
                                        className={`form-control ${formik.touched.identifiant && formik.errors.identifiant ? 'is-invalid' : ''}`}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.identifiant}
                                    />
                                    {formik.touched.identifiant && formik.errors.identifiant && (
                                        <div className="invalid-feedback">{formik.errors.identifiant}</div>
                                    )}
                                </div>
                            </>
                        )}
                        {/* Email */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="invalid-feedback">{formik.errors.email}</div>
                            )}
                        </div>

                        {/* Numéro de téléphone */}
                        <div className="mb-3">
                            <label htmlFor="numTel" className="form-label">Numéro de téléphone </label>
                            <input
                                id="numTel"
                                name="numTel"
                                type="tel"
                                className={`form-control ${formik.touched.numTel && formik.errors.numTel ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.numTel}
                            />
                            {formik.touched.numTel && formik.errors.numTel && (
                                <div className="invalid-feedback">{formik.errors.numTel}</div>
                            )}
                        </div>

                        {/* Mot de passe */}
                        <div className="mb-3 position-relative">
                            <label htmlFor="motDePasse" className="form-label fw-bold">Mot de passe *</label>
                            <Form.Group className="mb-3" controlId="motDePasse">
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        name="motDePasse"
                                        placeholder="Mot de passe"
                                        value={formik.values.motDePasse}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.motDePasse && !!formik.errors.motDePasse}
                                        required
                                    />
                                    <InputGroup.Text
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ cursor: 'pointer' }}
                                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                    >
                                        <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.motDePasse}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </div>

                        {/* Confirmation mot de passe */}
                        <div className="mb-3 position-relative">
                            <label htmlFor="confirmationMotDePasse" className="form-label fw-bold">Confirmation du mot de passe *</label>
                            <Form.Group className="mb-3" controlId="confirmationMotDePasse">
                                <InputGroup>
                                    <Form.Control
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmationMotDePasse"
                                        placeholder="Confirmation du mot de passe"
                                        value={formik.values.confirmationMotDePasse}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.confirmationMotDePasse && !!formik.errors.confirmationMotDePasse}
                                        required
                                    />
                                    <InputGroup.Text
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{ cursor: 'pointer' }}
                                        aria-label={showConfirmPassword ? "Masquer la confirmation" : "Afficher la confirmation"}
                                    >
                                        <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.confirmationMotDePasse}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </div>

                        {/* Genre  */}
                        <fieldset className="mb-3">
                            <legend className="col-form-label pt-0">Genre *</legend>
                            <div className="d-flex gap-4 flex-wrap">
                                {['HOMME', 'FEMME', 'AUTRE'].map((g) => (
                                    <div className="form-check" key={g}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="genre"
                                            id={g.toLowerCase()}
                                            value={g}
                                            checked={formik.values.genre === g}
                                            onChange={formik.handleChange}
                                        />
                                        <label className="form-check-label" htmlFor={g.toLowerCase()}>
                                            {g.charAt(0) + g.slice(1).toLowerCase()}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {formik.touched.genre && formik.errors.genre && (
                                <div className="text-danger small">{formik.errors.genre}</div>
                            )}
                            {formik.values.role === 'ENTREPRISE' && (
                                <small className="text-muted">Genre automatiquement mis sur "Autre" pour les entreprises</small>
                            )}
                        </fieldset>
                        {/* Select service pour PRESTATAIRE ou ENTREPRISE */}
                        {(formik.values.role === 'PRESTATAIRE' || formik.values.role === 'ENTREPRISE') && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="tarifDeplacement" className="form-label">
                                        Tarif de déplacement
                                    </label>
                                    <input
                                        id="tarifDeplacement"
                                        name="tarifDeplacement"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.tarifDeplacement ?? ""}
                                        placeholder="Ex : 10.50"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="serviceId" className="form-label">Service *</label>
                                    <select
                                        id="serviceId"
                                        name="serviceId"
                                        className={`form-select ${formik.touched.serviceId && formik.errors.serviceId ? 'is-invalid' : ''}`}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.serviceId}
                                    >
                                        <option value="">-- Sélectionnez un service --</option>
                                        {services.map(service => (
                                            <option key={service.id} value={service.id}>
                                                {service.nom}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.serviceId && formik.errors.serviceId && (
                                        <div className="invalid-feedback">{formik.errors.serviceId}</div>
                                    )}
                                </div></>
                        )}

                        {/* Adresse */}
                        <div className="mb-3">
                            <label htmlFor="adresse" className="form-label">Adresse *</label>
                            <input
                                id="adresse"
                                name="adresse"
                                type="text"
                                className={`form-control ${formik.touched.adresse && formik.errors.adresse ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.adresse}
                            />
                            {formik.touched.adresse && formik.errors.adresse && (
                                <div className="invalid-feedback">{formik.errors.adresse}</div>
                            )}
                        </div>

                        {/* Ville */}
                        <div className="mb-3">
                            <label htmlFor="ville" className="form-label">Ville *</label>
                            <input
                                id="ville"
                                name="ville"
                                type="text"
                                className={`form-control ${formik.touched.ville && formik.errors.ville ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.ville}
                            />
                            {formik.touched.ville && formik.errors.ville && (
                                <div className="invalid-feedback">{formik.errors.ville}</div>
                            )}
                        </div>

                        {/* Champs dynamiques pour PRESTATAIRE */}
                        {(formik.values.role === 'PRESTATAIRE' || formik.values.role === 'ENTREPRISE') && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="competence" className="form-label">Spécialite</label>
                                    <input
                                        id="Spécialite"
                                        name="Spécialite"
                                        type="text"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.Spécialite}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="competence" className="form-label">description Courte</label>
                                    <input
                                        id="descriptionCourte"
                                        name="descriptionCourte"
                                        type="text"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.descriptionCourte}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="experience" className="form-label">Expérience</label>
                                    <input
                                        id="experience"
                                        name="experience"
                                        type="text"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.experience}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="competence" className="form-label">Compétence</label>
                                    <input
                                        id="competence"
                                        name="competence"
                                        type="text"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.competence}
                                    />
                                </div>
                            </>
                        )}




                        <div className="d-flex gap-3 justify-content-start">
                            <button className="btn btn-primary buttom" type="submit" disabled={formik.isSubmitting}>
                                S'inscrire
                            </button>
                            <button
                                className="btn btn-secondary buttom"
                                type="reset"
                                onClick={() => formik.resetForm()}
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
