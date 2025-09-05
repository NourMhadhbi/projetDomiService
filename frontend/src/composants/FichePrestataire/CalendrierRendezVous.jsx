

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
    deleteRendezVous,
    confirmRendezVous,
    cancelRendezVous,
    finishRendezVous
} from '../../features/RendezVousSlice';

import { fetchIntervenantbyId } from '../../features/UtilisateurSlice';
import ModalInfo from './ModalInfo';




const CalendrierRendezVous = () => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const prestataireConnect = user?.utilisateur.role === "PRESTATAIRE";
    console.log("est prestataire", prestataireConnect)
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
        if (isLoggedIn) {
            if (user?.utilisateur.role === 'CLIENT') dispatch(fetchByIntervenant(id));
            else if (user?.utilisateur.role === 'PRESTATAIRE' || user?.utilisateur.role === 'ENTREPRISE') dispatch(fetchByIntervenant(user.utilisateurIdPre));
        }
    }, [isLoggedIn, user, id, dispatch]);

    // useEffect(() => {
    //     dispatch(fetchByIntervenant(id));
    // }, [dispatch, id]);
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
        const dateAujourdhui = new Date();
        dateAujourdhui.setHours(0, 0, 0, 0);

        const dateCliquee = new Date(selectedDate);
        dateCliquee.setHours(0, 0, 0, 0);

        if (dateCliquee < dateAujourdhui) return;
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

    const [heureError, setHeureError] = useState("");


    const estHeureDisponible = (date, heure) => {
        const dateToCheck = `${date}T${heure}:00`;
        return !liste.some(rdv => {

            const rdvDateHeure = rdv.date ? rdv.date.slice(0, 16) : '';
            return (
                rdv.prestataireId === formData.prestataireId &&
                rdvDateHeure === dateToCheck.slice(0, 16) &&
                rdv.id !== formData.id
            );
        });
    };

    const onSave = async () => {
        setHeureError("");

        if (!estHeureDisponible(formData.date, formData.heure)) {
            setHeureError("Cet intervenant a déjà un rendez-vous à cette heure.");
            return;
        }

        const dateTime = `${formData.date}T${formData.heure}:00`;
        const payload = { ...formData, date: dateTime };

        try {
            // Afficher le loader
            Swal.fire({
                title: viewMode ? 'Modification en cours...' : 'Ajout en cours...',
                html: '<p style="color:#616161; font-size:0.95rem; margin-top:8px;">Merci de patienter pendant le traitement de votre demande.</p>',
                didOpen: () => Swal.showLoading(),
                allowOutsideClick: false,
                allowEscapeKey: false,
            });

            if (viewMode) {
                await dispatch(updateRendezVous(payload)).unwrap();
            } else {
                await dispatch(createRendezVous(payload)).unwrap();
            }

            Swal.close();

            // Afficher le succès
            Swal.fire({
                title: viewMode ? 'Rendez-vous modifié !' : 'Rendez-vous ajouté !',
                html: `<div style="text-align:center;">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="#198754">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <p style="color:#616161; margin-top:12px; font-size:0.95rem;">
                        Le rendez-vous a été ${viewMode ? 'modifié' : 'créé'} avec succès.
                    </p>
                  </div>`,
                confirmButtonColor: '#198754',
                confirmButtonText: 'OK'
            });

            dispatch(fetchByIntervenant(id));
            setPanelOpen(false);
            setPopoverEventId(null);
            setAnchorEl(null);

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: err.message || 'Une erreur est survenue lors du traitement.',
                confirmButtonText: 'Fermer'
            });
        }
    };


    const onDelete = async () => {
        const { isConfirmed } = await Swal.fire({
            icon: 'warning',
            title: 'Voulez‑vous confirmer la suppression ?',
            text: 'Cette action est irréversible.',
            showCancelButton: true,
            confirmButtonText: 'Supprimer',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#dc3545',
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
            Swal.fire({
                title: 'Suppression en cours...',
                html: '<p style="color:#616161; font-size:0.95rem; margin-top:8px;">Merci de patienter pendant la suppression du rendez-vous.</p>',
                didOpen: () => Swal.showLoading(),
                allowOutsideClick: false,
                allowEscapeKey: false,
            });

            await dispatch(deleteRendezVous({ id: formData.id })).unwrap();
            Swal.close();

            Swal.fire({
                icon: 'success',
                title: 'Rendez-vous supprimé !',
                html: `<div style="text-align:center;">
                    <svg width="60" height="60" fill="#dc3545" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <p style="color:#616161; margin-top:12px; font-size:0.95rem;">Le rendez-vous a été supprimé avec succès.</p>
                  </div>`,
                confirmButtonColor: '#dc3545',
                confirmButtonText: 'OK'
            });

            setPanelOpen(false);
            setPopoverEventId(null);
            setAnchorEl(null);
            dispatch(fetchByIntervenant(id));

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: err.message || 'Impossible de supprimer ce rendez-vous.',
                confirmButtonText: 'Fermer'
            });
        }
    };


    const onConfirmer = async (idRdv) => {
        try {
            Swal.fire({
                title: 'Confirmation en cours...',
                html: '<p style="color:#616161; font-size:0.95rem; margin-top:8px;">Merci de patienter pendant la confirmation du rendez-vous.</p>',
                didOpen: () => Swal.showLoading(),
                allowOutsideClick: false,
                allowEscapeKey: false,
            });

            await dispatch(confirmRendezVous({ id: idRdv })).unwrap();
            Swal.close();

            Swal.fire({
                icon: 'success',
                title: 'Rendez-vous confirmé !',
                html: '<p style="color:#616161; font-size:0.95rem; margin-top:8px;">Le rendez-vous a été confirmé avec succès.</p>',
                confirmButtonColor: '#198754',
                confirmButtonText: 'OK'
            });

            dispatch(fetchByIntervenant(user.utilisateurIdPre));
            setShowPopoverModal(false);
        } catch (err) {
            Swal.fire('Erreur', 'Impossible de confirmer le rendez-vous.', 'error');
        }
    };


    const onAnnuler = async (idRdv) => {
        const { isConfirmed } = await Swal.fire({
            icon: 'warning',
            title: 'Confirmer l\'annulation',
            text: 'Souhaitez-vous vraiment annuler ce rendez-vous ?',
            showCancelButton: true,
            confirmButtonText: 'Oui, annuler',
            cancelButtonText: 'Non',
            confirmButtonColor: '#dc3545',
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
            Swal.fire({
                title: 'Annulation en cours...',
                html: '<p style="color:#616161; font-size:0.95rem; margin-top:8px;">Merci de patienter pendant l\'annulation du rendez-vous.</p>',
                didOpen: () => Swal.showLoading(),
                allowOutsideClick: false,
                allowEscapeKey: false,
            });

            await dispatch(cancelRendezVous({ id: idRdv })).unwrap();
            Swal.close();

            Swal.fire({
                icon: 'success',
                title: 'Rendez-vous annulé !',
                html: '<p style="color:#616161; font-size:0.95rem; margin-top:8px;">Le rendez-vous a été annulé avec succès.</p>',
                confirmButtonColor: '#FF9800',
                confirmButtonText: 'OK'
            });

            dispatch(fetchByIntervenant(user.utilisateurIdPre));
            setShowPopoverModal(false);
        } catch (err) {
            Swal.fire('Erreur', 'Impossible d\'annuler le rendez-vous.', 'error');
        }
    };


    const onTerminer = async (idRdv) => {
        try {
            Swal.fire({
                title: 'Finalisation en cours...',
                html: '<p style="color:#616161; font-size:0.95rem; margin-top:8px;">Merci de patienter pendant la finalisation du rendez-vous.</p>',
                didOpen: () => Swal.showLoading(),
                allowOutsideClick: false,
                allowEscapeKey: false,
            });

            await dispatch(finishRendezVous({ id: idRdv })).unwrap();
            Swal.close();

            Swal.fire({
                icon: 'success',
                title: 'Rendez-vous terminé !',
                html: '<p style="color:#616161; font-size:0.95rem; margin-top:8px;">Le rendez-vous a été marqué comme terminé avec succès.</p>',
                confirmButtonColor: '#9E9E9E',
                confirmButtonText: 'OK'
            });

            dispatch(fetchByIntervenant(user.utilisateurIdPre));
            setShowPopoverModal(false);
        } catch (err) {
            Swal.fire('Erreur', 'Impossible de terminer le rendez-vous.', 'error');
        }
    };


    //Fin Partie
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
        date: (rdv.date && rdv.date.split('T')[0]) || '',
        backgroundColor: STATUTS[rdv.statut]?.color || '#198754',
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
                            dateClick={user?.utilisateur.role === 'CLIENT' ? handleDateClick : undefined}
                            eventClick={handleEventClick}
                            height="auto"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: user?.utilisateur.role === 'CLIENT'
                                    ? 'dayGridMonth,timeGridWeek,listWeek,addButton'
                                    : 'dayGridMonth,timeGridWeek,listWeek'
                            }}
                            customButtons={
                                user?.utilisateur.role === 'CLIENT'
                                    ? {
                                        addButton: {
                                            text: 'Obtenir un rendez-Vous',
                                            click: openAddModal,
                                        },
                                    }
                                    : {}
                            }
                            dayCellDidMount={user?.utilisateur.role === 'CLIENT' ? (info) => {
                                info.el.style.cursor = 'pointer';
                            } : undefined}
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
                                    <span className="text-truncate">
                                        {eventInfo.event.extendedProps.raison ? eventInfo.event.extendedProps.raison.split(' ')[0] + '...' : ''}
                                    </span>
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
                            clientid={rendezVousActuel?.clientId}
                            onEdit={() => {
                                setViewMode(true);
                                setPanelOpen(true);
                                setDateReadonly(false);
                                closePopover();
                            }}
                            onDelete={onDelete}
                            STATUTS={STATUTS}

                            onConfirmer={onConfirmer}
                            onAnnuler={onAnnuler}
                            onTerminer={onTerminer}
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
                    heureError={heureError}
                    setHeureError={setHeureError}
                />
            </div>
            <Footer />
        </>
    );
};

export default CalendrierRendezVous;
