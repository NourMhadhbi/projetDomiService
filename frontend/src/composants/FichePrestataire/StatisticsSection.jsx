import React, { useEffect, useState } from 'react';
import { FaHeart, FaStar, FaUsers, FaSmile } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getStatistiquesThunk } from '../../features/AvisSlice';

const icons = [FaHeart, FaStar, FaUsers, FaSmile];
const labels = [
    'Clients satisfaits',
    'Note moyenne',
    "Nombre total d'avis",
    'Taux de satisfaction',
];
const isPercent = [false, false, false, true];

const StatisticsSection = ({ id }) => {
    const dispatch = useDispatch();
    const { statistiques, loadingStatistiques, errorStatistiques } = useSelector(state => state.avis);
    const [counts, setCounts] = useState([0, 0, 0, 0]);

    useEffect(() => {
        if (id) dispatch(getStatistiquesThunk(id));
    }, [dispatch, id]);

    useEffect(() => {
        const targetValues = [
            parseInt(statistiques.totalAime) || 0,
            parseFloat(statistiques.moyenneNote) || 0,
            parseInt(statistiques.totalAvis) || 0,
            parseFloat(statistiques.tauxSatisfaction) || 0,
        ];

        const interval = setInterval(() => {
            setCounts(prev =>
                prev.map((val, idx) => {
                    const target = targetValues[idx];
                    if (val < target) {
                        const step = target < 10 ? 0.1 : Math.ceil(target / 50);
                        const newVal = val + step;
                        return newVal >= target ? target : parseFloat(newVal.toFixed(1));
                    }
                    return val;
                })
            );
        }, 40);

        return () => clearInterval(interval);
    }, [statistiques]);

    if (loadingStatistiques)
        return (
            <p style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#555' }}>Chargement des statistiques...</p>
        );
    if (errorStatistiques)
        return (
            <p style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: 'red' }}>Erreur : {errorStatistiques}</p>
        );

    return (
        <section style={{ maxWidth: '1400px', margin: '3rem auto', padding: '0 1rem' }} aria-label="Statistiques principales">
            <div className="section-header" style={{ marginBottom: '2rem' }}>

                <h1 className="section-titleA">Statistiques </h1>
                <div className="section-divider"></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                {counts.map((val, idx) => {
                    const Icon = icons[idx];
                    return (
                        <div key={idx} style={{
                            background: 'white',
                            padding: '30px 20px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            textAlign: 'center',
                            transition: 'transform 0.3s ease',
                            flex: '1 1 300px',
                            maxWidth: '320px',
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '10px' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#044487', margin: 0 }}>
                                    {val}{isPercent[idx] ? ' %' : idx === 1 ? ' /10' : ''}
                                </div>
                                <Icon style={{ width: '50px', height: '50px', color: 'rgba(255,107,0,0.8)' }} />
                            </div>
                            <div style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '5px' }}>{labels[idx]}</div>
                            <div style={{ fontSize: '0.9rem', color: '#adb5bd', fontStyle: 'italic' }}>Domiservice - Suivi des performances</div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default StatisticsSection;
