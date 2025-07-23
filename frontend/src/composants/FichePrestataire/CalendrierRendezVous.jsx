

// export default CalendrierRendezVous;
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { FaEdit, FaTrash, FaClock, FaInfoCircle, FaMapMarkerAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import RendezVousModal from './RendezVousModal';

import { Modal, Button } from 'react-bootstrap';
import {
    fetchByIntervenant,
    fetchById,
    createRendezVous,
    updateRendezVous,
    deleteRendezVous
} from '../../features/RendezVousSlice';
import { fetchIntervenantbyId } from '../../features/UtilisateurSlice';
import ModalInfo from './ModalInfo';



const CalendrierRendezVous = () => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [popoverEventId, setPopoverEventId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const popoverRef = useRef(null);
    const STATUTS = {
        EN_ATTENTE: { label: 'En attente', color: '#bc8f05ff' },
        CONFIRME: { label: 'Confirmé', color: '#127547ff' },
        ANNULE: { label: 'Annulé', color: '#a90616ff' },
        TERMINE: { label: 'Terminé', color: '#949091ff' },
    };
    const { id } = useParams();


    const dispatch = useDispatch();
    const calendarRef = useRef(null);
    const [showPopoverModal, setShowPopoverModal] = useState(false);

    const closePopover = () => setShowPopoverModal(false);
    const { listeRendezVous, rendezVousActuel, loading } = useSelector(state => state.rendezVous);
    const client = useSelector(state => state.auth?.user || null);
    console.log("client connecter calendrie", client)
    const [panelOpen, setPanelOpen] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        date: '',
        heure: '',
        lieuDintervention: '',
        raison: '',
        clientId: client?.utilisateurIdCl,
        prestataireId: id ? parseInt(id) : null,
    });
    const {
        intervenant
    } = useSelector((state) => state.utilisateur);



    useEffect(() => {
        dispatch(fetchByIntervenant(id));
    }, [dispatch, id]);
    useEffect(() => {
        if (id) {
            dispatch(fetchIntervenantbyId(id));
        }
    }, [id, dispatch]);
    useEffect(() => {
        if (rendezVousActuel && typeof rendezVousActuel.date === 'string' && rendezVousActuel.date.includes('T')) {

            const [datePart, timePart] = rendezVousActuel.date.split('T');
            setFormData({
                id: rendezVousActuel.id,
                date: datePart,
                heure: timePart.slice(0, 5),
                lieuDintervention: rendezVousActuel.lieuDintervention || '',
                raison: rendezVousActuel.raison || "",
                clientId: client?.utilisateurIdCl,
                prestataireId: rendezVousActuel.prestataireId,


            });

        }
    }, [rendezVousActuel, client]);

    const handleDateClick = (arg) => {
        const selectedDate = arg.dateStr;
        if (new Date(selectedDate) < new Date()) return;
        setFormData({
            id: '',
            date: selectedDate,
            heure: '',
            lieuDintervention: '',
            clientId: client?.utilisateurIdCl,
            prestataireId: parseInt(id),


        });
        setViewMode(false);
        setDateReadonly(true);
        setPanelOpen(true);
    };

    const handleEventClick = (clickInfo) => {
        setPopoverEventId(clickInfo.event.id);
        setAnchorEl(clickInfo.el);

        setShowPopoverModal(true);
        dispatch(fetchById(parseInt(clickInfo.event.id)));
    };

    const onSave = async () => {
        const dateTime = `${formData.date}T${formData.heure}:00`;
        const payload = { ...formData, date: dateTime };

        try {
            if (viewMode) {
                await dispatch(updateRendezVous(payload)).unwrap();
                Swal.fire({
                    title: 'Modification réussie !',
                    text: 'Le rendez-vous a été modifié avec succès.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#198754'
                });

            } else {
                await dispatch(createRendezVous(payload)).unwrap();
                Swal.fire({
                    title: 'Ajout réussi !',
                    text: 'Le rendez-vous a été ajouté avec succès.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#198754' // vert Bootstrap
                });
            }
            dispatch(fetchByIntervenant(id));

            setPanelOpen(false);
            setPopoverEventId(null);
            setAnchorEl(null);

        } catch (err) {
            Swal.fire({
                title: 'Erreur',
                text: err.message || 'Une erreur est survenue.',
                icon: 'error',
                confirmButtonText: 'Fermer'
            });
        }
    };

    const onDelete = async () => {
        const { isConfirmed } = await Swal.fire({
            icon: 'warning',
            title: 'Confirmer la suppression',
            text: 'Cette action est irréversible.',
            showCancelButton: true,
            confirmButtonText: 'Supprimer',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#dc3545',  // rouge Bootstrap
            cancelButtonColor: '#6c757d',
            reverseButtons: false,
            customClass: {
                popup: 'rounded-4 shadow',
                title: 'fs-5 fw-semibold',
                confirmButton: 'px-4 py-2',
                cancelButton: 'px-4 py-2'
            }
        });

        if (!isConfirmed) return;

        try {
            await dispatch(deleteRendezVous({ id: formData.id })).unwrap();
            setPanelOpen(false);
            setPopoverEventId(null);
            setAnchorEl(null);
            dispatch(fetchByIntervenant(id));
            Swal.fire({
                icon: 'success',
                title: 'Rendez-vous supprimé',
                text: 'Suppression effectuée avec succès.',
                confirmButtonColor: '#198754',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'rounded-4 shadow',
                    title: 'fs-5 fw-semibold',
                    confirmButton: 'px-4 py-2'
                }
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: err.message || 'Impossible de supprimer ce rendez-vous.',
                confirmButtonText: 'Fermer'
            });
        }
    };

    const openAddModal = () => {
        setFormData({
            id: '',
            date: '',
            heure: '',
            lieuDintervention: '',
            clientId: client?.utilisateurIdCl,
            prestataireId: parseInt(id),

        });
        setViewMode(false);
        setDateReadonly(false);
        setPanelOpen(true);
    };
    const liste = !loading && Array.isArray(listeRendezVous) ? listeRendezVous : [];
    const [dateReadonly, setDateReadonly] = useState(false);
    const events = liste.map(rdv => ({
        id: rdv.id?.toString() || '',
        title: `RDV ${rdv.id ?? ''}`,
        date: (rdv.date && rdv.date.split('T')[0]) || '', // fallback si date est vide
        backgroundColor: STATUTS[rdv.statut]?.color || '#198754', // fallback si statut invalide
        textColor: 'white',
        extendedProps: {
            statut: rdv.statut || 'INCONNU',
            raison: rdv.raison || 'Sans raison',
            lieu: rdv.lieuDintervention || 'Non précisé'
        }
    }));


    return (
        <>
            <Header isClientConnected={isLoggedIn} intervenant={intervenant} />
            <div className="mt-2 mb-4 px-3">
                <style>{`
                    /* Style personnalisé FullCalendar */
                    .fc .fc-col-header-cell-cushion {
                        text-decoration: none !important;
                    }
                    .fc .fc-toolbar button {
                        color: #1a3a6c;
                        background-color: white;
                        border: 1px solid #1a3a6c;
                        transition: background-color 0.3s, color 0.3s;
                    }
                    .fc .fc-toolbar button:hover {
                        background-color: #1a3a6c;
                        color: white;
                    }
                    .fc .fc-toolbar-title {
                        color: #1a3a6c;
                    }
                    .fc .fc-today-button:disabled {
                        color: #1a3a6c !important;
                        opacity: 1 !important;
                        background-color: #afb2b7ff;
                    }

            

 
                `}</style>

                <div className="border rounded-3 bg-white shadow-sm">
                    <div className="p-2">
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
                                right: 'dayGridMonth,timeGridWeek,listWeek,addButton'
                            }}
                            customButtons={{
                                addButton: {
                                    text: 'Obtenir un rendez-Vous',
                                    click: openAddModal,
                                },
                            }}
                            dayCellDidMount={(info) => {
                                info.el.style.cursor = 'pointer';
                            }}
                            eventDidMount={(info) => {
                                info.el.style.cursor = 'pointer';
                            }}
                            dayMaxEventRows={3}
                            eventDisplay="block"
                            dayHeaderContent={(args) => {
                                const date = args.date;
                                const locale = 'fr-FR';
                                const weekday = date.toLocaleDateString(locale, { weekday: 'short' });
                                const dayMonth = date.toLocaleDateString(locale, { day: '2-digit', month: '2-digit' });
                                return (
                                    <>
                                        <div>{weekday}</div>
                                        <div>{dayMonth}</div>
                                    </>
                                );
                            }}
                            eventContent={(eventInfo) => (
                                <div className="d-flex align-items-center">
                                    <span className="badge rounded-pill me-1" style={{ backgroundColor: eventInfo.event.backgroundColor, color: eventInfo.event.textColor }}>
                                        {STATUTS[eventInfo.event.extendedProps.statut]?.label.charAt(0)}
                                    </span>
                                    <span className="text-truncate">{eventInfo.event.title}</span>
                                </div>
                            )}
                        />

                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            {Object.entries(STATUTS).map(([key, { label, color }]) => (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span
                                        style={{
                                            width: '14px',
                                            height: '14px',
                                            borderRadius: '50%',
                                            backgroundColor: color,
                                            display: 'inline-block'
                                        }}
                                    ></span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#333' }}>{label}</span>
                                </div>
                            ))}
                        </div>


                        <ModalInfo
                            open={showPopoverModal}
                            onClose={closePopover}
                            rendezVousActuel={rendezVousActuel}
                            onEdit={() => {
                                setViewMode(true);
                                setPanelOpen(true);
                                setDateReadonly(false);
                                closePopover();
                            }}
                            onDelete={onDelete}
                            STATUTS={STATUTS}
                        />
                    </div>
                </div>


                <RendezVousModal
                    open={panelOpen}
                    onClose={() => setPanelOpen(false)}
                    onSave={onSave}

                    eventData={formData}
                    intervenant={intervenant}
                    setEventData={setFormData}
                    mode={viewMode ? 'modification' : 'ajout'}
                    dateReadonly={dateReadonly}
                />
            </div>
            <Footer />
        </>
    );
};

export default CalendrierRendezVous;
