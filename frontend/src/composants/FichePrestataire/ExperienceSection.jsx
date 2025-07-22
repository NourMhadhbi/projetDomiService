import React from 'react';

const ExperienceSection = ({ intervenant }) => {

    return (
        <div className="section" style={{ padding: '20px' }}>
            <div className="skills-experience-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {/* Colonne des compétences */}
                <div className="skills-column" style={{ flex: '1', minWidth: '250px' }}>
                    <h3 className="column-title">Compétences personnelles</h3>
                    {intervenant?.prestataire?.competence ? (
                        <p className="section-description" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                            {intervenant?.prestataire?.competence}
                        </p>
                    ) : (
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '10px 15px',
                            fontSize: '14px',
                            color: '#555',
                            lineHeight: '1.5'
                        }}>
                            Ce {intervenant?.prestataire?.entreprise
                                ? intervenant.prestataire.entreprise.nomEntreprise
                                : intervenant?.nom
                            } n'a pas encore ajouté son expérience professionnelle.
                        </div>
                    )}
                </div>

                {/* Colonne de l'expérience */}
                <div className="experience-column" style={{ flex: '1', minWidth: '250px' }}>
                    <h3 className="column-title">Expérience professionnelle</h3>
                    {intervenant?.prestataire?.experience ? (
                        <p className="section-description" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                            {intervenant?.prestataire?.experience}
                        </p>
                    ) : (
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '10px 15px',
                            fontSize: '14px',
                            color: '#555',
                            lineHeight: '1.5'
                        }}>
                            Ce {intervenant?.prestataire?.entreprise
                                ? intervenant.prestataire.entreprise.nomEntreprise
                                : intervenant?.nom
                            } n'a pas encore ajouté son expérience professionnelle.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExperienceSection;
