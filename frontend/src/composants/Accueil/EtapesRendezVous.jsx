import React from 'react';

import rechercheIcon from '../../assets/img/icon_recherche1.jpg';
import profilIcon from '../../assets/img/consultationprofil.png';
import calendrierIcon from '../../assets/img/icon_calendrier.jpg';

const EtapesRendezVous = () => {
  return (

    <section className="etapes-rdv-section">
      <div className="header-etapes">
        <span className="etape-label"><i className="fas fa-wrench" style={{ marginRight: 5 }} /> Comment prendre un rendez-vous</span>
        <h2 className="etape-title">Suivez ces <em>étapes simples</em> pour réserver un rendez-vous</h2>
      </div>

      <div className="etapes-container">
        <div className="etape-item">
          <div className="etape-circle">
            <img src={rechercheIcon} alt="Recherche" />
          </div>
          <h3>Recherche du prestataire</h3>
          <p>Recherchez par service, nom, prénom ou spécialité, ou utilisez le bouton "Voir Tous Nos Prestataires & Entreprises" sur la page d’accueil.</p>
        </div>

        <div className="etape-arrow">
          <i className="fas fa-long-arrow-alt-right"></i>
        </div>
        <div className="etape-item">
          <div className="etape-circle">
            <img src={profilIcon} alt="Profil" />
          </div>
          <h3>Consulter le profil</h3>
          <p>Accédez au profil du prestataire ou d'une entreprise pour voir ses infos, ses avis et cliquez sur le bouton "Obtenir un rendez-vous".</p>
        </div>

        <div className="etape-arrow">
          <i className="fas fa-long-arrow-alt-right"></i>
        </div>

        <div className="etape-item">
          <div className="etape-circle">
            <img src={calendrierIcon} alt="Calendrier" />
          </div>
          <h3>Choix de la date</h3>
          <p>Sélectionnez la date depuis le calendrier ou le bouton "Obtenir un rendez-vous" en haut. Vous pouvez modifier le rendez-vous ensuite si nécessaire.</p>
        </div>
      </div>
      <style>
        {`.etapes-rdv-section {
  padding: 100px 5% 80px;
  text-align: center;
  background-color: #fff;
  position: relative;
  z-index: 1;
}

.header-etapes {
  margin-bottom: 50px;
}

.etape-label {
  font-size: 20px;
  font-weight: 600;
  color: #ff5722;
  display: inline-block;
  margin-bottom: 10px;
}

.etape-title {
  font-size: 38px;
  font-weight: 700;
}

.etape-title em {
  font-style: italic;
  color: #ff5722;
}

.etapes-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
}

.etape-item {
  max-width: 300px;
  flex: 1;
}

.etape-circle {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 3px solid #ff5722;
  margin: 0 auto 20px;
  overflow: hidden; /* important pour que l'image soit bien découpée en cercle */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  position: relative;
}

.etape-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;  /* remplit bien le cercle */
  border-radius: 50%; /* pour s’assurer que l’image reste ronde */
}

.profil-img-fix {
  width: 100px;       /* plus large que normal */
  height: auto;       /* laisse la hauteur naturelle */
  transform: scale(1.3); /* optionnel pour zoomer un peu */
}
.etape-item h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}

.etape-item p {
  font-size: 15px;
  color: #444;
}

.etape-arrow {
  font-size: 36px;
  font-weight: bold;
  color: #ff5722;
  display: flex;
  align-items: center;
  justify-content: center;
}
`}
      </style>
    </section>
  );
};

export default EtapesRendezVous;
