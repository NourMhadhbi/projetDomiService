import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import domiServe from '../../assets/img/domiserivice.jpg';
import background from '../../assets/img/background.jpg';
import domiservice2 from '../../assets/img/domiservice2.jpg';
import { useDispatch } from 'react-redux';

const images = [domiServe, background, domiservice2];

const AccueilSlider = () => {
      
    return (
        <>
            <style>{`
            .swiper-button-next,
.swiper-button-prev {
  color: #1a3a6c

}
                .accueil-slider-container {
                    width: 100%;
                    height: 90vh;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Segoe UI', Roboto, sans-serif;
                }

                .accueil-swiper, .slide-background {
                    width: 100%;
                    height: 100%;
                }

                .slide-background {
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }

                .overlay-blur {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background: linear-gradient(to right, rgba(10, 25, 47, 0.85) 40%, rgba(10, 25, 47, 0.2) 80%, transparent 100%);
                    z-index: 1;
                }

                .overlay-content {
                    position: absolute;
                    top: 50%;
                    left: 6%;
                    transform: translateY(-50%);
                    z-index: 2;
                    width: 45%;
                    color: #fff;
                }

                .overlay-content h1 {
                    font-size: 3.4rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    line-height: 1.2;
                }

                .overlay-content span {
                    color: #ff6b00;
                }

                .overlay-content p {
                    font-size: 1.15rem;
                    line-height: 1.7;
                    color: #f1f1f1;
                    margin-bottom: 1rem;
                }

                .btn-orange {
                    margin-top: 1.5rem;
                    background-color: #ff4d2d;
                    border: none;
                    padding: 0.7rem 1.5rem;
                    font-weight: 600;
                    color: white;
                    border-radius: 4px;
                    transition: 0.3s ease;
                    text-transform: uppercase;
                    cursor: pointer;
                }

                .btn-orange:hover {
                    background-color: #e63616;
                }
            `}</style>

            <div className="accueil-slider-container">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    navigation
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop={true}
                    className="accueil-swiper"
                >
                    {images.map((img, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className="slide-background"
                                style={{ backgroundImage: `url(${img})` }}
                            >
                                <div className="overlay-blur" />
                                <div className="overlay-content">
                                    <h1>Bienvenue sur <span>DomiServe</span></h1>
                                    <p>
                                        Simplifiez votre quotidien avec une plateforme moderne dédiée aux services à domicile.
                                        DomiServe vous connecte avec des professionnels de confiance :
                                        <strong> aide à la personne, ménage, bricolage, soins à domicile</strong>, et plus encore.
                                    </p>
                                    <p>
                                        Réservez en quelques clics, suivez vos rendez-vous, et bénéficiez d’un service personnalisé.
                                        <strong> DomiServe, c’est l’alliance du digital et de l’humain au service de votre confort.</strong>
                                    </p>

                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    );
};

export default AccueilSlider;
