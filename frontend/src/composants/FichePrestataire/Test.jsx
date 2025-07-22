import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faPhone, faEnvelope, faMapMarkerAlt, faBars,
    faUser, faList, faComment, faPaperPlane, faChevronRight,
    faCalendarAlt, faClock, faBolt, faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import {
    faFacebookF, faTwitter, faInstagram, faLinkedinIn, faPinterestP
} from '@fortawesome/free-brands-svg-icons';

const Test = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleSkillAnimation = () => {
            const skillBars = document.querySelectorAll('.skill-level');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const width = entry.target.getAttribute('data-width');
                        entry.target.style.width = '0';
                        setTimeout(() => {
                            entry.target.style.width = width;
                        }, 300);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            skillBars.forEach(bar => {
                observer.observe(bar);
            });

            return () => observer.disconnect();
        };

        handleSkillAnimation();
    }, []);

    return (
        <div className="team-details">
            {/* Top Header - Full width */}
            <div className="top-header full-width-container">
                <p>
                    <FontAwesomeIcon icon={faPhone} /> +43 3244 3664 |
                    <FontAwesomeIcon icon={faEnvelope} /> contact@plumer.com |
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> 123 rue Principale, Bristol
                </p>
            </div>

            {/* Main Header - Full width */}
            <div className="full-width-container header-bg">
                <header className="main-header">
                    <div className="header-container">
                        <div className="logo">
                            <div className="logo-main">PLUMER</div>
                            <div className="logo-tagline">PLOMBERIE & RÉPARATION</div>
                        </div>

                        <nav>
                            <ul className={`nav-menu ${isMenuOpen ? 'mobile-open' : ''}`}>
                                <li><a href="#">Accueil</a></li>
                                <li><a href="#">À propos</a></li>
                                <li><a href="#">Services <FontAwesomeIcon icon={faChevronDown} /></a></li>
                                <li><a href="#">Pages <FontAwesomeIcon icon={faChevronDown} /></a></li>
                                <li><a href="#">Blog <FontAwesomeIcon icon={faChevronDown} /></a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </nav>

                        <button className="quote-btn">OBTENIR UN DEVIS</button>

                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                    </div>
                </header>
            </div>

            {/* Page Header - Full width */}
            <div className="full-width-container">
                <div className="page-header">
                    <h1 className="page-title">Détails de l'équipe</h1>
                    <ul className="breadcrumb">
                        <li><a href="#">Accueil</a></li>
                        <li>Détails de l'équipe</li>
                    </ul>
                </div>
            </div>

            {/* Main Content - Centered */}
            <div className="container">
                {/* Profile Section */}
                <div className="section">
                    <h2 className="section-title">Alex Julian</h2>
                    <div className="profile-section">
                        <div className="profile-image">
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=774&q=80"
                                alt="Alex Julian"
                            />
                        </div>
                        <div className="profile-info">
                            <div className="profile-subtitle" style={{ color: 'red' }}>Électricien</div>

                            <div className="social-icons">
                                <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
                                <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                                <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                                <a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a>
                                <a href="#"><FontAwesomeIcon icon={faPinterestP} /></a>
                            </div>

                            <p className="profile-description">
                                Alex Julian est un électricien agréé avec plus de 10 ans d'expérience dans l'industrie
                                électrique. Il est hautement qualifié dans le câblage résidentiel et commercial, les installations
                                industrielles et la maintenance.
                            </p>

                            <div className="contact-details">
                                <div className="contact-item">
                                    <strong>Numéro de téléphone :</strong> +163 2564 3654
                                </div>
                                <div className="contact-item">
                                    <strong>Email :</strong> alexjulian@gmail.com
                                </div>
                                <div className="contact-item">
                                    <strong>Site Web :</strong> https://example.com/
                                </div>
                                <div className="contact-item">
                                    <strong>Adresse :</strong> 12546 LK Road, États-Unis
                                </div>
                                <div className="contact-item">
                                    <strong>Expérience :</strong> 22 ans
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills & Experience */}
                <div className="section">
                    <div className="skills-experience-container">
                        {/* Personal Skills */}
                        <div className="skills-experience-column">
                            <h2 className="section-title">Compétences personnelles</h2>
                            <p className="skills-description">
                                En tant qu'électricien, plusieurs compétences personnelles sont essentielles pour réussir dans
                                ce domaine. Ces compétences incluent : l'attention aux détails. Les électriciens doivent travailler
                                avec précision et prêter une grande attention aux détails afin de garantir que les systèmes
                                électriques soient installés et maintenus de manière sûre et conforme.
                            </p>

                            <div className="skills-grid">
                                {[
                                    { name: "Câblage et installation", percent: "95%" },
                                    { name: "Utilisation d'outils électriques", percent: "90%" },
                                    { name: "Lecture de plans", percent: "95%" },
                                    { name: "Sécurité électrique", percent: "92%" },
                                    { name: "Maintenance industrielle", percent: "88%" },
                                    { name: "Troubleshooting", percent: "96%" }
                                ].map((skill, index) => (
                                    <div className="skill-item" key={index}>
                                        <h4>{skill.name}</h4>
                                        <div className="skill-meter">
                                            <div
                                                className="skill-level"
                                                data-width={skill.percent}
                                                style={{ width: '0' }}
                                            ></div>
                                        </div>
                                        <div className="skill-percent">{skill.percent}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Professional Experience */}
                        <div className="skills-experience-column">
                            <h2 className="section-title">Expérience professionnelle</h2>
                            <p className="experience-description">
                                Les électriciens acquièrent généralement de l'expérience grâce à une combinaison de formation en
                                entreprise et d'enseignement formel. Ils peuvent commencer comme apprentis, sous la supervision
                                d'électriciens expérimentés, pour apprendre le métier et acquérir une expérience pratique.
                                Durant cette période, ils apprennent notamment à installer des systèmes électriques.
                            </p>

                            <ul className="skills-list">
                                {[
                                    "Maintenance domestique",
                                    "Câblage et installation",
                                    "Efficacité énergétique",
                                    "Sécurité électrique",
                                    "Lecture de plans",
                                    "Utilisation d'outils électriques",
                                    "Détection de fuites",
                                    "Systèmes de contrôle",
                                    "Éclairage commercial"
                                ].map((skill, index) => (
                                    <li key={index}>
                                        <FontAwesomeIcon icon={faBolt} />
                                        {skill}
                                    </li>
                                ))}
                            </ul>

                            <div className="experience-description" style={{ marginTop: '30px' }}>
                                <h3>Historique professionnel</h3>
                                <p><strong>2018 - Présent:</strong> Électricien senior chez Électricité Pro</p>
                                <p><strong>2015 - 2018:</strong> Électricien industriel chez TechSolutions</p>
                                <p><strong>2010 - 2015:</strong> Apprenti électricien chez ÉlecPlus</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="section">
                    <h2 className="section-title">Contactez-moi maintenant</h2>
                    <form className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">
                                <FontAwesomeIcon icon={faUser} /> Votre nom :
                            </label>
                            <input type="text" id="name" placeholder="Entrez votre nom" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                <FontAwesomeIcon icon={faEnvelope} /> Adresse email :
                            </label>
                            <input type="email" id="email" placeholder="Entrez votre adresse email" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">
                                <FontAwesomeIcon icon={faPhone} /> Numéro de téléphone :
                            </label>
                            <input type="tel" id="phone" placeholder="Entrez votre numéro de téléphone" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">
                                <FontAwesomeIcon icon={faList} /> Choisissez un sujet :
                            </label>
                            <select id="subject">
                                <option>Demande générale</option>
                                <option>Services électriques</option>
                                <option>Demande de maintenance</option>
                                <option>Service d'urgence</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="message">
                                <FontAwesomeIcon icon={faComment} /> Votre message :
                            </label>
                            <textarea id="message" placeholder="Tapez votre message ici"></textarea>
                        </div>

                        <div className="form-group full-width">
                            <button type="submit" className="submit-btn">
                                Envoyer maintenant <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer - Full width */}
            <div className="full-width-container">
                <footer>
                    <div className="footer-content">
                        <div className="footer-column">
                            <h3>PLUMER</h3>
                            <p><FontAwesomeIcon icon={faClock} /> <strong>Horaires :</strong></p>
                            <ul>
                                <li>Lun - Ven : 8h00 - 18h00</li>
                                <li>Samedi : 8h00 - 17h00</li>
                                <li>Dimanche : Fermé</li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3>Liens rapides</h3>
                            <ul>
                                <li><a href="#"><FontAwesomeIcon icon={faChevronRight} /> À propos</a></li>
                                <li><a href="#"><FontAwesomeIcon icon={faChevronRight} /> Portfolio</a></li>
                                <li><a href="#"><FontAwesomeIcon icon={faChevronRight} /> Aide & FAQs</a></li>
                                <li><a href="#"><FontAwesomeIcon icon={faChevronRight} /> Blog</a></li>
                                <li><a href="#"><FontAwesomeIcon icon={faChevronRight} /> Contact</a></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3>Articles récents</h3>
                            <div className="post-item">
                                <a href="#">Revitaliser vos installations au centre-ville de Bristol.</a>
                                <div className="post-date">
                                    <FontAwesomeIcon icon={faCalendarAlt} /> 12 janv. 2023
                                </div>
                            </div>
                            <div className="post-item">
                                <a href="#">Nous redonnons vie à votre vieille cuisine !</a>
                                <div className="post-date">
                                    <FontAwesomeIcon icon={faCalendarAlt} /> 12 juin 2023
                                </div>
                            </div>
                        </div>

                        <div className="footer-column">
                            <h3>Newsletter</h3>
                            <p>Inscrivez-vous pour recevoir nos actualités :</p>
                            <form className="newsletter-form">
                                <input type="email" placeholder="Entrez votre email" />
                                <button type="submit"><FontAwesomeIcon icon={faPaperPlane} /></button>
                            </form>
                            <div className="brand-text">CARCOSTON</div>
                        </div>
                    </div>

                    <div className="copyright">
                        <p>Copyright © 2023 <span className="brand">Plumer</span>. Tous droits réservés.</p>
                    </div>
                </footer>
            </div>

            <div className="windows-activate full-width-container">
                <p>Activer Windows</p>
            </div>
        </div>
    );
};

export default Test;