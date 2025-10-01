import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { useSelector, useDispatch } from 'react-redux';
import imgContact from '../assets/img/contact.jpg';
import MapAccueil from './Accueil/MapAccueil';
import Swal from 'sweetalert2';
import { envoyerContactAsync, resetContactState } from '../features/ContactSlice';

const PageContact = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.contact);

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [sujet, setSujet] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: '⏳ Envoi en cours...',
      html: `<p style="margin:0; font-size: 15px; color:#6c757d;">
             Merci de patienter pendant l’envoi de votre message.
           </p>`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: '#f8f9fa',
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const utilisateurId = isLoggedIn ? user.utilisateur.id : null;
    const contactInfo = email || telephone;

    dispatch(envoyerContactAsync({
      utilisateurId,
      nom,
      prenom,
      email: email || undefined,
      telephone: !email ? telephone : undefined,
      sujet,
      message
    }));
  };

  useEffect(() => {
    if (isLoggedIn && user) {
      setNom(user.utilisateur.nom || '');
      setPrenom(user.utilisateur.prenom || '');
      setEmail(user.utilisateur.email || '');
      setTelephone(user.numTel || '');
    } else {

      setNom('');
      setPrenom('');
      setEmail('');
      setTelephone('');
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (success) {
      Swal.fire({
        title: ' Message envoyé avec succès',
        html: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
          <p style="margin:0; font-size: 15px; line-height:1.5;">
            Merci <strong>${prenom || nom}</strong>, votre message a bien été transmis.<br>
            Notre équipe vous répondra dans les plus brefs délais.
          </p>
        </div>
      `,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#198754',
        background: '#f0f9ff',
        iconColor: '#198754',
        timer: 8000,
        timerProgressBar: true
      });

      setSujet('');
      setMessage('');
      dispatch(resetContactState());
    }
  }, [success, user, dispatch, nom, prenom]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: 'Une erreur est survenue',
        html: `
        <p style="margin:0; font-size: 15px; line-height:1.5;">
          Impossible d’envoyer votre message pour le moment.<br>
          <strong>${error}</strong><br><br>
          Veuillez réessayer plus tard ou contacter notre support.
        </p>
      `,
        icon: 'error',
        confirmButtonText: 'Fermer',
        confirmButtonColor: '#d33',
        background: '#fff5f5',
        iconColor: '#c70000',
      });
    }
  }, [error]);

  return (
    <>
      <Header isClientConnected={isLoggedIn} />

      {/* Section d'infos contact */}
      <div style={{ backgroundColor: '#f8f8f8', padding: '60px 0' }}>
        <Container>
          <Row className="text-center">
            <Col md={4}>
              <div>
                <i className="bi bi-geo-alt-fill" style={{ fontSize: 40, color: '#ff3c00' }}></i>
                <p className="text-muted mt-2">ADRESSE DU BUREAU</p>
                <h5><strong>Route L'afrane Km 1.5, Sfax</strong></h5>
              </div>
            </Col>
            <Col md={4} style={{ backgroundColor: '#ef3d0b', padding: '30px 20px', color: 'white' }}>
              <div>
                <i className="bi bi-telephone-fill" style={{ fontSize: 40 }}></i>
                <p className="mt-2">UNE QUESTION ?</p>
                <h5><strong>+216 20 714 492 </strong></h5>
              </div>
            </Col>
            <Col md={4}>
              <div>
                <i className="bi bi-chat-dots-fill" style={{ fontSize: 40, color: '#ff3c00' }}></i>
                <p className="text-muted mt-2">EMAIL</p>
                <h5><strong>domiservicesm@gmail.com</strong></h5>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Section formulaire + image */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '60px 0' }}>
        <Container style={{ backgroundColor: '#f9f9f9' }}>
          <Row className="align-items-center">
            <Col md={6} className="text-center mb-4 mb-md-0">
              <img
                src={imgContact}
                alt="Plombier"
                style={{
                  width: '90%',
                  maxWidth: '400px',
                  height: 'auto',
                  objectFit: 'contain',
                }}
              />
            </Col>
            <Col md={6} width="70%">
              <h2
                className="mb-4 text-center"
                style={{
                  fontWeight: '700',
                  fontSize: '28px',
                  color: '#1c1c1c',
                }}
              >
                Contactez <span style={{ color: '#ef3d0b', marginRight: '8px' }}>-moi</span> maintenant
              </h2>

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Votre nom"
                      className="py-3 px-3"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      // disabled={isLoggedIn}
                      required
                      style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 0 4px rgba(0,0,0,0.05)' }}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Votre prenom"
                      className="py-3 px-3"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      // disabled={isLoggedIn}
                      required
                      style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 0 4px rgba(0,0,0,0.05)' }}
                    />
                  </Col>

                </Row >
                <Row className="mb-3">
                  <Col>
                    <Form.Control
                      type="email"
                      placeholder="Adresse email"
                      className="py-3 px-3"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      // disabled={isLoggedIn}
                      required
                      style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 0 4px rgba(0,0,0,0.05)' }}
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Numéro de téléphone"
                      className="py-3 px-3"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      // disabled={isLoggedIn}
                      style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 0 4px rgba(0,0,0,0.05)' }}
                    />
                  </Col>
                  <Col>
                    <Form.Select
                      className="py-3 px-3"
                      value={sujet}
                      onChange={(e) => setSujet(e.target.value)}
                      style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 0 4px rgba(0,0,0,0.05)' }}
                    >
                      <option value="">Sélectionner un sujet</option>
                      <option value="Problème de connexion">Problème de connexion</option>
                      <option value="Erreur sur mon compte">Erreur sur mon compte</option>
                      <option value="Demande d’information">Demande d’information</option>
                      <option value="Suggestion ou amélioration">Suggestion ou amélioration</option>
                      <option value="Signalement d’un prestataire">Signalement d’un prestataire</option>
                      <option value="Problème technique">Problème technique</option>
                      <option value="Question sur les fonctionnalités">Question sur les fonctionnalités</option>
                      <option value="Autre">Autre</option>
                    </Form.Select>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Votre message"
                    className="px-3 py-3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    style={{
                      backgroundColor: 'white',
                      border: 'none',
                      resize: 'none',
                      boxShadow: '0 0 4px rgba(0,0,0,0.05)',
                    }}
                  />
                </Form.Group>

                {error && <p style={{ color: 'red', fontWeight: '600' }}>{error}</p>}

                {loading ? (
                  <Button
                    disabled
                    style={{
                      backgroundColor: '#ef3d0b',
                      border: 'none',
                      width: '100%',
                      padding: '15px 0',
                      fontWeight: 600,
                      fontSize: '16px',
                      letterSpacing: '0.5px',
                      opacity: 0.7,
                    }}
                  >
                    Envoi en cours...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: '#ef3d0b',
                      border: 'none',
                      width: '100%',
                      padding: '15px 0',
                      fontWeight: 600,
                      fontSize: '16px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    ENVOYER MAINTENANT
                  </Button>
                )}
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
      <style>{`
     
        .px-3:disabled {
          opacity: 0.8;
          pointer-events: none;
          cursor: not-allowed;
        `}</style>
      <MapAccueil />

      <Footer />
    </>
  );
};

export default PageContact;
