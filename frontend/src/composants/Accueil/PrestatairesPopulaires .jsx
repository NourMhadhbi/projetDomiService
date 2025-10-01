// import React, { useEffect, useState } from 'react';

// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/autoplay';
// import domiServe from '../../assets/img/domiserivice.jpg';
// import { fetchPopulaireP } from '../../features/HistoriqueSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';

// const PrestatairesPopulaires = ({ isClientConnected }) => {
//   const navigate = useNavigate();
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const dispatch = useDispatch();
//   const { data: prestataires } = useSelector(state => state.historique || {});
//   useEffect(() => {
//     dispatch(fetchPopulaireP());
//   }, [dispatch]);
//   if (!Array.isArray(prestataires)) return null;
//   return (
//     <section
//       className="team-section"
//       style={{
//         backgroundImage: `url(${domiServe})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         position: 'relative',
//       }}
//     >
//       <div className="overlay" />

//       <div className="team-header">
//         <span className="team-label">
//           <i className="fas fa-star"></i> Les plus consultés
//         </span>
//         <h2 className="team-title">
//           Les Prestataires et Entreprises <em>les plus consultés cette semaine</em>
//         </h2>
//       </div>

//       <Swiper
//         modules={[Navigation, Autoplay]}
//         slidesPerView={4}
//         spaceBetween={15} // réduit l’espace
//         loop
//         navigation
//         autoplay={{ delay: 3000 }}
//         breakpoints={{
//           0: { slidesPerView: 1, spaceBetween: 10 },
//           768: { slidesPerView: 2, spaceBetween: 12 },
//           1024: { slidesPerView: 4, spaceBetween: 15 },
//         }}
//       >
//         {Array.isArray(prestataires) && prestataires.map((p, i) => (
//           <SwiperSlide key={i}>
//             <Link
//               to={`/ficheintervenant/${p.utilisateurIdPre}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="custom-card"
//               style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
//             >
//               <div className="image-box">
//                 <img src={p.utilisateur.image} alt={p.utilisateur.nom} />
//               </div>

//               <div className="info-row">
//                 <div
//                   className="share-box"
//                   onMouseEnter={() => setHoveredIndex(i)}
//                   onMouseLeave={() => setHoveredIndex(null)}
//                 >
//                   <i className="fas fa-share-alt" />
//                   {hoveredIndex === i && (
//                     <div className="social-popup">
//                       <i className="fab fa-facebook-f" />
//                       <i className="fab fa-twitter" />
//                       <i className="fab fa-instagram" />
//                       <i className="fab fa-linkedin-in" />
//                     </div>
//                   )}
//                 </div>

//                 <div className="text-zone">
//                   <h3>
//                     {p.entreprise
//                       ? p.entreprise.nomEntreprise
//                       : `${p.utilisateur?.prenom ?? ""} ${p.utilisateur?.nom ?? ""}`}
//                   </h3>
//                   <p>{p.utilisateur.specialite}</p>
//                 </div>
//               </div>
//             </Link>
//           </SwiperSlide>
//         ))}
//         <button className="prestataire-btn" onClick={() => navigate("/prestataires?consultes=true")}>
//           Voir Tous Nos Prestataires & Entreprises
//         </button>
//       </Swiper>

//       <style>{`
//     .prestataire-btn:disabled {
//   opacity: 0.5;
//   pointer-events: none;
//   cursor: not-allowed;
// }
//         .overlay {
//           position: absolute;
//           top: 0; left: 0;
//           width: 100%; height: 100%;
//           background: linear-gradient(rgba(10, 25, 47, 0.85), rgba(10, 25, 47, 0.2));
//           backdrop-filter: blur(2px); 
//           z-index: 1;
//         }

//         .team-section {
//           padding: 100px 5% 80px;
//           color: white;
//           text-align: center;
//         }

//         .team-header {
//           position: relative;
//           z-index: 2;
//           margin-bottom: 50px;
//         }

//         .team-label {
//           font-size: 20px;
//           font-weight: 620;
//           color: #ff5722;
//           margin-bottom: 10px;
//           display: inline-block;
//         }

//         .team-title {
//           font-size: 38px;
//           font-weight: 750;
//            font-style: italic;
//         }
//           .prestataire-btn {
//   background-color: #e6471d;
//   color: #fff;
//   border: none;
//   padding: 14px 28px;
//   font-weight: 600;
//   font-size: 16px;
//   cursor: pointer;
//   border-radius: 4px;
//   transition: all 0.3s ease;
//   text-align: center;
//    margin-top: 30px; 
// }

// .prestataire-btn:hover {
//   background-color: #fff;
//   color: #e6471d;
//   border: 1px solid #e6471d;
// }

//         .team-title em {
//           font-style: italic;
//           // color: #ebbeb1ff;
//         }

//    .custom-card {
//   background: white;
//   overflow: hidden;
//   margin: 0;
//   height: auto;
//   width: 100%;
// }.swiper-slide {
//   display: flex;
//   justify-content: center;
// }



//         .image-box {
//           height: 300px;
//           overflow: hidden;
//         }

//         .image-box img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//        .info-row {
//   display: flex;
//   align-items: center;
//   height: 65px;
//   background: white;
//   border-top: 1px solid #eee;
//   overflow: hidden;
// }

// .share-box {
//   width: 50px;
//   height: 100%;
//   background: #e64a19;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   position: relative;
//   cursor: pointer;
// }

// .share-box i {
//   color: white;
//   font-size: 18px;
// }
// .swiper-button-next,
// .swiper-button-prev {
//   color: white;
// }
// .social-popup {
//   position: absolute;
//   top: -160px;
//   left: 60px;
//   background: white;
//   border-radius: 6px;
//   padding: 10px;
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
//   box-shadow: 0 2px 6px rgba(0,0,0,0.3);
//   z-index: 10;
// }

// .social-popup i {
//   color: #e64a19;
//   font-size: 14px;
//   cursor: pointer;
// }

// .text-zone {
//   flex: 1;
//   text-align: left;
//   padding: 0 15px;
// }

// .text-zone h3 {
//   margin: 0;
//   font-size: 16px;
//   font-weight: 700;
//   color: #111;
// }

// .text-zone p {
//   margin: 0;
//   font-size: 14px;
//   color: #e64a19;
//   font-weight: 500;
// }


//         @media (max-width: 768px) {
//           .team-title {
//             font-size: 26px;
//           }

//           .custom-card {
//             width: 100%;
//           }
//              .prestataire-btn {
//     width: 100%;
//     padding: 12px 20px;
//     font-size: 15px;
//   }
//         }
//       `}</style>
//     </section>
//   );
// };

// export default PrestatairesPopulaires;
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
import { fetchMesSignales } from "../../features/SignalementSlice";
const PrestatairesPopulaires = ({ isClientConnected, user }) => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const dispatch = useDispatch();
  const { data: prestataires } = useSelector(state => state.historique || {});
  const { mesSignales } = useSelector(state => state.signalement);
  const [isSignaled, setIsSignaled] = useState(false);
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
  }, [mesSignales,  user]);
  useEffect(() => {
    dispatch(fetchPopulaireP());
 
  }, [dispatch]);

  const handleRendezVousClick = (prestataireId, e) => {
    e.stopPropagation();
    window.open(`/calendrier/${prestataireId}`, "_blank");
  };

  const isPrestataireSignaled = (prestataireId) => {
    return mesSignales?.some(
      s => s.prestataireId === prestataireId
    );
  };


  if (!Array.isArray(prestataires)) return null;

  return (
    <section className="prestataires-populaires-section">
      <div className="background-overlay"></div>

      <div className="container">
        <div className="section-header">
          <span className="section-badge">
            <i className="fas fa-star"></i> Les plus consultés
          </span>
          <h2 className="section-title">
            Les Prestataires et Entreprises <span className="highlight">les plus consultés cette semaine</span>
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
          {Array.isArray(prestataires) && prestataires.map((p, i) => {


            return (
              <SwiperSlide key={i}>
                <div
                  className={`prestataire-card ${activeCard === i ? 'active' : ''}`}
                  onClick={() => window.open(`/ficheintervenant/${p.utilisateurIdPre}`, '_blank')}
                  onMouseEnter={() => setActiveCard(i)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div className="card-image-container">
                    <img
                      src={p.utilisateur.image}
                      alt={p.utilisateur.nom}
                      className="card-image"
                    />
                    <div className="card-overlay"></div>

                    <div className="popularity-badge">
                      <i className="fas fa-fire"></i> Populaire
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="prestataire-info">
                      <h3 className="prestataire-name">
                        {p.entreprise
                          ? p.entreprise.nomEntreprise
                          : `${p.utilisateur?.prenom ?? ""} ${p.utilisateur?.nom ?? ""}`}
                      </h3>
                      <p className="prestataire-specialty">{p.utilisateur.specialite}</p>


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

                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="swiper-navigation">
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>

        <div className="view-all-container">
          <button className="view-all-button" onClick={() => navigate("/prestataires?consultes=true")}>
            Voir Tous Nos Prestataires
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <style jsx>{`
        .prestataires-populaires-section {
          position: relative;
          padding: 100px 0;
          background: linear-gradient(90deg, #0a192f 0%, #1e3a5f 90%);
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
          background: rgba(255, 193, 7, 0.15);
          color: #ffc107;
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
        }
        
        .section-title .highlight {
          color: #ffc107;
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
        
        .popularity-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 193, 7, 0.9);
          color: #333;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        
        .popularity-badge i {
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
        
        .competences {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }
        
        .competence-badge {
          background: #f1f8ff;
          color: #0366d6;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
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
        
        .rdv-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .rdv-button i {
          margin-right: 6px;
        }
        
        .rdv-button:hover:not(:disabled) {
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
          background: rgba(255, 193, 7, 0.8);
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
          .prestataires-populaires-section {
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

export default PrestatairesPopulaires;