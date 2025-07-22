import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, NavLink, useLocation, useParams } from 'react-router-dom';

import NotificationMenu from './NotificationMenu';
import AuthPanelModal from './AuthModals';
import ProfilMenu from './ProfilMenu';
import SideMenu from './SideMenu';
// import { blue } from '@mui/material/colors';
// import logo from '../../assets/img/logo.jpg';
import { useDispatch, useSelector } from 'react-redux';

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


const Header = ({ isClientConnected, intervenant }) => {
    const { id } = useParams();
    console.log("id", id);
    const dispatch = useDispatch();

    console.log("client", isClientConnected);

    const {
        services,
        service,
        loading: servicesLoading,
        error: servicesError
    } = useSelector((state) => state.service);
    useEffect(() => {
        dispatch(fetchServicesNA());
    }, [dispatch]);


    const location = useLocation();
    /*  États locaux du composant  */
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const serviceId = intervenant?.prestataire?.serviceId;
    console.log("service", serviceId)
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
            alert(`Recherche pour: ${searchQuery}`);
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    };

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
    if (servicesLoading) return <p>Chargement...</p>;
    if (servicesError) return <p>Erreur Services: {servicesError}</p>;
    return (
        <>
            {/* Top Header conforme à la capture */}
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
                        {(isClientConnected && location.pathname === `/ficheintervenant/${intervenant?.id}`) && (
                            <button
                                className="btn btn-warning btn-obtenir-rdv-top ms-auto me-2"
                                onClick={() => navigate(`/calendrier/${intervenant.id}`)}
                            >
                                OBTENIR UN RENDEZ-VOUS
                            </button>
                        )}

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
                                        to="/"
                                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                    >
                                        Accueil
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        to="/about"
                                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                                    >
                                        À propos De Nous
                                    </NavLink>
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
                                                <NavLink
                                                    to={`/services/${service.id}`}
                                                    className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}
                                                    onClick={() => setOpenSubmenu(null)}
                                                >
                                                    {service.nom}
                                                </NavLink>
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
                                                to="/pages/about"
                                                className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}
                                            >
                                                À propos de nous
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/pages/team"
                                                className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}
                                            >
                                                Notre équipe
                                            </NavLink>
                                        </li>

                                    </ul>
                                </li>
                                <li className={`nav-item dropdown ${openSubmenu === 'blog' ? 'show' : ''}`}>
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
                                        <li>
                                            <NavLink
                                                to="/blog/conseils-plomberie"
                                                className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}
                                            >
                                                Conseils de plomberie
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/blog/actualites"
                                                className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}
                                            >
                                                Actualités
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/blog/etudes-de-cas"
                                                className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}
                                            >
                                                Études de cas
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/blog/archives"
                                                className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}
                                            >
                                                Archives
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
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
                                onClick={toggleSearch}
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                            <NotificationMenu />

                            {isClientConnected ? (
                                <>

                                    <div className="ms-3 mt-3 mt-lg-0">
                                        <ProfilMenu /*user={user}*/ />
                                    </div>
                                    <div className="ms-2 d-flex align-items-center me-0">
                                        <SideMenu color="#1a3a6c" />

                                    </div>
                                </>
                            ) : (
                                <button
                                    className="btn btn-warning ms-3 mt-3 mt-lg-0"
                                    data-bs-toggle="modal"
                                    data-bs-target="#authPanelModal"
                                >
                                    <i className="fas fa-user me-2"></i>
                                    Se connecter
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {isSearchOpen && (
                <div className="search-panel">
                    <div className="container search-container">
                        <form onSubmit={handleSearch} className="search-form">
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
                    </div>
                </div>
            )}

            <div className="page-header">
                <div className="container text-center">
                    <h1 className="page-title mb-3">
                        {service?.nom || "Service"}
                    </h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb justify-content-center mb-0">
                            <li className="breadcrumb-item">
                                <NavLink to="/" className="text-warning">Accueil</NavLink>
                            </li>
                            <li className="breadcrumb-item" aria-current="page">
                                {intervenant?.prestataire?.entreprise ? "Entreprise" : "Prestataire"}
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                {intervenant?.prestataire?.entreprise
                                    ? intervenant.prestataire.entreprise.nomEntreprise
                                    : intervenant?.nom || "Intervenant"}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <AuthPanelModal />
        </>
    );
};

export default Header;