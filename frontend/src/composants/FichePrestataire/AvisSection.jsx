import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createAvis } from "../../features/AvisSlice"

const AvisSection = ({ avisP, userC, intervenant }) => {

    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [reaction, setReaction] = useState("like");
    const [formData, setFormData] = useState({
        commentaire: "",

        note: '',
    });
    console.log("avis", avisP);
    const avisSchema = Yup.object().shape({
        commentaire: Yup.string().optional(),
        note: Yup.number()
            .required("La note est obligatoire")
            .min(0, "La note ne peut pas être inférieure à 0")
            .max(10, "La note ne peut pas dépasser 10"),
        aime: Yup.boolean().required("La réaction est obligatoire")
    });
    /*dots: true
    Affiche les petits points sous le slider pour indiquer le nombre de slides.
    
    infinite: true
    Le slider boucle en continu (après le dernier slide, il revient au premier).
    
    speed: 500
    Durée de l'animation du défilement en millisecondes (ici 500 ms = 0,5 seconde).
    
    slidesToShow: 2
    Nombre de slides affichés en même temps sur les grands écrans.
    
    slidesToScroll: 1
    Nombre de slides à faire défiler lorsqu'on clique sur une flèche ou qu'un slide automatique passe.
    
    arrows: true
    Affiche les flèches de navigation gauche/droite.
    
    autoplay: true
    Lance le défilement automatique sans interaction utilisateur.
    
    autoplaySpeed: 5000
    Intervalle entre chaque défilement automatique en millisecondes (ici 5 secondes).
    
    responsive: [...]
    Adaptation selon la taille de l’écran :
    
    Si la largeur est ≤ 992px :
    
    Affiche 2 slides visibles et défile 1 slide.
    
    Si la largeur est ≤ 768px :
    
    Affiche 1 slide visible, 1 slide défilé, flèches actives.*/
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, arrows: true } },
        ],
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (id === "note") {
            const numericValue = Number(value);

            // Autoriser vide pour effacer
            if (value === "") {
                setFormData((prev) => ({
                    ...prev,
                    [id]: "",
                }));
                return;
            }

            // Forcer les bornes min/max
            if (!isNaN(numericValue)) {
                if (numericValue > 10) {
                    setFormData((prev) => ({
                        ...prev,
                        [id]: 10,
                    }));
                } else if (numericValue < 0) {
                    setFormData((prev) => ({
                        ...prev,
                        [id]: 0,
                    }));
                } else {
                    setFormData((prev) => ({
                        ...prev,
                        [id]: numericValue,
                    }));
                }
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const avisToValidate = {
            commentaire: formData.commentaire,
            note: Number(formData.note),
            aime: reaction === "like",  // true si like, false sinon
        };

        try {
            // Valider les données avant envoi
            await avisSchema.validate(avisToValidate);
            const avisToSend = {
                ...avisToValidate,
                clientId: 16,
                prestataireId: intervenant.id,
            };


            await dispatch(createAvis(avisToSend)).unwrap();

            alert("Merci pour votre avis !");
            setShowModal(false);
            setFormData({ commentaire: "", note: 0 });
            setReaction("like");
        } catch (error) {
            alert(error.message || "Une erreur est survenue lors de la validation.");
        }
    };

    return (
        <section className="testimonials-section">
            <div className="section-header">
                <button
                    className="btn btn-success fw-semibold btn-responsive-avis"
                    onClick={() => setShowModal(true)}
                    type="button"

                >
                    <i className="fas fa-comment-dots me-2"></i> Laisser un avis
                </button>
                <h1 className="section-titleA">Que Disent Nos Clients ?</h1>
                <div className="section-divider"></div>
            </div>




            {/* Slider des avis */}
            {avisP && avisP.length > 0 ? (
                <Slider {...settings} className="testimonials-carousel">
                    {avisP.map((item, index) => {
                        const client = item.client?.utilisateur;
                        console.log('client.email:', client?.email, 'item.client.numTel:', item.client?.numTel);
                        const note = item.note ?? 0;
                        const stars = (note / 10) * 5;
                        const fullStars = Math.floor(stars);
                        const hasHalfStar = stars - fullStars >= 0.25 && stars - fullStars < 0.75;
                        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
                        return (
                            <div key={index}>
                                <div className="testimonial-card p-3 shadow rounded">
                                    <div className="client-info d-flex align-items-center mb-2">
                                        <img
                                            src={client?.image || "/placeholder.png"}
                                            alt={client?.nom || "Client"}
                                            className="client-image rounded-circle me-2"
                                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                        />
                                        <div>
                                            <h5 className="client-name mb-0">{client?.nom || "Nom inconnu"}</h5>
                                            <p className="client-position mb-0 text-muted">{client?.email ? client?.email : item.client?.numTel}</p>
                                        </div>
                                    </div>
                                    <p className="testimonial-text">{item.commentaire}</p>

                                    <div className="rating text-warning">
                                        {/* const stars = (note / 10) * 5;
Tu convertis ta note sur 10 en note sur 5.

Exemple :

note = 7.5

(7.5 / 10) = 0.75

0.75 * 5 = 3.75
✅ Résultat :

js
Copier
Modifier
stars = 3.75;
📌 2️⃣ const fullStars = Math.floor(stars);
Tu prends le nombre d'étoiles pleines en arrondissant vers le bas.

Exemple :

stars = 3.75

Math.floor(3.75) = 3
✅ Résultat :

js
Copier
Modifier
fullStars = 3; // 3 étoiles pleines
📌 3️⃣ const hasHalfStar = stars - fullStars >= 0.25 && stars - fullStars < 0.75;
Cette ligne :
✅ Vérifie si la partie décimale de stars est proche de 0.5 pour afficher une demi-étoile.

Calcul intermédiaire :

js
Copier
Modifier
decimalPart = stars - fullStars; // ici 3.75 - 3 = 0.75
Puis test :

Est-ce que 0.25 <= decimalPart < 0.75 ?

Si oui → true (afficher demi-étoile)

Si non → false (pas de demi-étoile)

Dans notre exemple :

0.75 >= 0.25 → ✅

0.75 < 0.75 → ❌
✅ Résultat :

js
Copier
Modifier
hasHalfStar = false; // pas de demi-étoile
📌 4️⃣ const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
Cette ligne calcule combien d’étoiles vides afficher pour compléter jusqu’à 5 étoiles.

Décomposition :

5 (nombre total d’étoiles)

- fullStars (on retire le nombre d’étoiles pleines affichées)

- 1 si hasHalfStar est true (on retire une place pour la demi-étoile)

- 0 si hasHalfStar est false

Exemple :

fullStars = 3

hasHalfStar = false

emptyStars = 5 - 3 - 0 = 2
✅ Résultat :

js
Copier
Modifier
emptyStars = 2; // 2 étoiles vides
📌 Résultat final pour note = 7.5 :
stars = 3.75

fullStars = 3 ⭐⭐⭐

hasHalfStar = false ✩

emptyStars = 2 ☆☆ */}
                                        {[...Array(fullStars)].map((_, i) => (
                                            <i key={`full-${i}`} className="fas fa-star"></i>
                                        ))}
                                        {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
                                        {[...Array(emptyStars)].map((_, i) => (
                                            <i key={`empty-${i}`} className="far fa-star"></i>
                                        ))}
                                        <span className="ms-2 text-muted">{note} / 10</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </Slider>
            ) : (
                <p className="text-center text-muted">Aucun avis disponible pour le moment.</p>
            )}

            {/* Modal */}
            {
                showModal && (
                    <div
                        className="modal fade show"
                        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }}
                        tabIndex="-1"
                        aria-modal="true"
                        role="dialog"
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className="modal-dialog modal-dialog-centered"
                            role="document"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content rounded-4 shadow-lg border-0">
                                <div className="modal-header border-0 pb-0">
                                    <h5 className="modal-title fw-bold">Laisser un avis</h5>
                                    <div></div>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                        aria-label="Fermer"
                                    />
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body pt-0">
                                        <div className="mb-3">
                                            <label
                                                htmlFor="commentaire"
                                                className="form-label fw-semibold"
                                                style={{ marginTop: "20px" }}
                                            >
                                                Commentaire
                                            </label>
                                            <textarea
                                                className="form-control shadow-sm"
                                                id="commentaire"
                                                rows="3"

                                                value={formData.commentaire}
                                                onChange={handleInputChange}

                                                placeholder="Votre commentaire ici..."
                                                style={{ resize: "none" }}
                                            />
                                        </div>



                                        <div className="mb-4 d-flex align-items-center gap-4">
                                            <label className="fw-semibold mb-0">Réaction :</label>
                                            <div
                                                className={`reaction-icon fs-3 cursor-pointer ${reaction === "like" ? "text-success" : "text-muted"}`}
                                                onClick={() => setReaction("like")}
                                                title="J'aime"
                                                style={{ userSelect: "none" }}
                                            >
                                                <FontAwesomeIcon icon={faThumbsUp} />
                                            </div>

                                            <div
                                                className={`reaction-icon fs-3 cursor-pointer ${reaction === "dislike" ? "text-danger" : "text-muted"}`}
                                                onClick={() => setReaction("dislike")}
                                                title="Je n'aime pas"
                                                style={{ userSelect: "none" }}
                                            >
                                                <FontAwesomeIcon icon={faThumbsDown} />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="note" className="form-label fw-semibold">
                                                Note: {formData.note} / 10
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="note"
                                                min="0"
                                                max="10"
                                                step="0.1"
                                                value={formData.note}
                                                onChange={handleInputChange}


                                                style={{ width: "30%" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer border-0 pt-0">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Annuler
                                        </button>
                                        <button type="submit" className="btn btn-success fw-semibold">
                                            Ajouter
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </section >
    );
};

export default AvisSection;
