import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientsContact } from '../../features/PrestatairesSlice';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    People as PeopleIcon,
    Business as BusinessIcon
} from '@mui/icons-material';
import { FaHandshake, FaUserAlt, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ClientsContactPrestataire = () => {
    const { prestataireId } = useParams();
    const dispatch = useDispatch();

    const { clients, loading, error } = useSelector(state => state.prestataire);
    const { isLoggedIn } = useSelector((state) => state.auth);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const clientsPerPage = 8;
    const totalPages = Math.ceil(clients.length / clientsPerPage);

    useEffect(() => {
        if (prestataireId) {
            dispatch(fetchClientsContact(prestataireId));
        }
    }, [dispatch, prestataireId]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const clientsToShow = clients.slice(
        (currentPage - 1) * clientsPerPage,
        currentPage * clientsPerPage
    );

    // Calcul des statistiques
    const clientsWithEmail = clients.filter(client => client.email).length;
    const clientsWithPhone = clients.filter(client => client.numTel).length;
    const clientsWithLocation = clients.filter(client => client.ville).length;

    // Fonction pour ouvrir Gmail
    const openGmail = (email) => {
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank');
    };

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <div style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                minHeight: '100vh',
                paddingTop: '40px',
                paddingBottom: '60px'
            }}>
                <Container>

                    <div style={{
                        textAlign: 'center',
                        marginBottom: '3rem',
                        padding: '2rem 1rem',
                        background: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, #1a3a6c 0%, #2c599d 100%)',
                            color: 'white',
                            borderRadius: '50%',
                            marginBottom: '1.5rem'
                        }}>
                            <FaHandshake size="2.5rem" />
                        </div>
                        <h1 style={{
                            color: '#1a3a6c',
                            fontWeight: '700',
                            marginBottom: '0.5rem'
                        }}>
                            Clients qui vous ont contacté
                        </h1>
                        <p style={{
                            color: '#6c757d',
                            fontSize: '1.1rem',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            Retrouvez tous les clients intéressés par vos services
                        </p>
                    </div>


                    <Row className="mb-5 justify-content-center">
                        <Col md={3} sm={6} className="mb-3">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'white',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                                height: '100%'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: 'rgba(26, 58, 108, 0.1)',
                                    color: '#1a3a6c',
                                    borderRadius: '12px',
                                    marginRight: '1rem'
                                }}>
                                    <PeopleIcon />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700', color: '#1a3a6c' }}>
                                        {clients.length}
                                    </h3>
                                    <p style={{ margin: 0, color: '#6c757d' }}>Clients totaux </p>
                                </div>
                            </div>
                        </Col>
                        <Col md={3} sm={6} className="mb-3">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'white',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                                height: '100%'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: 'rgba(244, 128, 32, 0.1)',
                                    color: '#f48020',
                                    borderRadius: '12px',
                                    marginRight: '1rem'
                                }}>
                                    <EmailIcon />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700', color: '#1a3a6c' }}>
                                        {clientsWithEmail}
                                    </h3>
                                    <p style={{ margin: 0, color: '#6c757d' }}>Avec email</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={3} sm={6} className="mb-3">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'white',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                                height: '100%'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                                    color: '#28a745',
                                    borderRadius: '12px',
                                    marginRight: '1rem'
                                }}>
                                    <PhoneIcon />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700', color: '#1a3a6c' }}>
                                        {clientsWithPhone}
                                    </h3>
                                    <p style={{ margin: 0, color: '#6c757d' }}>Avec téléphone</p>
                                </div>
                            </div>
                        </Col>
                        {/* <Col md={3} sm={6} className="mb-3">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'white',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                                height: '100%'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: 'rgba(108, 117, 125, 0.1)',
                                    color: '#6c757d',
                                    borderRadius: '12px',
                                    marginRight: '1rem'
                                }}>
                                    <LocationIcon />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700', color: '#1a3a6c' }}>
                                        {clientsWithLocation}
                                    </h3>
                                    <p style={{ margin: 0, color: '#6c757d' }}>Avec localisation</p>
                                </div>
                            </div>
                        </Col> */}
                    </Row>

                    {loading && (
                        <div className="text-center py-5">
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                border: '3px solid #f3f3f3',
                                borderTop: '3px solid #1a3a6c',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto'
                            }}></div>
                            <p className="mt-3">Chargement des clients...</p>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger text-center" role="alert">
                            <strong>Erreur!</strong> {error}
                        </div>
                    )}

                    {!loading && clients.length === 0 && (
                        <div className="text-center py-5" style={{
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
                        }}>
                            <FaUserAlt size="4rem" color="#dee2e6" />
                            <h4 className="mt-3">Aucun client pour le moment</h4>
                            <p className="text-muted">Les clients qui vous contactent apparaîtront ici.</p>
                        </div>
                    )}

                    <Row className="g-4">
                        {clientsToShow.map((client) => (
                            <Col key={`${client.id}-${client.email}`} xs={12} sm={6} md={4} lg={3}>
                                <Card className="h-100 border-0" style={{
                                    borderRadius: '16px',
                                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                                        <Card.Img
                                            variant="top"
                                            src={client.image || "/default-user.png"}
                                            alt={`${client.prenom} ${client.nom}`}
                                            style={{
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.5s ease'
                                            }}
                                            onError={(e) => {
                                                e.target.src = "/default-user.png";
                                            }}
                                        />
                                        {client.ville && (
                                            <Badge bg="light" text="dark" style={{
                                                position: 'absolute',
                                                bottom: '12px',
                                                left: '12px',
                                                borderRadius: '20px',
                                                padding: '5px 10px',
                                                fontSize: '0.75rem',
                                                backgroundColor: 'rgba(255, 255, 255, 0.85)'
                                            }}>
                                                <LocationIcon fontSize="small" /> {client.ville}
                                            </Badge>
                                        )}
                                    </div>
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="mb-2" style={{ fontSize: '18px', fontWeight: '700', color: '#1a3a6c' }}>
                                            {client.prenom} {client.nom}
                                        </Card.Title>

                                        <div style={{ margin: '1rem 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                <EmailIcon style={{ fontSize: '1rem', color: '#f48020', marginRight: '0.75rem', marginTop: '0.1rem' }} />
                                                <span style={{ fontSize: '0.9rem', color: '#495057' }}>
                                                    {client.email || "Email non fourni"}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                <PhoneIcon style={{ fontSize: '1rem', color: '#f48020', marginRight: '0.75rem', marginTop: '0.1rem' }} />
                                                <span style={{ fontSize: '0.9rem', color: '#495057' }}>
                                                    {client.numTel || "Numéro non fourni"}
                                                </span>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                                <LocationIcon style={{ fontSize: '1rem', color: '#f48020', marginRight: '0.75rem', marginTop: '0.1rem' }} />
                                                <span style={{ fontSize: '0.9rem', color: '#495057' }}>
                                                    {client.ville ? `${client.ville} - ` : ''}
                                                    {client.adresse || "Adresse non précisée"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-3">
                                            <div className="d-flex gap-2">
                                                {client.numTel && (
                                                    <a
                                                        href={`tel:${client.numTel}`}
                                                        className="btn btn-primary btn-sm d-flex align-items-center"
                                                        style={{ borderRadius: '20px' }}
                                                    >
                                                        <PhoneIcon fontSize="small" className="me-1" /> Appeler
                                                    </a>
                                                )}
                                                {client.email && (
                                                    <button
                                                        onClick={() => openGmail(client.email)}
                                                        className="btn btn-outline-primary btn-sm d-flex align-items-center"
                                                        style={{ borderRadius: '20px' }}
                                                    >
                                                        <EmailIcon fontSize="small" className="me-1" /> Email
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {clients.length > clientsPerPage && (
                        <Stack spacing={2} alignItems="center" className="mt-5">
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Stack>
                    )}
                </Container>

                <style>
                    {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    `}
                </style>
            </div>
            <Footer />
        </>
    );
};

export default ClientsContactPrestataire;