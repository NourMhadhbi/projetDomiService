import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Box, Typography } from '@mui/material';

const MapAccueil = () => {
    const adresse = "route l'afrane km 1.5 sfax";
    const url = `https://www.google.com/maps?q=${encodeURIComponent(adresse)}&output=embed`;

    return (
        <div style={{ marginTop: 20, padding: 0 }}>



            {adresse ? (
                <div style={{ width: '100%', height: '500px', margin: 0, padding: 0 }}>
                    <iframe
                        title="Google Maps"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0, display: 'block' }}
                        src={url}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            ) : (
                <p style={{ color: 'red' }}>Aucune adresse fournie</p>
            )}
        </div>
    );
};

export default MapAccueil;
