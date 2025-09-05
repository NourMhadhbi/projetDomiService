import React, { useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getTop5Thunk } from '../../features/ServiceSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ServicesSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { topServices, loading, error } = useSelector(state => state.service);

  useEffect(() => {
    dispatch(getTop5Thunk());
  }, [dispatch]);
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    accessibility: true,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="services-section">
      <div className="services-header">
        <div className="services-title-group">
          <span className="services-label">
            <i className="fas fa-tools"></i> Nos Services
          </span>
          <h2 className="services-title">Les Services les Plus Demandés</h2>
        </div>
      </div>

      <Slider {...settings} className="services-slider">
        {topServices.map((service, index) => (
          <div
            className="service-wrapper"
            key={index}
            onClick={() => navigate(`/prestataires?service=${service.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="icon-circle">
              <img
                src={service.image || 'https://via.placeholder.com/150'}
                alt={service.nom}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
            </div>
            <div className="service-card">
              <h3>{service.nom}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </Slider>

      <style>{`
        .services-section {
          background-color: #f2f2f2ff;
          padding: 80px 5%;
        }

        .services-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .services-title-group {
          max-width: 60%;
        }

        .services-label {
          color: #e6471d;
          font-weight: 600;
          font-size: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .services-title {
          font-size: 35px;
          font-weight: 700;
          color: #111;
          font-style: italic;
        }

        .services-slider {
          margin-top: 20px;
        }

        .service-wrapper {
          position: relative;
          margin: 30px 15px;
          padding-top: 40px; /* Réduit l'espace au-dessus */
        }

        .icon-circle {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto;
          background: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 8px solid rgba(169, 168, 217, 0.5); /* Bordure réduite */
          overflow: hidden;
          z-index: 10;
        }

        .icon-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .service-card {
          background-color: white;
          padding: 70px 20px 30px; /* Padding supérieur réduit */
          margin-top: -50px; /* Remonte la carte vers le cercle */
          clip-path: polygon(0 0%, 100% 5%, 100% 100%, 0% 100%);
          text-align: center;
          transition: all 0.3s ease;
          min-height: 320px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          position: relative;
          z-index: 1;
        }

        .service-card:hover {
          background-color: #e6471d;
          color: white;
        }

        .service-card:hover p {
          color: white;
        }

        .service-card h3 {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .service-card p {
          font-size: 15px;
          line-height: 1.6;
          color: #7d7a7aff;
          font-weight: 500;
        }

        .slick-slide,
        .slick-track {
          overflow: visible !important;
        }

        @media (max-width: 768px) {
          .services-title-group {
            max-width: 100%;
          }

          .services-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          
          .service-card {
            min-height: 280px;
            padding: 60px 15px 25px;
          }
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;