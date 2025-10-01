import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import validationSchema from './validationSchema'; // adapte le chemin
import '../../assets/css/register.css';
import logo from '../../assets/img/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Form, InputGroup, Button, Modal } from 'react-bootstrap';
import { register } from "../../features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchServicesNA } from '../../features/ServiceSlice';
import { NavLink } from "react-router-dom";
export default function Registre() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submittedRole, setSubmittedRole] = useState('');

    const toggleShowPassword = () => setShowPassword(prev => !prev);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);
    const [errorMessage, setErrorMessage] = useState("");
    const { services, loading: servicesLoading, error: servicesError } = useSelector((state) => state.service);
    useEffect(() => {
        dispatch(fetchServicesNA());
    }, [dispatch]);

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


                const response = await dispatch(register(payload)).unwrap();

                setSubmittedRole(values.role);
                setShowSuccessModal(true);

                // navigate('/login');
            } catch (error) {

                setErrorMessage(
                    error ||
                    "Erreur lors de l'inscription, veuillez réessayer."
                );
            }
            setSubmitting(false);
        },


    });

    // Mise à jour automatique du genre à AUTRE si role ENTREPRISE
    useEffect(() => {
        console.log("Valeurs du formulaire :", formik.values);
        if (formik.values.role === 'ENTREPRISE') {
            formik.setFieldValue('genre', 'ENTITÉ');
        }
    }, [formik.values.role]);
    console.log("Formik values en temps réel :", formik.values);
    const handleCloseModal = () => {
        setShowSuccessModal(false);
        navigate('/login');
    };
    return (
        <div className="registre-background">
            <div className="container py-5" >
                <div
                    className="card mx-auto p-4 shadow-lg"
                    style={{
                        maxWidth: '600px',
                        backgroundColor: 'white',
                        maxHeight: '92vh',
                        overflowY: 'auto',
                    }}
                >
                    <div className="text-center mb-4">
                        <img src={logo} alt="logo" />
                        <h3 className="mt-2 h3">Inscription à DomiService</h3>
                    </div>
                    <form onSubmit={formik.handleSubmit} noValidate >
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
                        {/* Nom & Prénom dynamiques */}
                        <div className="mb-3">
                            <label htmlFor="nom" className="form-label">
                                {formik.values.role === 'ENTREPRISE' ? 'Nom du responsable *' : 'Nom  *'}
                            </label>
                            <input
                                id="nom"
                                name="nom"
                                placeholder="Votre nom"
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
                                placeholder="Votre prénom"
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


                        {/* Champs dynamiques pour ENTREPRISE */}
                        {formik.values.role === 'ENTREPRISE' && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="nomEntreprise" className="form-label">Nom entreprise *</label>
                                    <input
                                        id="nomEntreprise"
                                        name="nomEntreprise"
                                        type="text"
                                        placeholder="Nom de votre entreprise"
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
                                        placeholder="Site web de votre entreprise"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.siteWeb}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="identifiant" className="form-label">Identifiant *</label>
                                    <input
                                        id="identifiant"
                                        name="identifiant"
                                        placeholder=" identifiant de votre entreprise"
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
                                placeholder="Ex: exemple@email.com"
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
                                placeholder="Numéro de téléphone"
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
                                {['HOMME', 'FEMME', 'ENTITÉ'].map((g) => (
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
                                <small className="text-muted">Genre automatiquement mis sur "Entité" pour les entreprises</small>
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
                                        {services && services.length > 0 ? (
                                            services.map(service => (
                                                <option key={service.id} value={service.id}>
                                                    {service.nom}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>Aucun service disponible</option>
                                        )}
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
                                placeholder="Adresse"
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
                                placeholder="Ville"
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
                                        placeholder="Votre domaine de spécialité"
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
                                        placeholder="Description de vos services"
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
                                        placeholder="Votre expérience professionnelle"
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
                                        placeholder="Vos compétences principales"
                                        type="text"
                                        className="form-control"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.competence}
                                    />
                                </div>
                            </>
                        )}

                        {errorMessage && (
                            <div className="alert alert-danger small text-center p-2 mb-3">
                                {errorMessage}
                            </div>
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
                        <div className="text-center mt-3">
                            <p className="mb-0 text-muted fst-italic " style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>
                                Vous avez déjà un compte ?{" "}
                              
                                <a href="#" onClick={e => {
                                    e.preventDefault();
                                    navigate('/login');
                                }}>
                                    Se connecter
                                </a>
                            </p>
                        </div>

                    </form>
                </div>
            </div >
            {/* Modal de confirmation d'inscription */}
            {/* <Modal
                show={showSuccessModal}
                onHide={handleCloseModal}
                centered
                className="success-modal"
            >
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="w-100 text-center text-success fw-semibold">
                        <i className="fas fa-check-circle me-2"></i>
                        Inscription réussie
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="text-center py-4 px-5">
                    <div className="mb-4">
                        <div className="success-animation">
                            <svg width="100" height="100" viewBox="0 0 100 100" className="text-success">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5"
                                    strokeDasharray="283" strokeDashoffset="283" className="circle-animation" />
                                <path fill="none" stroke="currentColor" strokeWidth="8" d="M25,55 l15,15 l35,-35"
                                    strokeDasharray="70" strokeDashoffset="70" className="check-animation" />
                            </svg>
                        </div>
                    </div>

                    <h4 className="modal-title mb-4 fw-bold text-dark">Félicitations ! Votre compte a été créé avec succès</h4>

                    {submittedRole === 'CLIENT' ? (
                        <div>
                            <p className="mb-4 text-muted">Un email de confirmation a été envoyé à votre adresse. Veuillez cliquer sur le lien dans l'email pour activer votre compte.</p>
                            <div className="alert alert-light border-primary text-primary">
                                <p className="mb-0 small">
                                    <i className="fas fa-envelope me-2"></i>
                                    Si vous n'avez pas reçu l'email, vérifiez votre dossier spam ou contactez-nous à <strong>DomiService@gmail.com</strong>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="mb-4 text-muted">Votre compte est en cours de validation par l'administrateur. Cette procédure peut prendre jusqu'à 24 heures.</p>
                            <div className="alert alert-light border-primary text-primary">
                                <p className="mb-0 small">
                                    <i className="fas fa-envelope me-2"></i>
                                    Pour toute question, veuillez contacter DomiService à l'adresse : <strong>DomiService@gmail.com</strong>
                                </p>
                            </div>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer className="justify-content-center border-0 pb-4 pt-0">
                    <Button
                        variant="primary"
                        onClick={handleCloseModal}
                        className="px-4 py-2 rounded-pill fw-medium shadow-sm"
                    >
                        <i className="fas fa-sign-in-alt me-2"></i>Se connecter
                    </Button>
                </Modal.Footer>
            </Modal> */}
            {/* <Modal show={showSuccessModal} onHide={handleCloseModal} centered>
  {/* Header épuré */}
            {/* <Modal.Header closeButton className="border-0">
                <Modal.Title className="w-100 text-center text-success fw-semibold">
                    <i className="fas fa-check-circle me-2"></i>
                    Inscription réussie
                </Modal.Title>
            </Modal.Header> */}

            {/* Corps de la modale *
  <Modal.Body className="text-center py-3">
    {/* Icône ronde stylisée *
    <div className="d-flex justify-content-center mb-3">
      <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 70, height: 70 }}>
        <i className="fas fa-check text-success fs-2"></i>
      </div>
    </div>

    {/* Message principal *
    <h5 className="fw-semibold mb-3">
      Félicitations ! Votre compte a été créé avec succès
    </h5>

    {/* Texte conditionnel *
    {submittedRole === "CLIENT" ? (
      <div>
        <p className="text-muted mb-3">
          Un email de confirmation a été envoyé à votre adresse. Veuillez cliquer sur le lien pour activer votre compte.
        </p>
        <div className="alert alert-light border text-start small">
          <i className="fas fa-envelope me-2 text-primary"></i>
          Si vous n'avez pas reçu l'email, vérifiez vos spams ou contactez-nous à <strong>DomiService@gmail.com</strong>.
        </div>
      </div>
    ) : (
      <div>
        <p className="text-muted mb-3">
          Votre compte est en cours de validation par l’administrateur. Cette procédure peut prendre jusqu’à 24 heures.
        </p>
        <div className="alert alert-light border text-start small">
          <i className="fas fa-envelope me-2 text-primary"></i>
          Pour toute question, contactez DomiService à : <strong>DomiService@gmail.com</strong>.
        </div>
      </div>
    )}
  </Modal.Body>

  {/* Footer épuré *
  <Modal.Footer className="justify-content-center border-0">
    <Button
      variant="success"
      onClick={handleCloseModal}
      className="px-4 py-2 rounded-pill shadow-sm"
    >
      <i className="fas fa-sign-in-alt me-2"></i>
      Se connecter
    </Button>
  </Modal.Footer>
</Modal> */}
            <Modal show={showSuccessModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton className="bg-success text-white border-0 position-relative">
                    <div className="position-absolute top-0 start-50 translate-middle mt-2">
                        <div className="bg-white rounded-circle p-1 shadow">
                            <i className="fas fa-check-circle text-success fa-2x"></i>
                        </div>
                    </div>
                    <Modal.Title className="w-100 text-center pt-2">
                        Inscription Réussie
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <h4 className="modal-title mb-4">Félicitations ! Votre compte a été créé avec succès</h4>

                    {submittedRole === 'CLIENT' ? (
                        <div>
                            <p className="mb-4">Un email de confirmation a été envoyé à votre adresse. Veuillez cliquer sur le lien dans l'email pour activer votre compte.</p>
                            <div className="alert alert-info">
                                <p className="mb-0">
                                    <i className="fas fa-envelope me-2 text-primary"></i>
                                    Si vous n'avez pas reçu l'email, vérifiez votre dossier spam ou contactez-nous à <strong>DomiService@gmail.com</strong>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="mb-4">Votre compte est en cours de validation par l'administrateur.</p>
                            <div className="alert alert-info">
                                <p className="mb-0">
                                    <i className="fas fa-envelope me-2 text-primary"></i>
                                    Pour toute question, veuillez contacter DomiService à l'adresse : <strong>DomiService@gmail.com</strong>
                                </p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="justify-content-center border-0">
                    <Button variant="success" onClick={handleCloseModal} className="px-4 py-2">
                        <i className="fas fa-sign-in-alt me-2"></i>Se connecter
                    </Button>
                </Modal.Footer>
            </Modal>

        </div >
    );
}
