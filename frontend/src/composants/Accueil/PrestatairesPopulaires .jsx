import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import domiServe from '../../assets/img/domiserivice.jpg';
import { fetchPopulaireP } from '../../features/HistoriqueSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PrestatairesPopulaires = ({ isClientConnected }) => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const dispatch = useDispatch();
  const { data: prestataires } = useSelector(state => state.historique || {});
  useEffect(() => {
    dispatch(fetchPopulaireP());
  }, [dispatch]);
  if (!Array.isArray(prestataires)) return null;
  return (
    <section
      className="team-section"
      style={{
        backgroundImage: `url(${domiServe})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <div className="overlay" />

      <div className="team-header">
        <span className="team-label">
          <i className="fas fa-star"></i> Les plus consultés
        </span>
        <h2 className="team-title">
          Les Prestataires et Entreprises <em>les plus consultés cette semaine</em>
        </h2>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        slidesPerView={4}
        spaceBetween={15} // réduit l’espace
        loop
        navigation
        autoplay={{ delay: 3000 }}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 10 },
          768: { slidesPerView: 2, spaceBetween: 12 },
          1024: { slidesPerView: 4, spaceBetween: 15 },
        }}
      >
        {Array.isArray(prestataires) && prestataires.map((p, i) => (
          <SwiperSlide key={i}>
            <div className="custom-card" onClick={() => navigate(`/ficheintervenant/${p.utilisateurIdPre}`)}
              style={{ cursor: 'pointer' }}>
              <div className="image-box">
                <img src={p.utilisateur.image} alt={p.utilisateur.nom} />
              </div>

              <div className="info-row">
                <div
                  className="share-box"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <i className="fas fa-share-alt" />
                  {hoveredIndex === i && (
                    <div className="social-popup">
                      <i className="fab fa-facebook-f" />
                      <i className="fab fa-twitter" />
                      <i className="fab fa-instagram" />
                      <i className="fab fa-linkedin-in" />
                    </div>
                  )}
                </div>
                <div className="text-zone">
                  <h3>
                    {p.entreprise
                      ? p.entreprise.nomEntreprise
                      : `${p.utilisateur?.prenom ?? ''} ${p.utilisateur?.nom ?? ''}`}
                  </h3>
                  <p>{p.utilisateur.specialite}</p>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
        <button className="prestataire-btn" disabled={!isClientConnected} onClick={() => navigate("/prestataires?consultes=true")}>
          Voir Tous Nos Prestataires & Entreprises
        </button>
      </Swiper>

      <style>{`
    .prestataire-btn:disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
        .overlay {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.2));
          backdrop-filter: blur(2px); 
          z-index: 1;
        }

        .team-section {
          padding: 100px 5% 80px;
          color: white;
          text-align: center;
        }

        .team-header {
          position: relative;
          z-index: 2;
          margin-bottom: 50px;
        }

        .team-label {
          font-size: 20px;
          font-weight: 620;
          color: #ff5722;
          margin-bottom: 10px;
          display: inline-block;
        }

        .team-title {
          font-size: 38px;
          font-weight: 750;
           font-style: italic;
        }
          .prestataire-btn {
  background-color: #e6471d;
  color: #fff;
  border: none;
  padding: 14px 28px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-align: center;
   margin-top: 30px; 
}

.prestataire-btn:hover {
  background-color: #fff;
  color: #e6471d;
  border: 1px solid #e6471d;
}

        .team-title em {
          font-style: italic;
          // color: #ebbeb1ff;
        }

   .custom-card {
  background: white;
  overflow: hidden;
  margin: 0;
  height: auto;
  width: 100%;
}.swiper-slide {
  display: flex;
  justify-content: center;
}



        .image-box {
          height: 300px;
          overflow: hidden;
        }

        .image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

       .info-row {
  display: flex;
  align-items: center;
  height: 65px;
  background: white;
  border-top: 1px solid #eee;
  overflow: hidden;
}

.share-box {
  width: 50px;
  height: 100%;
  background: #e64a19;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
}

.share-box i {
  color: white;
  font-size: 18px;
}
.swiper-button-next,
.swiper-button-prev {
  color: white;
}
.social-popup {
  position: absolute;
  top: -160px;
  left: 60px;
  background: white;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  z-index: 10;
}

.social-popup i {
  color: #e64a19;
  font-size: 14px;
  cursor: pointer;
}

.text-zone {
  flex: 1;
  text-align: left;
  padding: 0 15px;
}

.text-zone h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #111;
}

.text-zone p {
  margin: 0;
  font-size: 14px;
  color: #e64a19;
  font-weight: 500;
}


        @media (max-width: 768px) {
          .team-title {
            font-size: 26px;
          }

          .custom-card {
            width: 100%;
          }
             .prestataire-btn {
    width: 100%;
    padding: 12px 20px;
    font-size: 15px;
  }
        }
      `}</style>
    </section>
  );
};

export default PrestatairesPopulaires;
