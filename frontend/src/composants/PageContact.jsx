import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { useSelector } from 'react-redux';
import imgContact from '../assets/img/contact.jpg'
import MapAccueil from './Accueil/MapAccueil';
const PageContact = () => {
    const { isLoggedIn } = useSelector((state) => state.auth);

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
        Contactez <span style={{ color: '#ef3d0b' }}>-moi</span> maintenant
        </h2>
 
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Control
                type="text"
                placeholder="Votre nom"
                className="py-3 px-3"
                style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 0 4px rgba(0,0,0,0.05)' }}
              />
            </Col>
            <Col>
              <Form.Control
                type="email"
                placeholder="Adresse email"
                className="py-3 px-3"
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
                style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 0 4px rgba(0,0,0,0.05)' }}
              />
            </Col>
            <Col>
              <Form.Select
                className="py-3 px-3"
                style={{ backgroundColor: 'white', border: 'none', boxShadow: '0 0 4px rgba(0,0,0,0.05)' }}
              >
                <option>Sélectionner un sujet</option>
                <option>Plomberie</option>
                <option>Installation</option>
                <option>Maintenance</option>
              </Form.Select>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Votre message"
              className="px-3 py-3"
              style={{
                backgroundColor: 'white',
                border: 'none',
                resize: 'none',
                boxShadow: '0 0 4px rgba(0,0,0,0.05)',
              }}
            />
          </Form.Group>

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
        </Form>
      </Col>
    </Row>
  </Container>
</div>


<MapAccueil />

            <Footer />
        </>
    );
};

export default PageContact;
