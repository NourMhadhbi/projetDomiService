import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientsContact } from '../../features/PrestatairesSlice';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

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

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '40px', paddingBottom: '60px' }}>
                <Container>
                    <h2 className="text-center mb-4" style={{ color: '#1a3a6c', fontWeight: '700' }}>
                        Clients ayant contacté ce prestataire
                    </h2>

                    {loading && <p className="text-center">Chargement...</p>}
                    {error && <p className="text-danger text-center">{error}</p>}
                    {!loading && clients.length === 0 && (
                        <p className="text-muted text-center">Aucun client à afficher.</p>
                    )}

                    <Row className="g-4">
                        {clientsToShow.map((client) => (
                            <Col key={`${client.id}-${client.email}`} xs={12} sm={6} md={4} lg={3}>
                                <Card className="h-100 border-0 rounded-4 shadow-lg" style={{ transition: 'transform 0.2s ease, box-shadow 0.3s' }}>
                                    <Card.Img
                                        variant="top"
                                        src={client.image || "/default-user.png"}
                                        alt={`${client.prenom} ${client.nom}`}
                                        style={{
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderTopLeftRadius: '1rem',
                                            borderTopRightRadius: '1rem'
                                        }}
                                    />
                                    <Card.Body>
                                        <Card.Title className="mb-2" style={{ fontSize: '18px', fontWeight: '600' }}>
                                            {client.prenom} {client.nom}
                                        </Card.Title>
                                        <Card.Text className="text-muted mb-1">
                                            <i className="fas fa-envelope me-2 text-orange" /> {client.email || "Email non fourni"}
                                        </Card.Text>
                                        <Card.Text className="text-muted mb-1">
                                            <i className="fas fa-phone me-2 text-orange" /> {client.numTel || "Numéro non fourni"}
                                        </Card.Text>
                                        <Card.Text className="text-muted mb-1">
                                            <i className="fas fa-map-marker-alt me-2 text-orange" /> {client.ville || "Ville inconnue"}
                                        </Card.Text>
                                        <Card.Text className="text-muted" style={{ fontSize: '13px' }}>
                                            {client.adresse || "Adresse non précisée"}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}

                    </Row>

                    {clients.length > clientsPerPage && (
                        <Stack spacing={2} alignItems="center" className="mt-4">
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Stack>
                    )}
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default ClientsContactPrestataire;
