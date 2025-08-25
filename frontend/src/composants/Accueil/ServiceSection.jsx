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
        {/* <button className="services-btn" onClick={() => navigate("/service")}>EXPLOREZ TOUS LES SERVICES</button> */}
      </div>

      <Slider {...settings} className="services-slider" >
        {topServices
          // && topServices.filter(service => service.totalRDV > 0).length > 0 ? (
          //     topServices
          //         .filter(service => service.totalRDV > 0)
          .map((service, index) => (
            <div
              className="service-wrapper"
              key={index}
              onClick={() => {
                console.log("Service cliqué :", service.id);
                navigate(`/prestataires?service=${service.id}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="icon-circle">
                {console.log("image", service.image)}
                <img src={`/${service.image}`} alt={service.nom} />
              </div>
              <div className="service-card">
                <h3>{service.nom}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          ))

          // : 
          // (
          //     <div className="no-service">
          //         Aucun service disponible.
          //     </div>
          // )
        }
      </Slider>


      <style>{`
            .no-service {
  text-align: center;
  color: #999;
  padding: 40px;
}
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

        .services-btn {
          background-color: #e6471d;
          color: #fff;
          border: none;
          padding: 15px 25px;
          font-weight: bold;
          cursor: pointer;
          border-radius: 2px;
        }
   .services-btn:hover {
          background-color: #f8f7f7ff;
          color: #e6471d;
        }
        .services-slider {
          margin-top: 20px;
          gap:1px;
        }

        .service-wrapper {
          position: relative;
          overflow: visible;
          margin: 30px 15px;
        }

        .icon-circle {
          position: absolute;
          top: -50px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 12px solid rgba(169, 168, 217, 0.5);
          z-index: 10;
        }

        .icon-circle img {
          width: 50px;
          height: 100px;
          object-fit: contain;
        
        }

        .service-card {
          position: relative;
          background-color: white;
          padding: 80px 20px 40px;
          clip-path: polygon(0 0%, 100% 5%, 100% 100%, 0% 100%);
        //   border-radius: 0 0 20px 20px;
        //   box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
          text-align: center;
          transition: all 0.3s ease;
          overflow: visible;
          z-index: 1;
          width: 95%;
min-height: 350px;
display: flex;
flex-direction: column;
  gap: 15px;
        }

        .service-card:hover {
          background-color: #e6471d;
          color: white;
        }

.service-card:hover p {
  color: white;
}
        .service-card:hover .icon-circle img {
          filter: brightness(0) invert(1);
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

        .more-btn {
          margin-top: 20px;
          padding: 10px 20px;
          display: inline-block;
          font-weight: 600;
          background-color: white;
          color: #e6471d;
          text-decoration: none;
        }

        .slick-slide,
        .slick-track,
        .services-slider {
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
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;
