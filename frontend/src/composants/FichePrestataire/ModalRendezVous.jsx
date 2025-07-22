import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalRendezVous = ({ show, onHide, formData, setFormData, onSave, onDelete, viewMode, client }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{viewMode ? "Modifier Rendez-vous" : "Ajouter Rendez-vous"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control type="text" value={client?.nom || ''} disabled />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control type="text" value={client?.prenom || ''} disabled />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={client?.email || ''} disabled />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Heure</Form.Label>
                        <Form.Control
                            type="time"
                            value={formData.heure}
                            onChange={e => setFormData({ ...formData, heure: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Lieu d'intervention</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.lieuDintervention}
                            onChange={e => setFormData({ ...formData, lieuDintervention: e.target.value })}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {viewMode && (
                    <Button variant="danger" onClick={onDelete}>Supprimer</Button>
                )}
                <Button variant="secondary" onClick={onHide}>Annuler</Button>
                <Button
                    variant="primary"
                    onClick={onSave}
                    disabled={!formData.date || !formData.heure || !formData.lieuDintervention}
                >
                    {viewMode ? "Modifier" : "Ajouter"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalRendezVous;
