import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchclientsRecherche } from '../../features/ClientSlice';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const ClientCard = ({ client }) => {
    const nomComplet = `${client.prenom} ${client.nom}`;
    // const contact = client.email || client.client?.numTel || 'Non disponible';
    const adresse = `${client.client?.adresse || ''}, ${client.client?.ville || ''}`;

    return (
        <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
            <img
                src={client.image || "/default-user.png"}
                className="card-img-top"
                alt="Client"
                style={{ height: "240px", objectFit: "cover" }}
            />
            <div className="d-flex" style={{ backgroundColor: "#fff" }}>
                <div style={{ width: "6px", backgroundColor: "#f15a24", borderTopRightRadius: '4px' }}></div>
                <div className="p-3">
                    <div className="fw-semibold text-dark mb-2" style={{ fontSize: '16px', textTransform: 'capitalize' }}>
                        {nomComplet}
                    </div>
                    <div className="d-flex align-items-center mb-1" style={{ fontSize: '13px', color: '#555' }}>
                        <i className="fas fa-envelope me-2" style={{ color: '#888' }}></i>
                        {client.email?.trim() || 'Email non disponible'}
                    </div>


                    <div className="d-flex align-items-center mb-1" style={{ fontSize: '13px', color: '#555' }}>
                        <i className="fas fa-phone me-2" style={{ color: '#888' }}></i>
                        {client.client?.numTel?.trim() || 'Téléphone non disponible'}
                    </div>
                    <div className="mb-1 d-flex align-items-center" style={{ fontSize: '13px', color: '#555' }}>
                        <i className="fas fa-map-marker-alt me-2" style={{ color: '#888' }}></i>
                        {adresse}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RechercheClientsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const search = searchParams.get('search');
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { clients, loading, erreurRecherche: error } = useSelector((state) => state.client);

    useEffect(() => {
        if (search) dispatch(fetchclientsRecherche(search));
    }, [dispatch, search]);

    const totalPages = Math.ceil((clients?.length || 0) / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentClients = (clients || []).slice(indexOfFirst, indexOfLast);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <div className="container mt-5">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <span className="pres-label">
                        <i className="fas fa-user" style={{ color: "#ff6b00" }}></i> Nos Clients
                    </span>
                </div>

                {loading && <p className="text-center">Chargement...</p>}
                {error && <p className="text-danger text-center">{error}</p>}

                <div className="row g-4">
                    {currentClients.length > 0 ? (
                        currentClients.map((client) => (
                            <div
                                className="col-md-6 col-lg-3 mb-4"
                                key={client.id}
                                // onClick={() => navigate(`/ficheclient/${client.id}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <ClientCard client={client} />
                            </div>
                        ))
                    ) : (
                        !loading && <p className="text-center">Aucun client trouvé.</p>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <Stack spacing={2}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(_, value) => handlePageClick(value)}
                                variant="outlined"
                                shape="rounded"
                                color="primary"
                                siblingCount={1}
                                boundaryCount={1}
                            />
                        </Stack>
                    </div>
                )}
            </div>

            <style>{` 
                body { background-color: #fff !important; }
                .pres-label {
                    font-size: 35px;
                    font-weight: 700;
                    color: #1a3a6c;
                    font-style: italic;
                    text-align: center;
                }
            `}</style>

            <Footer />
        </>
    );
};

export default RechercheClientsPage;
