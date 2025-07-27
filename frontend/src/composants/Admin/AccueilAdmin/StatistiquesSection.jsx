import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStatistiquesAppThunk } from '../../features/AvisSlice';

const StatistiquesSection = () => {
  const dispatch = useDispatch();

  const { statistiques, loadingStatistiques } = useSelector(state => state.avis);

  useEffect(() => {
    dispatch(getStatistiquesAppThunk());
  }, [dispatch]);

  const {
    successfulProjects = 0,
    satisfiedCustomerCount = 0,
    expertPrestataires = 0,
    qualityPercent = 0
  } = statistiques || {};

  const stats = [
    { value: successfulProjects, label: "Projets Réussis" },
    { value: satisfiedCustomerCount, label: "Clients Satisfaits" },
    { value: expertPrestataires, label: "Prestataires Experts" },
    { value: `${qualityPercent}%`, label: "Produits de Qualité" }
  ];

  return (
    <>
      <div className="statistiques-container">
        {loadingStatistiques ? (
          <p>Chargement des statistiques...</p>
        ) : (
          stats.map((stat, index) => (
            <div key={index} className="statistiques-item">
              <h2 className="statistiques-value">{stat.value}</h2>
              <p className="statistiques-label">{stat.label}</p>
            </div>
          ))
        )}
      </div>

      <style>{`
        .statistiques-container {
          display: flex;
          justify-content: space-between;
          background-color: #f8f8f8;
          padding: 40px 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
          text-align: center;
          flex-wrap: wrap;
        }

        .statistiques-item {
          flex: 1;
          border-right: 1px solid #ddd;
          padding: 10px 0;
        }

        .statistiques-item:last-child {
          border-right: none;
        }

        .statistiques-value {
          color: #ea3a0e;
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .statistiques-label {
          color: #555;
          font-size: 1rem;
          margin: 0;
        }

        @media (max-width: 768px) {
          .statistiques-item {
            flex: 100%;
            border-right: none;
            border-bottom: 1px solid #ddd;
          }
          .statistiques-item:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </>
  );
};

export default StatistiquesSection;
