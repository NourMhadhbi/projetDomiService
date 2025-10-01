import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, NavLink, useLocation, useParams } from 'react-router-dom';

import NotificationMenu from './NotificationMenu';
import AuthPanelModal from './AuthModals';
import ProfilMenu from './ProfilMenu';
import SideMenu from './SideMenu';
// import { blue } from '@mui/material/colors';
// import logo from '../../assets/img/logo.png';
import AccueilSlider from '../Accueil/AccueilSlider';
import AccueilSliderAdmin from '../Admin/AccueilAdmin/AccueilSliderAdmin';
import { useDispatch, useSelector } from 'react-redux';
import { setOnglet } from "../../features/ongletSlice";
import { fetchServicesNA, fetchService } from '../../features/ServiceSlice';
import {
    faSearch,
    faPhone,
    faEnvelope,
    faMapMarkerAlt,
    faBars,
    faChevronDown,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import { fetchMesSignales } from '../../features/SignalementSlice';

const Header = ({ isClientConnected, intervenant }) => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [filteredServices, setFilteredServices] = useState([]);
    const { mesSignales } = useSelector(state => state.signalement);
    const [isSignaled, setIsSignaled] = useState(false);
    const {
        services,
        service,
        loading: servicesLoading,
        error: servicesError
    } = useSelector((state) => state.service);


    const ongletActif = useSelector((state) => state.onglet.actif);

    const location = useLocation();
    const isAccueil = location.pathname === "/accueil";
    const isAccueilAdmin = location.pathname === "/admin/dashboard";
    /*  États locaux du composant  */
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const serviceId = intervenant?.prestataire?.serviceId;
    useEffect(() => {

        dispatch(fetchServicesNA());
    }, [dispatch]);
    useEffect(() => {
        if (serviceId && location.pathname.startsWith('/ficheintervenant/')) {
            dispatch(fetchService(serviceId));
        }
    }, [serviceId, location.pathname, dispatch]);

    /* Fonctions pour gérer UI  */
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setOpenSubmenu(null);
    };

    const toggleSubmenu = (menuName) => {
        setOpenSubmenu(openSubmenu === menuName ? null : menuName);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        setIsMenuOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            if (ongletActif === 'prestataires') {
                navigate(`/prestataires?search=${encodeURIComponent(searchQuery.trim())}`);
            } else if (ongletActif === 'clients') {
                navigate(`/admin/searchC?search=${encodeURIComponent(searchQuery.trim())}`);
            }
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };
    const [modalOpen, setModalOpen] = useState(false);
    //pour recherche service 
    useEffect(() => {
        if (ongletActif === 'services') {
            const query = searchQuery.toLowerCase();
            const resultats = services.filter((s) =>
                s.nom.toLowerCase().includes(query)
            );
            setFilteredServices(resultats);
        } else {
            setFilteredServices([]);
        }
    }, [searchQuery, services, ongletActif]);
    useEffect(() => {
        if (isClientConnected && user?.utilisateur?.role === "CLIENT" && user?.utilisateur?.id) {
            dispatch(fetchMesSignales(user.utilisateur.id));
        }
    }, [dispatch, isClientConnected, user]);

    // Vérifier si l’intervenant est signalé
    useEffect(() => {
        if (!intervenant || !mesSignales || !isClientConnected || !user?.utilisateur?.role === "CLIENT") return;
        const signaled = mesSignales.some(s => s.prestataireId === intervenant.id);
        setIsSignaled(signaled);
    }, [mesSignales, intervenant, isClientConnected, user]);
    /*  Effet pour fermer la recherche au clic hors  */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isSearchOpen && !e.target.closest('.search-container')) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchOpen]);

    let title = "Service";
    let titre1 = "";
    let breadcrumbItems = [
        { label: "Accueil", to: "/accueil" }
    ];

    if (location.pathname === "/mes-rendez-vous") {
        title = "Mes rendez-vous";
        breadcrumbItems.push({ label: "Mes rendez-vous", to: null });
    } else if (location.pathname.startsWith("/ficheintervenant") || location.pathname.startsWith("/calendrier")) {
        title = service?.nom || "Service";

        breadcrumbItems.push({
            label: intervenant?.prestataire?.entreprise ? "Entreprise" : "Prestataire",
            to: null,
        });

        breadcrumbItems.push({
            label: intervenant?.prestataire?.entreprise
                ? intervenant.prestataire.entreprise.nomEntreprise
                : intervenant?.nom || "Intervenant",
            to: null,
        });
    }
    else if (location.pathname === "/MapAdresse") {
        title = "Localisation";
        const params = new URLSearchParams(location.search);

        if (params.get('adresseA')) {
            titre1 = "Mes avis";
        } else if (params.get('adresseP')) {
            titre1 = "Fiche Prestataire";
        } else if (params.get('adresse')) {
            titre1 = "Mes rendez-vous";
        }

        if (titre1) {
            breadcrumbItems.push({ label: titre1, to: null });
        }
        breadcrumbItems.push({ label: "Localisation", to: null });
    } else if (location.pathname === "/mes-avis") {
        title = "Mes avis";
        breadcrumbItems.push({ label: "Mes avis", to: null });
    }
    else if (location.pathname.startsWith("/prestataires")) {
        title = "Prestataires & Entreprises";


        const params = new URLSearchParams(location.search);
        const serviceIdParam = params.get('service');

        if (serviceIdParam && services) {
            const selectedService = services.find(s => s.id.toString() === serviceIdParam.toString());
            breadcrumbItems.push({
                label: selectedService ? selectedService.nom : "Service",
                to: `/prestataires?service=${serviceIdParam}`
            });
        } else if (params.get('proche')) {

            breadcrumbItems.push({ label: "Prestataires et entreprises proches de vous", to: null });
        }
        else if (params.get('search')) {

            breadcrumbItems.push({ label: "Recherche", to: null });
        }

        else if (params.get('consultes')) {

            breadcrumbItems.push({ label: "Tous les prestataires et entreprises", to: null });
        }

        breadcrumbItems.push({ label: "Prestataires & Entreprises", to: null });
    } else if (location.pathname.startsWith("/contact")) {
        title = "Contactez-nous";
        breadcrumbItems.push({ label: "Contactez-nous", to: null });

    } else if (location.pathname.startsWith("/about")) {
        title = "À propos de nous";
        breadcrumbItems.push({ label: "À propos de nous", to: null });

    } else if (location.pathname.startsWith("/profil")) {
        if (user) {
            const userName = user?.entreprise?.nomEntreprise
                || `${user?.utilisateur?.prenom ?? ""} ${user?.utilisateur?.nom ?? ""}`
                || "-";

            title = "Profil " + userName;
            breadcrumbItems.push({ label: userName, to: null });
        } else {

            title = "Mon profil";
            breadcrumbItems.push({ label: "Mon profil", to: null });
        }
    } else if (location.pathname === "/carnet-de-contacts") {
        title = "carnet-de-contacts";
        breadcrumbItems.push({ label: "carnet-de-contacts", to: null });
    }
    else if (location.pathname === "/intervenants-bloques") {
        title = "intervenants-nonFavoris";
        breadcrumbItems.push({ label: "intervenants-nonFavoris", to: null });
    }
    else if (location.pathname === "/intervenants-signales") {
        title = "intervenants-signales";
        breadcrumbItems.push({ label: "intervenants-signales", to: null });
    }

    else if (location.pathname === "/admin/utilisateurs") {
        title = "Utilisateurs";
        breadcrumbItems.push({ label: "Utilisateurs", to: null });
    }
    else if (location.pathname === "/admin/signales") {
        title = "Signalements";
        breadcrumbItems.push({ label: "Signalements", to: null });
    }
    else if (location.pathname === "/admin/services") {
        title = "Services";
        breadcrumbItems.push({ label: "Services", to: null });
    }
    else if (location.pathname === "/admin/searchC") {
        title = "Clients";
        breadcrumbItems.push({ label: "Clients", to: null });
    }
    if (servicesLoading) return <p>Chargement...</p>;
    if (servicesError) return <p>Erreur Services: {servicesError}</p>;
    return (
        <>

            <div className="top-header">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="contact-info d-flex flex-wrap">
                            <span className="me-4">
                                <FontAwesomeIcon icon={faPhone} className="me-2" /> +216 20714492
                            </span>
                            <span className="me-4">
                                <FontAwesomeIcon icon={faEnvelope} className="me-2" />domiservicesm@gmail.com
                            </span>
                            <span>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" /> Route L'afrane km1.5
                            </span>
                        </div>
                        {/* Bouton Obtenir un rendez-vous uniquement si pas signalé */}

                        {isClientConnected &&
                            location.pathname === `/ficheintervenant/${intervenant?.id}` &&
                            user?.utilisateur?.role === 'CLIENT' &&
                            (!isSignaled ? (
                                <button
                                    className="btn btn-warning btn-obtenir-rdv-top ms-auto me-2"
                                    onClick={() => navigate(`/calendrier/${intervenant.id}`)}
                                >
                                    OBTENIR UN RENDEZ-VOUS
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
                                    fontSize: '14px',
                                    marginTop: '10px'
                                }}>
                                    Ce prestataire a été signalé et n’est pas disponible pour la prise de rendez-vous
                                </div>
                            ))}

                    </div>
                </div>
            </div>

            <header className="main-header">
                <div className="container-fluid ps-2 ps-md-3">
                    <nav className="navbar navbar-expand-lg navbar-light py-3">


                        <a className="navbar-logotitre d-flex align-items-center text-decoration-none" href="#">

                            <div className="navbar-brand">
                                <div className="logo-main">DomiService</div>
                                <div className="logo-tagline">Prestations complètes pour votre domicile</div>
                            </div>
                        </a>

                        <button
                            className="navbar-toggler"
                            type="button"
                            onClick={toggleMenu}
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>


                        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <NavLink
                                        to={user?.utilisateur?.role === "ADMIN" ? "/admin/dashboard" : "/accueil"}
                                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                    >
                                        Accueil
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    {isAccueil ? (
                                        <a
                                            href="#apropos-section"
                                            className="nav-link"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const section = document.getElementById("apropos-section");
                                                if (section) {
                                                    section.scrollIntoView({ behavior: "smooth" });
                                                }
                                            }}
                                        >
                                            À propos De Nous
                                        </a>
                                    ) : (
                                        <NavLink
                                            to="/about"
                                            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                        >
                                            À propos De Nous
                                        </NavLink>
                                    )}
                                </li>
                                <li className={`nav-item dropdown ${openSubmenu === 'services' ? 'show' : ''}`}>
                                    <NavLink
                                        to="/services"
                                        className={({ isActive }) => isActive ? "nav-link active d-flex align-items-center" : "nav-link d-flex align-items-center"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleSubmenu('services');
                                        }}
                                    >
                                        Services <FontAwesomeIcon icon={faChevronDown} className="ms-1" />
                                    </NavLink>

                                    <ul className={`dropdown-menu ${openSubmenu === 'services' ? 'show' : ''}`}>
                                        {servicesLoading && <li className="dropdown-item text-center">Chargement...</li>}
                                        {servicesError && <li className="dropdown-item text-danger">Erreur chargement services</li>}

                                        {services && services.map((service) => (
                                            <li key={service.id}>
                                                <a
                                                    href={`/prestataires?service=${service.id}`}
                                                    className="dropdown-item"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => setOpenSubmenu(null)}
                                                >
                                                    {service.nom}
                                                </a>

                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className={`nav-item dropdown ${openSubmenu === 'pages' ? 'show' : ''}`}>
                                    <NavLink
                                        to="/pages"
                                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleSubmenu('pages');
                                        }}
                                    >
                                        Pages <FontAwesomeIcon icon={faChevronDown} className="ms-1" />
                                    </NavLink>

                                    <ul className={`dropdown-menu ${openSubmenu === 'pages' ? 'show' : ''}`}>
                                        <li>
                                            <NavLink
                                                to="/about"
                                                className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}
                                            >
                                                À propos de nous
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/contact"
                                                className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}
                                            >
                                                Contact
                                            </NavLink>
                                        </li>

                                    </ul>
                                </li>
                                {/* <li className={`nav-item dropdown ${openSubmenu === 'blog' ? 'show' : ''}`}>
                                    <NavLink
                                        to="/blog"
                                        className={({ isActive }) => isActive ? "nav-link active d-flex align-items-center" : "nav-link d-flex align-items-center"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleSubmenu('blog');
                                        }}
                                    >
                                        Blog <FontAwesomeIcon icon={faChevronDown} className="ms-1" />
                                    </NavLink>

                                    <ul className={`dropdown-menu ${openSubmenu === 'blog' ? 'show' : ''}`}>
                                        <li>
                                            <NavLink
                                                to="/blog"
                                                end
                                                className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}
                                            >
                                                Tous les articles
                                            </NavLink>
                                        </li>

                                    </ul>
                                </li> */}
                                <li className="nav-item">
                                    <NavLink
                                        to="/contact"
                                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                    >
                                        Contact
                                    </NavLink>
                                </li>
                            </ul>
                            <button
                                className="search-icon btn btn-link ms-lg-3 me-2"
                                // onClick={isClientConnected ? toggleSearch : undefined}
                                onClick={toggleSearch}
                                style={{
                                    opacity: 1,
                                    pointerEvents: 'auto',
                                }}
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </button>

                            <div
                                style={{
                                    opacity: 1,
                                    pointerEvents: 'auto',
                                }}
                            >
                                <NotificationMenu isClientConnected={isLoggedIn} user={user} />
                            </div>



                            {isClientConnected ? (
                                <>
                                    <div className="ms-3 mt-3 mt-lg-0">
                                        <ProfilMenu user={user} />
                                    </div>
                                    <div className="ms-2 d-flex align-items-center me-0">
                                        <SideMenu color="#1a3a6c" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="btn btn-warning ms-3 mt-3 mt-lg-0"
                                        onClick={() => setModalOpen(true)}
                                    >
                                        <i className="fas fa-user me-2"></i>
                                        Se connecter
                                    </button>


                                    <AuthPanelModal isOpen={modalOpen} setIsOpen={setModalOpen} />
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {isSearchOpen && (
                <div className="search-panel">
                    <div className="container search-container">
                        <form onSubmit={handleSearch} className="search-form">
                            <div className="search-tabs d-flex justify-content-center mb-3">
                                <button
                                    type="button"
                                    className={`btn ${ongletActif === 'prestataires' ? 'btn-oran' : 'btn-outline-oran'} mx-1`}


                                    onClick={() => dispatch(setOnglet("prestataires"))}
                                >
                                    Prestataires / Entreprises
                                </button>

                                <button
                                    type="button"
                                    className={`btn ${ongletActif === 'services' ? 'btn-oran' : 'btn-outline-oran'} mx-1`}
                                    // onClick={() => setOngletActif('services')}
                                    onClick={() => dispatch(setOnglet("services"))}
                                >
                                    Services
                                </button>
                                {user?.utilisateur?.role === "ADMIN" && (
                                    <button
                                        type="button"
                                        className={`btn ${ongletActif === 'clients' ? 'btn-oran' : 'btn-outline-oran'} mx-1`}
                                        // onClick={() => setOngletActif('clients')}
                                        onClick={() => dispatch(setOnglet("clients"))}
                                    >
                                        Clients
                                    </button>
                                )}
                            </div>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Que cherchez-vous ?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <button
                                className="btn btn-link search-submit"
                                type="submit"
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                            <button
                                className="btn btn-link search-close"
                                type="button"
                                onClick={toggleSearch}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </form>

                        {/*  Résultats filtrés : services */}
                        {ongletActif === 'services' && searchQuery && (
                            <div className="resultats-services bg-white shadow-sm rounded p-3 mt-2">
                                {filteredServices.length > 0 ? (
                                    filteredServices.map((s) => (
                                        <NavLink
                                            key={s.id}
                                            to={`/prestataires?service=${s.id}`}
                                            className="d-flex justify-content-between align-items-center border-bottom py-2 text-decoration-none"
                                            style={{ cursor: 'pointer', color: 'black' }}
                                            onClick={() => {
                                                setIsSearchOpen(false);
                                                setSearchQuery('');
                                            }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={s.image ? s.image : 'https://via.placeholder.com/150'}
                                                    alt={s.nom}
                                                    style={{
                                                        width: '60px',
                                                        height: '60px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        marginRight: '12px'
                                                    }}
                                                />
                                                <div>
                                                    <strong>{s.nom}</strong><br />
                                                    <small className="text-muted">
                                                        {s.description?.slice(0, 80)}...
                                                    </small>
                                                </div>
                                            </div>
                                        </NavLink>
                                    ))
                                ) : (
                                    <p className="text-muted text-center">Aucun service trouvé</p>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            )}
            {isAccueilAdmin ? (<div className="page-header-accueil">
                <AccueilSliderAdmin />
            </div>
            ) : isAccueil ? (
                <div className="page-header-accueil">
                    <AccueilSlider />
                </div>
            ) : (
                <div className="page-header">
                    <div className="container text-center text-white">
                        <h1 className="page-title mb-3">{title}</h1>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb justify-content-center mb-0">
                                {breadcrumbItems.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className={`breadcrumb-item${item.to ? "" : " active"}`}
                                        aria-current={item.to ? undefined : "page"}
                                    >
                                        {item.to ? (
                                            <NavLink to={item.to} className="text-warning">
                                                {item.label}
                                            </NavLink>
                                        ) : (
                                            item.label
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>
                </div>
            )}

            {/* <AuthPanelModal /> */}
            <style>{`
.btn-oran {
    background-color: #ff6b00; /* orange */
    color: white;
    border: 1px solid #ff6b00;
}

/* Styles pour bouton inactif (gris / outline) */
.btn-outline-oran {
    background-color: transparent;
    color: #6c757d; /* gris bootstrap */

}

.btn-oran, .btn-oran:focus {
    background-color: #ff6b00;
    color: white;
    border: 1px solid #ff6b00;
    outline: none; /* empêche le contour par défaut */
}} `
            }</style>
        </>
    );
};

export default Header;