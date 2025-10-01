import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { useNavigate } from 'react-router-dom';
import domiServe from '../../assets/img/domiserivice.jpg';
import { fetchIntervenant, fetchPrestatairesProches, fetchIntervenantbyId } from '../../features/UtilisateurSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMesSignales } from '../../features/SignalementSlice';

const PrestatairesProche = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const dispatch = useDispatch();
  const hasFetchedRef = useRef(false);

  const userId = user?.utilisateurIdCl;
  const intervenants = useSelector((state) => state.utilisateur.intervenants);
  const intervenantsFetched = useSelector((state) => state.utilisateur.intervenantsFetched);
  const navigate = useNavigate();
  const { mesSignales } = useSelector(state => state.signalement);
  const [isSignaled, setIsSignaled] = useState(false);
  const hasFetched = useRef(false);
  useEffect(() => {
    if (user?.utilisateur?.role === "CLIENT" && user?.utilisateur?.id) {
      dispatch(fetchMesSignales(user.utilisateur.id));
    }
  }, [dispatch, user]);


  useEffect(() => {
    if (user?.utilisateur?.role === "CLIENT" && mesSignales) {
      const signal = mesSignales.some(s => s.prestataireId === user.utilisateurIdPre);
      setIsSignaled(signal);
    }
  }, [mesSignales, user.utilisateurIdPre, user]);
  useEffect(() => {
    if (!user || !user.utilisateur) return;
    console.log("intervenant fetched", intervenantsFetched)
    if (user.utilisateur.role === 'CLIENT' /*&& user.utilisateurIdCl*/ && !intervenantsFetched) {
      dispatch(fetchPrestatairesProches(userId));
    }

  }, [dispatch, user, userId, intervenantsFetched]);

  const prestataires = intervenants;

  const handleRendezVousClick = (prestataireId, e) => {
    e.stopPropagation();
    window.open(`/calendrier/${prestataireId}`, "_blank");
  };
  const isPrestataireSignaled = (prestataireId) => {
    return mesSignales?.some(
      s => s.prestataireId === prestataireId
    );
  };
  return (
    <section className="prestataires-proches-section">
      <div className="background-overlay"></div>

      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <i className="fas fa-map-marker-alt"></i> À proximité de chez vous
          </span>
          <h2 className="section-title">
            Prestataires et entreprises disponibles <span className="highlight">autour de vous</span>
          </h2>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={4}
          spaceBetween={25}
          loop={prestataires.length > 1}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 15 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 25 },
            1280: { slidesPerView: 4, spaceBetween: 25 },
          }}
        >
          {Array.isArray(prestataires) && prestataires
            .filter(p => p && p.utilisateur)
            .map((p, i) => (
              <SwiperSlide key={i}>
                <div
                  className={`prestataire-card ${activeCard === i ? 'active' : ''}`}
                  onClick={() => navigate(`/ficheintervenant/${p.utilisateurIdPre}`)}
                  onMouseEnter={() => setActiveCard(i)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div className="card-image-container">
                    <img
                      src={p?.utilisateur?.image ? p.utilisateur.image : '/default-user.png'}
                      alt={p?.utilisateur?.nom ?? 'Prestataire'}
                      className="card-image"
                    />
                    <div className="card-overlay"></div>
                    <div className="distance-badge">
                      <i className="fas fa-map-marker-alt"></i> {p.distance?.toFixed(1) ?? '?'} km
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="prestataire-info">
                      <h3 className="prestataire-name">
                        {p.entreprise
                          ? p.entreprise.nomEntreprise
                          : `${p.utilisateur?.prenom ?? ''} ${p.utilisateur?.nom ?? ''}`}
                      </h3>
                      <p className="prestataire-specialty">{p.Spécialite ?? 'Spécialité inconnue'}</p>


                    </div>

                    <div className="card-actions">
                      <div
                        className="share-container"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <button className="share-button">
                          <i className="fas fa-share-alt"></i>
                        </button>

                        {hoveredIndex === i && (
                          <div className="social-tooltip">
                            <a href="#"><i className="fab fa-facebook-f"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                          </div>
                        )}
                      </div>
                      {user?.utilisateur?.role === "CLIENT" && (
                        !isPrestataireSignaled(p.utilisateurIdPre) ? (
                          <button
                            className="rdv-button"
                            onClick={(e) => handleRendezVousClick(p.utilisateurIdPre, e)}
                          >
                            <i className="fas fa-calendar-check"></i> Prendre Rendez-vous
                          </button>
                        ) : (
                          <div style={{
                            color: '#fff',
                            backgroundColor: '#d9534f',
                            fontWeight: '600',
                            textAlign: 'center',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            fontSize: '12px'
                          }}>
                            Ce prestataire a été signalé
                          </div>
                        )
                      )}
                      {/* <button
                        className="rdv-button"
                        onClick={(e) => handleRendezVousClick(p.utilisateurIdPre, e)}
                      >
                        <i className="fas fa-calendar-check"></i>
                        Prendre Rendez-vous
                      </button> */}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>

        <div className="swiper-navigation">
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>

        {/* <div className="view-all-container">
          <button className="view-all-button" onClick={() => navigate("/prestataires?proche=true")}>
            Voir Tous Nos Prestataires
            <i className="fas fa-arrow-right"></i>
          </button>
        </div> */}
      </div>

      <style jsx>{`
        .prestataires-proches-section {
          position: relative;
          padding: 100px 0;
          background: linear-gradient(135deg, #0a192f 0%, #1e3a5f 100%);
          overflow: hidden;
        }
        
        .background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url(${domiServe}) center/cover no-repeat;
          opacity: 0.1;
        }
        
        .container {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          z-index: 2;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .section-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 87, 34, 0.15);
          color: #ff5722;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .section-badge i {
          margin-right: 8px;
        }
        
        .section-title {
          font-size: 36px;
          font-weight: 700;
          color: white;
          margin: 0;
          line-height: 1.3;
           font-style: italic;
        }
        
        .section-title .highlight {
          color: #ff5722;
          font-style: italic;
        }
        
        .prestataire-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          height: 100%;
          cursor: pointer;
        }
        
        .prestataire-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        
        .prestataire-card.active {
          transform: translateY(-5px);
        }
        
        .card-image-container {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .prestataire-card:hover .card-image {
          transform: scale(1.05);
        }
        
        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .prestataire-card:hover .card-overlay {
          opacity: 1;
        }
        
        .distance-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.9);
          color: #ff5722;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        
        .distance-badge i {
          margin-right: 5px;
          font-size: 10px;
        }
        
        .card-content {
          padding: 20px;
        }
        
        .prestataire-info {
          margin-bottom: 20px;
        }
        
        .prestataire-name {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }
        
        .prestataire-specialty {
          color: #ff5722;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }
        
        .rating {
          display: flex;
          align-items: center;
        }
        
        .stars {
          color: #ffc107;
          margin-right: 8px;
          font-size: 12px;
        }
        
        .rating-text {
          font-size: 12px;
          color: #666;
        }
        
        .card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .share-container {
          position: relative;
        }
        
        .share-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f5f5f5;
          border: none;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .share-button:hover {
          background: #ff5722;
          color: white;
        }
        
        .social-tooltip {
          position: absolute;
          bottom: 100%;
          left: 0;
          background: white;
          border-radius: 10px;
          padding: 10px;
          display: flex;
          gap: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 10px;
          z-index: 10;
        }
        
        .social-tooltip a {
          color: #666;
          font-size: 14px;
          transition: color 0.2s ease;
        }
        
        .social-tooltip a:hover {
          color: #ff5722;
        }
        
        .rdv-button {
          flex: 1;
          margin-left: 15px;
          background: #ff5722;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 15px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .rdv-button i {
          margin-right: 6px;
        }
        
        .rdv-button:hover {
          background: #e64a19;
        }
        
        .swiper-navigation {
          position: relative;
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }
        
        .swiper-button-prev,
        .swiper-button-next {
          position: relative;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          margin: 0 10px;
          transition: all 0.3s ease;
          top: auto;
          left: auto;
          right: auto;
          margin-top: 0;
        }
        
        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 18px;
          font-weight: bold;
        }
        
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background: rgba(255, 87, 34, 0.8);
        }
        
        .view-all-container {
          text-align: center;
          margin-top: 50px;
        }
        
        .view-all-button {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 12px 30px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          transition: all 0.3s ease;
        }
        
        .view-all-button i {
          margin-left: 8px;
          transition: transform 0.3s ease;
        }
        
        .view-all-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .view-all-button:hover i {
          transform: translateX(5px);
        }
        
        @media (max-width: 1024px) {
          .section-title {
            font-size: 30px;
          }
          
          .card-image-container {
            height: 200px;
          }
        }
        
        @media (max-width: 768px) {
          .prestataires-proches-section {
            padding: 70px 0;
          }
          
          .section-header {
            margin-bottom: 40px;
          }
          
          .section-title {
            font-size: 26px;
          }
          
          .prestataire-name {
            font-size: 16px;
          }
          
          .rdv-button {
            font-size: 12px;
            padding: 8px 12px;
          }
        }
        
        @media (max-width: 480px) {
          .card-actions {
            flex-direction: column;
            gap: 10px;
          }
          
          .rdv-button {
            margin-left: 0;
            width: 100%;
          }
          
          .share-container {
            align-self: flex-start;
          }
        }
      `}</style>
    </section>
  );
};

export default PrestatairesProche;