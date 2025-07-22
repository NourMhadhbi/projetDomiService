import React, { useEffect } from 'react';



const ProfileSection = ({ isClientConnected, intervenant }) => {

    useEffect(() => {
        // Animation pour les barres de compétences
        const skillBars = document.querySelectorAll('.skill-level');
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-in-out';
                bar.style.width = width;
            }, 300);
        });
    }, []);

    return (
        <div className="section profile-container">
            <div className="profile-section">
                <div className="profile-image">
                    <img
                        src={intervenant?.image}
                        alt={intervenant?.nom || "Intervenant"}
                    />
                </div>
                <div className="profile-info">
                    <div className="profile-header">
                        <h2 className="profile-name" style={{ whiteSpace: "nowrap" }}>  {intervenant?.prestataire?.entreprise ? intervenant.prestataire.entreprise.nomEntreprise : intervenant?.nom}</h2>
                        {intervenant?.specialite && (
                            <span className="profile-subtitle">{intervenant.specialite}</span>
                        )}
                    </div>

                    <div className="profile-social-icons">
                        {['facebook-f', 'twitter', 'instagram', 'linkedin-in', 'pinterest-p'].map((icon, index) => (
                            <a key={index} href="#">
                                <i className={`fab fa-${icon}`}></i>
                            </a>
                        ))}
                    </div>
                    <p className="profile-description" style={{
                        fontSize: '1rem',
                        color: '#444',
                        lineHeight: '1.4',
                        maxWidth: '600px',
                        margin: 'auto',
                        padding: '0 10px',
                        textAlign: 'justify',
                        fontStyle: intervenant?.description ? 'normal' : 'italic',
                        color: intervenant?.description ? '#444' : '#999',
                    }}>
                        {
                            intervenant?.description
                                ? intervenant.description
                                : `Ce ${intervenant?.prestataire?.entreprise
                                    ? intervenant.prestataire.entreprise.nomEntreprise
                                    : intervenant?.nom
                                } n'a pas encore ajouté de description.`
                        }
                    </p>

                    <div className="contact-details">
                        {[
                            { icon: 'phone', text: `+216  ${intervenant?.prestataire?.numTel}` },
                            { icon: 'envelope', text: `${intervenant?.email}` },

                            ...(intervenant?.prestataire?.entreprise?.siteWeb
                                ? [{ icon: 'globe', text: intervenant.prestataire.entreprise.siteWeb }]
                                : []),
                            {
                                icon: 'map-marker-alt',
                                text: `${intervenant?.prestataire?.adresse}`,
                                link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Avenue Habib Bourguiba, Tunis, Tunisie")}`
                            },
                            {
                                icon: 'money-bill-wave',
                                text: intervenant?.prestataire?.tarifDeplacement
                                    ? `${intervenant.prestataire.tarifDeplacement} TND (tarif de déplacement)`
                                    : 'Tarif de déplacement non renseigné'
                            }
                        ].map((item, index) => (
                            <div key={index} className="contact-item">
                                <i className={`fas fa-${item.icon}`}></i>
                                {item.link ? (
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item.text}
                                    </a>
                                ) : (
                                    <span>{item.text}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;