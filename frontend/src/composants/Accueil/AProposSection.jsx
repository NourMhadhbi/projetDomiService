import React from 'react';
import { useNavigate } from 'react-router-dom';
import technicien from '../../assets/img/technicien.jpg';
import technicien2 from '../../assets/img/technicien2.avif';

const AProposSection = () => {
    const navigate = useNavigate();

    return (
        <>
            <style>{`
                .a-propos-section {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    padding: 80px 10%;
                    background-color: white;
                    position: relative;
                    gap: 80px;
                }

                .a-propos-left {
                    flex: 1;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 2;
                }

                .a-propos-left img.main-img {
                    width: 100%;
                    max-width: 380px;
                    // border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }

                .a-propos-left img.overlay-img {
                    position: absolute;
                    bottom: -110px;
                    left: 60%;
                    width: 200px;
                    height:220px;
                    border: 8px solid #eee;
                    background: white;
                    z-index: 3;
                }
.experience-box {
    position: absolute;
    top: 25%;
    left: 92%;
     transform: translate(-50%, -50%);
  background-color: white;
  padding: 12px 10px;

  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}
.experience-box .big-number {
    font-size: 3.2rem;
    color: #e6471d;
    font-weight: 800;
    display: block;
    margin-bottom: 5px;
     writing-mode: horizontal-tb; 
       transform: none;
}
.experience-box .exp-text {
  writing-mode: vertical-rl;
  transform: rotate(360deg); 
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  text-align: center;
}



                .a-propos-right {
                    flex: 1;
                    padding-left: 50px;
                }

                .a-propos-title {
                    font-size: 16px;
                    color: #e6471d;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-bottom: 10px;
                }

                .a-propos-right h2 {
                    font-size: 36px;
                    font-weight: 800;
                    margin-bottom: 20px;
                }

                .a-propos-right p {
                    font-size: 16px;
                    line-height: 1.8;
                    color: #444;
                    margin-bottom: 20px;
                }

                .services-list {
                    display: flex;
                    gap: 20px;
                    margin: 30px 0;
                }

                .service-box {
                    flex: 1;
                    border: 1px solid #eee;
                    padding: 20px;
                    text-align: center;
                    font-weight: 600;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .service-box i {
                    color: #e6471d;
                }

                .btn-propos {
                    background: #e6471d;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    font-weight: 600;
                    text-transform: uppercase;
                    transition: 0.3s;
                    cursor: pointer;
                }

                .btn-propos:hover {
                    background: #cc3911;
                }

                .cercle-decoration {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 180px;
                    height: 180px;
                    z-index: 0;
                    background-image: radial-gradient(circle at center, 
                        transparent 20%, 
                        rgba(230, 70, 35, 0.3) 20%, 
                        rgba(230, 70, 35, 0.3) 22%, 
                        transparent 22%, 
                        transparent 35%, 
                        rgba(230, 70, 35, 0.2) 35%, 
                        rgba(230, 70, 35, 0.2) 37%, 
                        transparent 37%, 
                        transparent 50%, 
                        rgba(230, 70, 35, 0.15) 50%, 
                        rgba(230, 70, 35, 0.15) 52%, 
                        transparent 52%
                    );
                }

                @media (max-width: 768px) {
                    .a-propos-section {
                        flex-direction: column;
                        padding: 40px 20px;
                    }

                    .a-propos-right {
                        padding-left: 0;
                        margin-top: 40px;
                    }

                    .experience-box {
                        position: static;
                        writing-mode: horizontal-tb;
                        margin-top: 20px;
                        text-align: left;
                        left: auto;
                        bottom: auto;
                        transform: none;
                    }

                    .cercle-decoration {
                        display: none;
                    }
                }
            `}</style>

            <div className="a-propos-section">
                <div className="cercle-decoration" />
                <div className="a-propos-left">
                    <img src={technicien} alt="Technicien" className="main-img" />
                    <img src={technicien2} alt="Technicien 2" className="overlay-img" />
                    <div className="experience-box">
                        <span className="big-number">4</span>


                        <span className="exp-text">
                            Années<br />
                            d’expérience<br />
                            Services<br />
                            à domicile
                        </span>
                    </div>
                </div>
                <div className="a-propos-right">
                    <div className="a-propos-title">
                        <i className="fas fa-tools me-2"></i> À Propos De Notre Application
                    </div>
                    <h2>Domiserve Fournit Le Meilleur Service À Domicile</h2>
                    <p>
                        Nos professionnels qualifiés utilisent les outils les plus récents pour répondre rapidement à vos besoins.
                        Avec Domiserve, vous bénéficiez d’un service disponible 24h/24 et 7j/7, rapide, fiable et abordable.
                    </p>
                    <div className="services-list">
                        <div className="service-box">
                            <i className="fas fa-check-circle"></i> Aide à domicile
                        </div>
                        <div className="service-box">
                            <i className="fas fa-check-circle"></i> Ménage
                        </div>
                        <div className="service-box">
                            <i className="fas fa-check-circle"></i> Bricolage
                        </div>
                    </div>
                    <button className="btn-propos" onClick={() => navigate("/about")}>
                        À PROPOS DE PLUS
                    </button>
                </div>
            </div>
        </>
    );
};

export default AProposSection;
