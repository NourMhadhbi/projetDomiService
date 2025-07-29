import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { MdEmail, MdPhone, MdLocationOn, MdWork, MdAccessTime } from 'react-icons/md';

const PageProfil = () => {
    const utilisateur = useSelector(state => state.auth.user);

    if (!utilisateur) return <div>Chargement...</div>;

    const isPrestataire = utilisateur?.utilisateur.role === 'PRESTATAIRE';
    const isClient = utilisateur?.role === 'CLIENT';
    const isEntreprise = !!utilisateur?.prestataire?.entreprise;
    console.log(utilisateur);
    // Gestion image avatar fallback
    const avatarUrl = utilisateur.image || '/images/avatarDefault.png';

    // Format date création compte
    const dateInscription = utilisateur.createdAt
        ? new Date(utilisateur.createdAt).toLocaleDateString('fr-FR', {
            year: 'numeric', month: 'long', day: 'numeric',
        })
        : '-';

    return (
        <>
            <Header isClientConnected={true} />
            <main style={{ backgroundColor: '#f9f9f9', minHeight: '80vh', padding: '3rem 0' }}>
                <Container>
                    <Card className="shadow-sm border-0 rounded-4 p-4">
                        <Row>
                            {/* Colonne avatar + nom + rôle + entreprise */}
                            <Col md={4} className="text-center border-end">
                                <img
                                    src={avatarUrl}
                                    alt="Avatar utilisateur"
                                    className="rounded-circle mb-3"
                                    style={{ width: 160, height: 160, objectFit: 'cover', border: '4px solid #ef3d0b' }}
                                />
                                <h3 className="fw-bold mb-1">
                                    {utilisateur.utilisateur.prenom} {utilisateur.utilisateur.nom}
                                </h3>
                                <Badge
                                    bg={
                                        utilisateur.utilisateur.role === 'PRESTATAIRE'
                                            ? 'info'
                                            : utilisateur.role === 'CLIENT'
                                                ? 'success'
                                                : 'secondary'
                                    }
                                    className="mb-3 text-uppercase px-3 py-2"
                                    style={{ fontSize: '0.9rem' }}
                                >
                                    {utilisateur.role}
                                </Badge>

                                {isEntreprise && (
                                    <div className="mb-3">
                                        <h5 className="mb-0">{utilisateur.entreprise.nomEntreprise}</h5>
                                        {utilisateur.prestataire.entreprise.siteWeb && (
                                            <a
                                                href={`https://${utilisateur.entreprise.siteWeb}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted small d-block"
                                            >
                                                {utilisateur.entreprise.siteWeb}
                                            </a>
                                        )}
                                    </div>
                                )}

                                <Button variant="outline-primary" size="lg">
                                    Modifier le profil
                                </Button>
                            </Col>

                            {/* Colonne détails */}
                            <Col md={8} className="ps-md-5 pt-4 pt-md-0">
                                <Row className="mb-4">
                                    <Col md={6} className="d-flex align-items-center mb-3">
                                        <MdEmail size={22} className="me-2 text-primary" />
                                        <div>
                                            <div className="text-muted small">Email</div>
                                            <div className="fw-semibold">{utilisateur.email || '-'}</div>
                                        </div>
                                    </Col>
                                    <Col md={6} className="d-flex align-items-center mb-3">
                                        <MdWork size={22} className="me-2 text-primary" />
                                        <div>
                                            <div className="text-muted small">Genre</div>
                                            <div className="fw-semibold">{utilisateur.genre || '-'}</div>
                                        </div>
                                    </Col>
                                </Row>

                                {isClient && (
                                    <Row className="mb-4">
                                        <Col md={6} className="d-flex align-items-center mb-3">
                                            <MdPhone size={22} className="me-2 text-primary" />
                                            <div>
                                                <div className="text-muted small">Téléphone</div>
                                                <div className="fw-semibold">{utilisateur.client?.numTel || '-'}</div>
                                            </div>
                                        </Col>
                                        <Col md={6} className="d-flex align-items-center mb-3">
                                            <MdLocationOn size={22} className="me-2 text-primary" />
                                            <div>
                                                <div className="text-muted small">Adresse</div>
                                                <div className="fw-semibold">
                                                    {utilisateur.client?.adresse || '-'}, {utilisateur.client?.ville || '-'}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                )}

                                {isPrestataire && (
                                    <>
                                        <Row className="mb-4">
                                            <Col md={6} className="d-flex align-items-center mb-3">
                                                <MdPhone size={22} className="me-2 text-primary" />
                                                <div>
                                                    <div className="text-muted small">Téléphone</div>
                                                    <div className="fw-semibold">{utilisateur.prestataire?.numTel || '-'}</div>
                                                </div>
                                            </Col>
                                            <Col md={6} className="d-flex align-items-center mb-3">
                                                <MdLocationOn size={22} className="me-2 text-primary" />
                                                <div>
                                                    <div className="text-muted small">Adresse</div>
                                                    <div className="fw-semibold">
                                                        {utilisateur.prestataire?.adresse || '-'}, {utilisateur.prestataire?.ville || '-'}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row className="mb-4">
                                            <Col md={6} className="d-flex align-items-center mb-3">
                                                <MdWork size={22} className="me-2 text-primary" />
                                                <div>
                                                    <div className="text-muted small">Spécialité</div>
                                                    <div className="fw-semibold">{utilisateur.prestataire?.Spécialite || '-'}</div>
                                                </div>
                                            </Col>
                                            <Col md={6} className="d-flex align-items-center mb-3">
                                                <MdAccessTime size={22} className="me-2 text-primary" />
                                                <div>
                                                    <div className="text-muted small">Tarif déplacement</div>
                                                    <div className="fw-semibold">
                                                        {utilisateur.prestataire?.tarifDeplacement
                                                            ? `${utilisateur.prestataire.tarifDeplacement} DT`
                                                            : '-'}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row className="mb-4">
                                            <Col md={12}>
                                                <div className="text-muted small mb-1">Compétences</div>
                                                <Card className="p-3 bg-light rounded">
                                                    {utilisateur.prestataire?.competence || '-'}
                                                </Card>
                                            </Col>
                                        </Row>

                                        <Row className="mb-4">
                                            <Col md={12}>
                                                <div className="text-muted small mb-1">Expérience</div>
                                                <Card className="p-3 bg-light rounded">
                                                    {utilisateur.prestataire?.experience || '-'}
                                                </Card>
                                            </Col>
                                        </Row>
                                    </>
                                )}

                                <div className="text-muted small mt-5 border-top pt-3">
                                    Membre depuis le : <strong>{dateInscription}</strong>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Container>
            </main>
            <Footer />
        </>
    );
};

export default PageProfil;
