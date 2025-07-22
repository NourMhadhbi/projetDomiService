// 
import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const STATUTS = {
  attente: { label: 'En attente', color: '#ffc107' },
  confirme: { label: 'Confirmé', color: '#198754' },
  termine: { label: 'Terminé', color: '#6c757d' },
  annule: { label: 'Annulé', color: '#dc3545' },
};

export default function TestCalendrie() {
  const calendarRef = useRef(null);
  const [rendezVous, setRendezVous] = useState([
    { id: 1, title: 'Petit Déjeuner', date: '2025-07-22', statut: 'attente', nom: 'Ali', telephone: '12345678' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nom: '', telephone: '', service: '', statut: 'attente' });
  const [selectedDate, setSelectedDate] = useState('');
  const [viewMode, setViewMode] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [popupCoords, setPopupCoords] = useState({ x: 0, y: 0 });

  const today = new Date().toISOString().split('T')[0];

  const events = rendezVous.map(rdv => ({
    title: rdv.title,
    date: rdv.date,
    backgroundColor: STATUTS[rdv.statut]?.color,
    borderColor: STATUTS[rdv.statut]?.color,
    extendedProps: {
      nom: rdv.nom,
      telephone: rdv.telephone,
      statut: rdv.statut
    }
  }));

  const handleDateClick = (arg) => {
    if (arg.dateStr < today) return;
    setSelectedDate(arg.dateStr);
    setFormData({ nom: '', telephone: '', service: '', statut: 'attente' });
    setViewMode(false);
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const rect = clickInfo.el.getBoundingClientRect();
    setPopupCoords({ x: rect.right + 10, y: rect.top + window.scrollY });
    setSelectedEvent(clickInfo.event);
  };

  const onSave = () => {
    if (viewMode) {
      setRendezVous(prev =>
        prev.map(rdv =>
          rdv.date === selectedDate && rdv.title === formData.service
            ? { ...rdv, ...formData, title: formData.service, date: selectedDate }
            : rdv
        )
      );
    } else {
      setRendezVous(prev => [
        ...prev,
        { id: Date.now(), title: formData.service, date: selectedDate, ...formData },
      ]);
    }
    setModalOpen(false);
  };

  const onDelete = () => {
    setRendezVous(prev =>
      prev.filter(rdv => !(rdv.date === selectedDate && rdv.title === formData.service))
    );
    setModalOpen(false);
  };

  return (
    <>
      <style>{`
        .popup-event {
          position: absolute;
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1000;
          width: 220px;
        }
        .popup-event .header {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
        }
        .popup-event .icons i {
          margin-left: 10px;
          cursor: pointer;
        }
        .popup-event .body {
          margin-top: 10px;
        }
        .popup-event .body i {
          margin-right: 6px;
          color: #ffc107;
        }
      `}</style>

      <div className="container mt-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, bootstrap5Plugin]}
          initialView="dayGridMonth"
          locale={frLocale}
          themeSystem="bootstrap5"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
          }}
        />
      </div>

      {/* Panneau contextuel */}
      {selectedEvent && (
        <div className="popup-event" style={{ top: popupCoords.y, left: popupCoords.x, position: 'absolute' }}>
          <div className="header">
            {selectedEvent.title}
            <span className="icons">
              <i className="bi bi-pencil" onClick={() => {
                const ev = selectedEvent;
                setFormData({
                  nom: ev.extendedProps.nom,
                  telephone: ev.extendedProps.telephone,
                  service: ev.title,
                  statut: ev.extendedProps.statut,
                });
                setSelectedDate(ev.startStr.split('T')[0]);
                setViewMode(true);
                setModalOpen(true);
                setSelectedEvent(null);
              }}></i>
              <i className="bi bi-trash" onClick={() => {
                setRendezVous(prev => prev.filter(e =>
                  !(e.title === selectedEvent.title && e.date === selectedEvent.startStr.split('T')[0])
                ));
                setSelectedEvent(null);
              }}></i>
            </span>
          </div>
          <div className="body mt-2">
            <p><i className="bi bi-clock"></i> {new Date(selectedEvent.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
            <p><i className="bi bi-person"></i> {selectedEvent.extendedProps.nom}</p>
            <p><i className="bi bi-telephone"></i> {selectedEvent.extendedProps.telephone}</p>
          </div>
        </div>
      )}

      {/* Modal Ajout / Édition */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{viewMode ? "Modifier Rendez-vous" : "Ajouter Rendez-vous"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={formData.nom}
                onChange={e => setFormData({ ...formData, nom: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                value={formData.telephone}
                onChange={e => setFormData({ ...formData, telephone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Service</Form.Label>
              <Form.Control
                type="text"
                value={formData.service}
                onChange={e => setFormData({ ...formData, service: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Statut</Form.Label>
              <Form.Select
                value={formData.statut}
                onChange={e => setFormData({ ...formData, statut: e.target.value })}
              >
                <option value="attente">En attente</option>
                <option value="confirme">Confirmé</option>
                <option value="termine">Terminé</option>
                <option value="annule">Annulé</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {viewMode && (
            <Button variant="danger" onClick={onDelete}>
              Supprimer
            </Button>
          )}
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
          <Button variant="primary" onClick={onSave}>
            {viewMode ? "Modifier" : "Ajouter"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
