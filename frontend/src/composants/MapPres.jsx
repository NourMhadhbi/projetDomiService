import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import {
    Box, Typography
} from '@mui/material';
import { useSelector } from 'react-redux';

const MapAdresse = () => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
     const adresse = params.get('adresseA') || params.get('adresse') || params.get('adresseP');

    const url = `https://www.google.com/maps?q=${encodeURIComponent(adresse)}&output=embed`;

    return (
        <div>
            <Header isClientConnected={isLoggedIn} />
            <div style={{ padding: '0.5rem', marginBottom: '0' }}>
                <Box mb={3} display="flex" alignItems="center">
                    <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: 35, color: '#ff6b00', marginRight: 10 }} />
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a3a6c' }}>Carte : {adresse}</Typography>
                        <Box sx={{ height: 4, width: '100px', backgroundColor: '#ff6b00', borderRadius: 2, mt: 1 }} />
                    </Box>
                </Box>

                {adresse ? (
                    <div style={{ width: '100%', height: '600px' }}>
                        <iframe
                            title="Google Maps"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
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
            <Footer />
        </div>
    );
};

export default MapAdresse;
