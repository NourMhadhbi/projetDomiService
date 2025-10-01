import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPrestatairesRecherche, fetchPrestatairesService } from '../../features/PrestatairesSlice';
import { fetchPopulaireP } from '../../features/HistoriqueSlice';
import { FaShareAlt } from 'react-icons/fa';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { fetchPrestatairesProches, fetchTousPrestataires } from '../../features/UtilisateurSlice';
import { fetchMesSignales } from "../../features/SignalementSlice";
import {
    Box,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Typography,
    Chip
} from '@mui/material';
// const PrestataireCard = ({ prestataire, search, service, proche, consultes }) => {
//     let utilisateur = null;
//     let nomAffiche = '';
//     let contact = '';
//     let adresse = '';
//     let specialite = '';
//     let tarifDeplacement = 'Tarif inconnue';
//     let image = "";
//     let email = "";
//     let distance = ""
//     if (search) {
//         utilisateur = prestataire;

//         nomAffiche = utilisateur.prestataire.entreprise
//             ? utilisateur.prestataire.entreprise.nomEntreprise
//             : `${utilisateur?.prenom || ''} ${utilisateur?.nom || ''}`;

//         // contact = utilisateur?.email || utilisateur.prestataire?.numTel || 'Contact non disponible';

//         email = utilisateur?.email?.trim().toLowerCase();
//         if (email && email !== "null") {
//             contact = email;

//         } else { contact = prestataire?.numTel || "Contact non disponible"; }
//         adresse = utilisateur.prestataire?.ville && utilisateur.prestataire?.adresse
//             ? `${utilisateur.prestataire.ville}, ${utilisateur.prestataire.adresse}`
//             : utilisateur.prestataire?.ville || 'Adresse inconnue';

//         specialite = utilisateur.prestataire?.Spécialite || 'Spécialité inconnue';
//         tarifDeplacement = utilisateur.prestataire?.tarifDeplacement || 'T';
//         image = utilisateur?.image;
//     }
//     else if (service || proche || consultes) {


//         nomAffiche = prestataire.entreprise
//             ? prestataire.entreprise.nomEntreprise
//             : `${prestataire.utilisateur?.prenom || ''} ${prestataire.utilisateur?.nom || ''}`;
//         email = prestataire?.utilisateur?.email?.trim().toLowerCase();
//         if (email && email !== "null") {
//             contact = email;
//         } else { contact = prestataire?.numTel || "Contact non disponible"; }

//         console.log("numtel", prestataire.utilisateur?.email)
//         adresse = prestataire?.ville && prestataire?.adresse
//             ? `${prestataire.ville}, ${prestataire.adresse}`
//             : prestataire?.ville || 'Adresse inconnue';

//         specialite = prestataire?.Spécialite || 'Spécialité inconnue';
//         tarifDeplacement = prestataire?.tarifDeplacement || '';
//         image = prestataire.utilisateur?.image;

//     }


//     return (

//         <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden" >
//<div className="card-header">
//             <img
//                 src={image || "/default-user.png"}
//                 className="card-img-top"
//                 alt="Photo"
//                 style={{
//                     height: "240px",
//                     objectFit: "cover"
//                 }}
//             />
//  <span className="specialite-badge">{specialite}</span>
//</div>
//             <div className="d-flex" style={{ backgroundColor: "#fff" }}>
//                 <div
//                     style={{
//                         width: "6px",
//                         backgroundColor: "#f15a24",
//                         borderTopRightRadius: '4px'
//                     }}
//                 ></div>
//                 <div className="p-3">
//                     <div className="fw-semibold text-dark mb-2" style={{ fontSize: '16px', textTransform: 'capitalize' }}>
//                         {nomAffiche}
//                     </div>

//                     <div className="mb-1" style={{ fontSize: '13px', color: '#f15a24', fontWeight: '500' }}>
//                         {prestataire.specialite || 'Spécialité inconnue'}
//                     </div>

//                     <div className="mb-1 d-flex align-items-center" style={{ fontSize: '13px', color: '#555' }}>
//                         <i className="fas fa-envelope me-2" style={{ color: '#888' }}></i>
//                         {contact}
//                     </div>

//                     <div className="mb-1 d-flex align-items-center" style={{ fontSize: '13px', color: '#555' }}>
//                         <i className="fas fa-map-marker-alt me-2" style={{ color: '#888' }}></i>
//                         {adresse}
//                     </div>

//                     <div className="d-flex align-items-center" style={{ fontSize: '13px', color: '#555' }}>
//                         <i className="fas fa-euro-sign me-2" style={{ color: '#888' }}></i>
//                         <span>Tarif de déplacement : <strong>{tarifDeplacement}DT</strong></span>
//                     </div>
//                     {typeof prestataire.distance === "number" && (
//                         <div className="mb-1 d-flex align-items-center" style={{ fontSize: '13px', color: '#555' }}>
//                             <i className="fas fa-route me-2" style={{ color: '#888' }}></i>
//                             <span>Distance : <strong>{prestataire.distance.toFixed(1)} km</strong></span>
//                         </div>
//                     )}
//                 </div>

//             </div>
//         </div>

//     );
// };

const PrestataireCard = ({ prestataire, search, service, proche, consultes, user, signales }) => {
    const [isSignaled, setIsSignaled] = useState(false);
    let utilisateur = null;
    let nomAffiche = '';
    let contact = '';
    let adresse = '';
    let specialite = '';
    let tarifDeplacement = 'Tarif inconnue';
    let image = "";
    let email = "";
    let distance = "";
    let prestataireId = null;

    if (search) {
        utilisateur = prestataire;

        nomAffiche = utilisateur.prestataire.entreprise
            ? utilisateur.prestataire.entreprise.nomEntreprise
            : `${utilisateur?.prenom || ''} ${utilisateur?.nom || ''}`;

        email = utilisateur?.email?.trim().toLowerCase();
        if (email && email !== "null") {
            contact = email;
        } else { contact = prestataire?.numTel || "Contact non disponible"; }

        adresse = utilisateur.prestataire?.ville && utilisateur.prestataire?.adresse
            ? `${utilisateur.prestataire.ville}, ${utilisateur.prestataire.adresse}`
            : utilisateur.prestataire?.ville || 'Adresse inconnue';

        specialite = utilisateur.prestataire?.Spécialite || 'Spécialité inconnue';
        tarifDeplacement = utilisateur.prestataire?.tarifDeplacement || 'T';
        image = utilisateur?.image;
        prestataireId = utilisateur.id;
    }
    else if (service || proche || consultes) {
        nomAffiche = prestataire.entreprise
            ? prestataire.entreprise.nomEntreprise
            : `${prestataire.utilisateur?.prenom || ''} ${prestataire.utilisateur?.nom || ''}`;

        email = prestataire?.utilisateur?.email?.trim().toLowerCase();
        if (email && email !== "null") {
            contact = email;
        } else { contact = prestataire?.numTel || "Contact non disponible"; }

        adresse = prestataire?.ville && prestataire?.adresse
            ? `${prestataire.ville}, ${prestataire.adresse}`
            : prestataire?.ville || 'Adresse inconnue';

        specialite = prestataire?.Spécialite || 'Spécialité inconnue';
        tarifDeplacement = prestataire?.tarifDeplacement || '';
        image = prestataire.utilisateur?.image;
        prestataireId = prestataire?.utilisateur?.id;
    }
    useEffect(() => {
        if (user?.utilisateur?.role === "CLIENT" && signales) {
            const signal = signales.some(s =>
                s.prestataireId === prestataireId
            );
            setIsSignaled(signal);
        }
    }, [prestataireId, signales, user]);
    const handleRendezVousClick = () => {
        window.location.href = `/calendrier/${prestataireId}`;
    };

    return (
        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
            style={{
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                width: '100%',
                maxWidth: '380px',
                margin: '0 auto'
            }}>
            <div className="position-relative">
                <img
                    src={image || "/default-user.png"}
                    className="card-img-top"
                    alt="Photo"
                    style={{
                        height: "220px",
                        objectFit: "cover",
                        width: "100%"
                    }}
                />
                <div className="position-absolute top-0 end-0 m-3">
                    <span style={{
                        backgroundColor: '#f15a24',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500'
                    }}>
                        {specialite}
                    </span>
                </div>
            </div>

            <div className="d-flex" style={{ backgroundColor: "#fff" }}>
                <div
                    style={{
                        width: "6px",
                        backgroundColor: "#f15a24",
                        borderTopRightRadius: '4px'
                    }}
                ></div>
                <div className="p-4 w-100">
                    <div className="fw-bold text-dark mb-2" style={{ fontSize: '20px', textTransform: 'capitalize' }}>
                        {nomAffiche}
                    </div>

                    <div className="mb-3 d-flex align-items-center">
                        <div style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: 'rgba(241, 90, 36, 0.1)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            flexShrink: '0'
                        }}>
                            <i className="fas fa-envelope" style={{ color: '#f15a24', fontSize: '16px' }}></i>
                        </div>
                        <div>
                            <div style={{ color: '#95a5a6', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Contact</div>
                            <div style={{ color: '#34495e', fontSize: '14px', fontWeight: '500' }}>{contact}</div>
                        </div>
                    </div>

                    <div className="mb-3 d-flex align-items-center">
                        <div style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: 'rgba(241, 90, 36, 0.1)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            flexShrink: '0'
                        }}>
                            <i className="fas fa-map-marker-alt" style={{ color: '#f15a24', fontSize: '16px' }}></i>
                        </div>
                        <div>
                            <div style={{ color: '#95a5a6', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Adresse</div>
                            <div style={{ color: '#34495e', fontSize: '14px', fontWeight: '500' }}>{adresse}</div>
                        </div>
                    </div>

                    <div className="mb-3 d-flex align-items-center">
                        <div style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: 'rgba(241, 90, 36, 0.1)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            flexShrink: '0'
                        }}>
                            <i className="fas fa-euro-sign" style={{ color: '#f15a24', fontSize: '16px' }}></i>
                        </div>
                        <div>
                            <div style={{ color: '#95a5a6', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Tarif de déplacement</div>
                            <div style={{ color: '#34495e', fontSize: '14px', fontWeight: '500' }}>{tarifDeplacement} DT</div>
                        </div>
                    </div>

                    {typeof prestataire.distance === "number" && (
                        <div className="mb-4 d-flex align-items-center">
                            <div style={{
                                width: '36px',
                                height: '36px',
                                backgroundColor: 'rgba(241, 90, 36, 0.1)',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px',
                                flexShrink: '0'
                            }}>
                                <i className="fas fa-route" style={{ color: '#f15a24', fontSize: '16px' }}></i>
                            </div>
                            <div>
                                <div style={{ color: '#95a5a6', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase' }}>Distance</div>
                                <div style={{ color: '#34495e', fontSize: '14px', fontWeight: '500' }}>{prestataire.distance.toFixed(1)} km</div>
                            </div>
                        </div>
                    )}
                    {user?.utilisateur?.role === "CLIENT" && (
                        <div className="mt-3 pt-2 border-top">
                            {!isSignaled ? (
                                <button
                                    style={{
                                        backgroundColor: '#f15a24',
                                        color: 'white',
                                        fontWeight: '600',
                                        borderRadius: '12px',
                                        padding: '14px',
                                        width: '100%',
                                        border: 'none',
                                        fontSize: '16px',
                                        transition: 'background 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#e14a1c'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#f15a24'}
                                    onClick={handleRendezVousClick}
                                >
                                    <i className="fas fa-calendar-check me-2"></i>
                                    Prendre Rendez-vous
                                </button>
                            ) : (
                                <div style={{
                                    color: '#fff',
                                    backgroundColor: '#d9534f',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                    fontSize: '14px'
                                }}>
                                    Ce prestataire a été signalé
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
const ListePrestataires = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const itemsPerPage = 6;
    const [selectedType, setSelectedType] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [selectedVille, setSelectedVille] = useState("");
    const [villesDisponibles, setVillesDisponibles] = useState([]);
    const search = searchParams.get('search');
    const service = searchParams.get('service');
    const proche = searchParams.get('proche');
    const consultes = searchParams.get('consultes');
    const { mesSignales } = useSelector(state => state.signalement);
    const prestatairesProches = useSelector((state) => state.utilisateur.intervenants);
    const prestatairesC = useSelector((state) => state.utilisateur.intervenants);
    // const { data } = useSelector(state => state.historique || {});

    const {

        prestataires: prestatairesFiltres,
        loading: loading,
        erreurRecherche: error
    } = useSelector((state) => state.prestataire);
    let prestataires = [];
    if (search || service) {
        prestataires = Array.isArray(prestatairesFiltres) ? prestatairesFiltres : [];
    } else if (proche) {
        prestataires = Array.isArray(prestatairesProches) ? prestatairesProches : [];
    } else if (consultes) {
        prestataires = Array.isArray(prestatairesC) ? prestatairesC : [];
    }
    useEffect(() => {
        if (search) {
            dispatch(fetchPrestatairesRecherche(search));
        } else if (service) {
            dispatch(fetchPrestatairesService(service));
        } else if (proche) {
            dispatch(fetchPrestatairesProches(user?.utilisateurIdCl));
        } else if (consultes) {
            dispatch(fetchTousPrestataires());
        }
        if (user?.utilisateur?.role === "CLIENT" && user?.utilisateur?.id) {
            dispatch(fetchMesSignales(user.utilisateur.id));
        }
    }, [dispatch, search, service, proche, consultes, user?.utilisateurIdCl, user]);
    useEffect(() => {
        const uniqueVilles = Array.from(
            new Set(prestataires.map(p =>
                (p.prestataire?.ville ?? p.ville ?? "").trim()
            ).filter(Boolean))
        );
        setVillesDisponibles(uniqueVilles);
    }, [prestataires]);
    function getLatLonFromPrestataire(p, isSearch) {
        if (isSearch) {
            return {
                lat: p.prestataire?.latitude ?? null,
                lon: p.prestataire?.longitude ?? null
            };
        } else {
            return {
                lat: p.latitude ?? null,
                lon: p.longitude ?? null
            };
        }
    }
    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;

        const R = 6371; // Rayon de la Terre en km
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }


    // Appliquer filtre par type
    let filtres = [...prestataires];
    console.log("filtre", filtres)
    if (selectedType) {
        filtres = filtres.filter(p => {
            const role = search ? p.role : p.utilisateur?.role;

            return role === selectedType;
        });
    }

    if (selectedVille) {
        filtres = filtres.filter(p => {
            const ville = (p.prestataire?.ville ?? p.ville ?? "").toLowerCase();
            return ville === selectedVille.toLowerCase();
        });
    }

    //  tri
    if (sortBy === "tarifAsc") {
        filtres.sort((a, b) =>
            (a.prestataire?.tarifDeplacement ?? a.tarifDeplacement ?? Infinity) -
            (b.prestataire?.tarifDeplacement ?? b.tarifDeplacement ?? Infinity)
        );
    } else if (sortBy === "tarifDesc") {
        filtres.sort((a, b) =>
            (b.prestataire?.tarifDeplacement ?? b.tarifDeplacement ?? 0) -
            (a.prestataire?.tarifDeplacement ?? a.tarifDeplacement ?? 0)
        );
    } else if (sortBy === "ville") {
        filtres.sort((a, b) => {
            const villeA = (a.prestataire?.ville ?? a.ville ?? "").toLowerCase();
            const villeB = (b.prestataire?.ville ?? b.ville ?? "").toLowerCase();
            return villeA.localeCompare(villeB);
        });
    } else if (sortBy === "proximite" && user) {
        const lat1 = user.latitude;
        const lon1 = user.longitude;

        const isSearch = !!search;

        filtres = filtres.map(p => {
            const { lat, lon } = getLatLonFromPrestataire(p, isSearch);
            const distance = calculateDistance(lat1, lon1, lat, lon);
            return { ...p, distance };
        });

        filtres.sort((a, b) => a.distance - b.distance);
    }
    console.log("clientt", user)
    //pagination
    const totalPages = Math.ceil(filtres.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentFiltres = filtres.slice(indexOfFirst, indexOfLast);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <div className="container mt-5">

                <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div className="section-badge">
                        <i className="fas fa-tools"></i> Nos Prestataires & Entreprises
                    </div>
                    <h1 className="section-title">
                        Trouvez le professionnel <span className="highlight">qu'il vous faut</span>
                    </h1>
                    <p className="section-subtitle">
                        Découvrez notre sélection de prestataires qualifiés pour tous vos besoins
                    </p>
                </div>

                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Chargement des prestataires...</p>
                    </div>
                )}

                {error && (
                    <div className="error-container">
                        <i className="fas fa-exclamation-triangle"></i>
                        <p>{error}</p>
                    </div>
                )}
                {/* <Box
                    className="mb-4"
                    display="flex"
                    flexWrap="wrap"
                    alignItems="center"
                    gap={2}
                >
                    {/* Type *
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="type-select-label">Type</InputLabel>
                        <Select
                            labelId="type-select-label"
                            value={selectedType}
                            label="Type"
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <MenuItem value="">Tous</MenuItem>
                            <MenuItem value="ENTREPRISE">Entreprises</MenuItem>
                            <MenuItem value="PRESTATAIRE">Particuliers</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Trier *
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel id="sort-select-label">Trier par</InputLabel>
                        <Select
                            labelId="sort-select-label"
                            value={sortBy}
                            label="Trier par"
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <MenuItem value="">Aucun</MenuItem>
                            <MenuItem value="tarifAsc">Tarif croissant</MenuItem>
                            <MenuItem value="tarifDesc">Tarif décroissant</MenuItem>
                            {user?.utilisateur?.role === 'CLIENT' && (
                                <MenuItem value="proximite">Plus proche</MenuItem>
                            )}
                            <MenuItem value="ville">Ville</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Ville (visible seulement si "Trier par" = ville) *
                    {sortBy === "ville" && (
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel id="ville-select-label">Ville</InputLabel>
                            <Select
                                labelId="ville-select-label"
                                value={selectedVille}
                                label="Ville"
                                onChange={(e) => setSelectedVille(e.target.value)}
                            >
                                <MenuItem value="">Toutes</MenuItem>
                                {villesDisponibles.map((ville) => (
                                    <MenuItem key={ville} value={ville}>
                                        {ville}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box> */}
                <div className="filters-container">
                    <div className="filters-header">
                        <i className="fas fa-filter"></i>
                        <span>Filtrer et trier</span>
                    </div>

                    <Box
                        className="filters-box"
                        display="flex"
                        flexWrap="wrap"
                        alignItems="center"
                        gap={2}
                    >
                        {/* Type */}
                        <FormControl size="small" className="filter-select" style={{ width: "10%" }}>
                            <InputLabel id="type-select-label">Type</InputLabel>
                            <Select
                                labelId="type-select-label"
                                value={selectedType}
                                label="Type"
                                onChange={(e) => setSelectedType(e.target.value)}
                            // displayEmpty

                            >
                                <MenuItem value="">Tous les types</MenuItem>
                                <MenuItem value="ENTREPRISE">Entreprises</MenuItem>
                                <MenuItem value="PRESTATAIRE">Particuliers</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Trier */}
                        <FormControl size="small" className="filter-select" style={{ width: "10%" }}>
                            <InputLabel id="sort-select-label">Trier par</InputLabel>
                            <Select
                                labelId="sort-select-label"
                                value={sortBy}
                                label="Trier par"
                                onChange={(e) => setSortBy(e.target.value)}
                            //  displayEmpty
                            >
                                <MenuItem value="">Par défaut</MenuItem>
                                <MenuItem value="tarifAsc">Tarif croissant</MenuItem>
                                <MenuItem value="tarifDesc">Tarif décroissant</MenuItem>
                                {user?.utilisateur?.role === 'CLIENT' && (
                                    <MenuItem value="proximite">Plus proche</MenuItem>
                                )}
                                <MenuItem value="ville">Ville</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Ville (visible seulement si "Trier par" = ville) */}
                        {sortBy === "ville" && (
                            <FormControl size="small" className="filter-select">
                                <InputLabel id="ville-select-label">Ville</InputLabel>
                                <Select
                                    labelId="ville-select-label"
                                    value={selectedVille}
                                    label="Ville"
                                    onChange={(e) => setSelectedVille(e.target.value)}
                                //  displayEmpty
                                >
                                    <MenuItem value="">Toutes les villes</MenuItem>
                                    {villesDisponibles.map((ville) => (
                                        <MenuItem key={ville} value={ville}>
                                            {ville}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {/* Badge de résultats */}
                        <div className="results-badge">
                            {filtres.length} {filtres.length === 1 ? 'prestataire' : 'prestataires'} trouvé(s)
                        </div>
                    </Box>
                </div>


                <div className="row g-4" >
                    {currentFiltres.length > 0 ? (
                        currentFiltres.map((p) => (
                            <div className="col-md-6 col-lg-4 mb-4" key={p.utilisateurIdPre} onClick={() => navigate(`/ficheintervenant/${search ? p.id : p.utilisateurIdPre}`)} style={{ cursor: "pointer" }}>
                                <PrestataireCard prestataire={p} search={search} service={service} proche={proche} consultes={consultes} user={user} signales={mesSignales} />
                            </div>
                        ))
                    ) : (
                        !loading && <p className="text-center">Aucun prestataire trouvé.</p>
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
                body {
                    background-color: #f8f9fa !important;
                }
                
                .section-header {
                    padding: 20px 0;
                }
                
                .section-badge {
                    display: inline-block;
                    background: linear-gradient(135deg, #ff6b00 0%, #f15a24 100%);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    box-shadow: 0 4px 10px rgba(241, 90, 36, 0.3);
                }
                
                .section-badge i {
                    margin-right: 8px;
                }
                
                .section-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #1a3a6c;
                    margin-bottom: 15px;
                    line-height: 1.2;
                }
                
                .section-title .highlight {
                    background: linear-gradient(135deg, #ff6b00 0%, #f15a24 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .section-subtitle {
                    font-size: 1.1rem;
                    color: #6c757d;
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                .filters-container {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    margin-bottom: 30px;
                }
                
                .filters-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                    color: #1a3a6c;
                    font-weight: 600;
                }
                
                .filters-header i {
                    margin-right: 10px;
                    color: #f15a24;
                }
                
                .filters-box {
                    padding: 10px 0;
                }
                
                .filter-select {
                    background: white;
                    border-radius: 8px;
                }
                
                .filter-select .MuiOutlinedInput-root {
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                
                .results-badge {
                    background: #e9f7ef;
                    color: #28a745;
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                    margin-left: auto;
                }
                
                .loading-container {
                    text-align: center;
                    padding: 40px 0;
                }
                
                .spinner {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #f15a24;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 15px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .error-container {
                    text-align: center;
                    padding: 20px;
                    background: #ffe6e6;
                    border-radius: 8px;
                    color: #dc3545;
                    margin-bottom: 20px;
                }
                
                .error-container i {
                    font-size: 24px;
                    margin-bottom: 10px;
                    display: block;
                }
                
                .no-results {
                    text-align: center;
                    padding: 60px 20px;
                    color: #6c757d;
                }
                
                .no-results i {
                    font-size: 48px;
                    color: #dee2e6;
                    margin-bottom: 15px;
                }
                
                .no-results h3 {
                    color: #495057;
                    margin-bottom: 10px;
                }
                
                .pagination-container {
                    margin: 40px 0;
                    display: flex;
                    justify-content: center;
                }
                
                @media (max-width: 768px) {
                    .section-title {
                        font-size: 2rem;
                    }
                    
                    .filters-box {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .filter-select {
                        width: 100%;
                    }
                    
                    .results-badge {
                        margin-left: 0;
                        margin-top: 15px;
                        text-align: center;
                    }
                }
            `}</style>
            <Footer />
        </>
    );
};

export default ListePrestataires;
