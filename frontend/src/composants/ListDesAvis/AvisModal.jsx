// AvisModal.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const AvisModal = ({ show, onClose, onSubmit, formData, setFormData, reaction, setReaction }) => {
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const aimeValue = reaction === 'like' ? true : reaction === 'dislike' ? false : '';
        setFormData((prev) => ({ ...prev, aime: aimeValue }));
        onSubmit();
    };

    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)" }} tabIndex="-1" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content rounded-4 shadow-lg border-0">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Laisser un avis</h5>
                        <div></div>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Fermer" />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body pt-0">
                            <div className="mb-3">
                                <label htmlFor="commentaire" className="form-label fw-semibold" style={{ marginTop: "20px" }}>Commentaire</label>
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
                                <label htmlFor="note" className="form-label fw-semibold">Note: {formData.note} / 10</label>
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
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <button type="submit" className="btn btn-success fw-semibold">Modifier</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Annuler</button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AvisModal;
