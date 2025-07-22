import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Map = ({ lat, lng }) => {
    const containerStyle = {
        width: '100%',
        height: '300px'
    };

    const center = {
        lat: lat,
        lng: lng
    };

    return (
        <LoadScript googleMapsApiKey="TA_CLE_API_GOOGLE_MAPS">
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;
