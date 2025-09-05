
// import React, { useEffect, useState, useMemo } from 'react';
// import {
//     Box, Paper, IconButton, Tooltip, Typography, Chip, Button
// } from '@mui/material';
// import { Link, NavLink } from 'react-router-dom';
// import { DataGrid } from '@mui/x-data-grid';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Header from '../Header/Header';
// import Footer from '../Footer/Footer';
// import RendezVousModal from './RendezVousModal';
// import Swal from 'sweetalert2';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import DoneAllIcon from '@mui/icons-material/DoneAll';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//     fetchByClient,
//     fetchByIntervenant,
//     deleteRendezVous,
//     updateRendezVous,
//     confirmRendezVous,
//     cancelRendezVous,
//     finishRendezVous
// } from '../../features/RendezVousSlice';


// const STATUTS = {
//     EN_ATTENTE: { label: 'En attente', color: '#bc8f05' },
//     CONFIRME: { label: 'Confirmé', color: '#127547' },
//     ANNULE: { label: 'Annulé', color: '#a90616' },
//     TERMINE: { label: 'Terminé', color: '#949091' },
// };

// const ListeRendezVous = () => {
//     const dispatch = useDispatch();

//     const { isLoggedIn, user } = useSelector((state) => state.auth);
//     const { listeRendezVous } = useSelector((state) => state.rendezVous);
//     const [intervenantModal, setIntervenantModal] = useState(null);
//     const [panelOpen, setPanelOpen] = useState(false);
//     const [selectionModel, setSelectionModel] = useState([]);
//     const isIntervenant = (user?.utilisateur?.role === 'PRESTATAIRE' || user?.utilisateur?.role === 'ENTREPRISE');

//     const [formData, setFormData] = useState({
//         id: '', date: '', heure: '', lieuDintervention: '', raison: '',
//         clientId: user?.utilisateurIdCl, prestataireId: null
//     });

//     useEffect(() => {
//         if (isLoggedIn) {
//             if (user?.utilisateur.role === 'CLIENT') dispatch(fetchByClient(user.utilisateurIdCl));
//             else if (user?.utilisateur.role === 'PRESTATAIRE' || user?.utilisateur.role === 'ENTREPRISE') dispatch(fetchByIntervenant(user.utilisateurIdPre));
//         }
//     }, [isLoggedIn, user, listeRendezVous, dispatch]);

//     const onSave = async () => {
//         const dateTime = `${formData.date}T${formData.heure}:00`;
//         try {
//             await dispatch(updateRendezVous({ ...formData, date: dateTime })).unwrap();
//             Swal.fire('Succès', 'Rendez-vous modifié', 'success');
//             setPanelOpen(false);
//             if (isIntervenant) dispatch(fetchByIntervenant(user.utilisateurIdPre));
//             else dispatch(fetchByClient(user.utilisateurIdCl));
//         } catch (err) {
//             Swal.fire('Erreur', err.message || 'Erreur', 'error');
//         }
//     };

//     const onDelete = async (rdv) => {
//         const { isConfirmed } = await Swal.fire({
//             icon: 'warning', title: 'Supprimer ?', showCancelButton: true,
//             confirmButtonColor: '#dc3545', cancelButtonColor: '#6c757d'
//         });
//         if (isConfirmed) {
//             await dispatch(deleteRendezVous({ id: rdv.id })).unwrap();
//             Swal.fire('Supprimé', 'Rendez-vous supprimé', 'success');
//             if (isIntervenant) dispatch(fetchByIntervenant(user.utilisateurIdPre));
//             else dispatch(fetchByClient(user.utilisateurIdCl));
//         }
//     };

//     const handleDeleteSelection = async () => {
//         const toDelete = rows.filter(row => selectionModel.includes(row.id) && row.statut === 'EN_ATTENTE');
//         if (toDelete.length === 0) return Swal.fire('Info', 'Aucun en attente', 'info');
//         const { isConfirmed } = await Swal.fire({ icon: 'warning', title: 'Confirmer ?', showCancelButton: true });
//         if (isConfirmed) {
//             for (const row of toDelete) await dispatch(deleteRendezVous({ id: row.id })).unwrap();
//             setSelectionModel([]);
//             Swal.fire('Succès', 'Supprimés', 'success');
//             dispatch(fetchByClient(user.utilisateurIdCl));;
//         }
//     };

//     const handleConfirmSelection = async () => {
//         const toConfirm = rows.filter(row => selectionModel.includes(row.id) && row.statut === 'EN_ATTENTE');
//         for (const r of toConfirm) await dispatch(confirmRendezVous(r.rdv)).unwrap();
//         Swal.fire('Succès', 'Confirmés', 'success');
//         setSelectionModel([]);
//         dispatch(fetchByIntervenant(user.utilisateurIdPre));
//     };
//     const handleCancelSelection = async () => {
//         const toCancel = rows.filter(row => selectionModel.includes(row.id) && row.statut === 'EN_ATTENTE');
//         for (const r of toCancel) await dispatch(cancelRendezVous(r.rdv)).unwrap();
//         Swal.fire('Succès', 'Annulés', 'success');
//         setSelectionModel([]);
//     };
//     const handleFinishSelection = async () => {
//         const toFinish = rows.filter(row => selectionModel.includes(row.id) && row.statut === 'CONFIRME');
//         for (const r of toFinish) await dispatch(finishRendezVous(r.rdv)).unwrap();
//         Swal.fire('Succès', 'Terminés', 'success');
//         setSelectionModel([]);
//         dispatch(fetchByIntervenant(user.utilisateurIdPre));
//     };


//     const renderIntervenantActions = (rdv) => (
//         <Box
//             sx={{
//                 width: '100%',
//                 display: 'flex',
//                 flexDirection: {
//                     xs: 'column',
//                     sm: 'row',
//                 },
//                 justifyContent: 'flex-start',
//                 alignItems: 'center',
//                 py: 1,
//                 gap: 1,
//                 marginRight: "10%",
//             }}
//         >
//             {rdv.statut === 'EN_ATTENTE' && (
//                 <>
//                     <Button size="small" variant="outlined" startIcon={<CheckCircleIcon />} onClick={async () => {
//                         await dispatch(confirmRendezVous(rdv)).unwrap();
//                         await Swal.fire('Succès', 'Rendez-vous confirmé.', 'success');
//                         dispatch(fetchByIntervenant(user.utilisateurIdPre));
//                     }} sx={{
//                         color: '#2e7d32',
//                         borderColor: '#2e7d32',
//                         fontWeight: 'bold',
//                         textTransform: 'none',
//                         px: 1.5,
//                         py: 0.4,
//                         fontSize: '0.75rem',
//                         lineHeight: 1.4,
//                         minHeight: '32px',
//                         width: { xs: '100%', sm: 'auto' },
//                         maxWidth: 140,
//                         whiteSpace: 'nowrap',

//                         '& .MuiButton-startIcon': {
//                             marginRight: '4px',
//                         },
//                         '&:hover': {
//                             backgroundColor: '#e8f5e9',
//                             borderColor: '#2e7d32',
//                         },
//                     }}>
//                         Confirmer
//                     </Button>
//                     <Button size="small" variant="outlined" startIcon={<CancelIcon />} onClick={async () => {
//                         await dispatch(cancelRendezVous(rdv)).unwrap();
//                         await Swal.fire('Succès', 'Rendez-vous annulé.', 'success');
//                         dispatch(fetchByIntervenant(user.utilisateurIdPre));
//                     }}
//                         sx={{
//                             color: '#ef6c00',
//                             borderColor: '#ef6c00',
//                             fontWeight: 'bold',
//                             textTransform: 'none',
//                             px: 1.5,
//                             py: 0.7,
//                             fontSize: '0.75rem',
//                             width: {
//                                 xs: '100%',
//                                 sm: 'auto',
//                             },
//                             maxWidth: 140,
//                             '&:hover': {
//                                 backgroundColor: '#fff3e0',
//                                 borderColor: '#ef6c00',
//                             },
//                         }}
//                     >
//                         Annuler
//                     </Button>
//                 </>
//             )}
//             {rdv.statut === 'CONFIRME' && (
//                 <Button size="small" variant="outlined" startIcon={<DoneAllIcon />} onClick={async () => {
//                     await dispatch(finishRendezVous(rdv)).unwrap();
//                     await Swal.fire('Succès', 'Rendez-vous terminé.', 'success');
//                     dispatch(fetchByIntervenant(user.utilisateurIdPre));
//                 }} sx={{
//                     color: '#787877ff',
//                     borderColor: '#787877ff',
//                     fontWeight: 'bold',
//                     textTransform: 'none',
//                     px: 1.5,
//                     py: 0.4,
//                     fontSize: '0.75rem',
//                     lineHeight: 1.4,
//                     minHeight: '32px',
//                     width: { xs: '100%', sm: 'auto' },
//                     maxWidth: 140,
//                     whiteSpace: 'nowrap',
//                     '& .MuiButton-startIcon': {
//                         marginRight: '4px',
//                     },
//                     marginRight: "50%",
//                     '&:hover': {
//                         backgroundColor: '#fff3e0',
//                         borderColor: '#787877ff',
//                     },
//                 }}>
//                     Terminer
//                 </Button>
//             )}
//         </Box>
//     );

//     const rows = useMemo(() => listeRendezVous?.map((rdv) => {
//         const client = rdv.client?.utilisateur;
//         return {
//             id: rdv.id,
//             raison: rdv.raison,
//             date: new Date(rdv.date).toLocaleString(),
//             lieu: rdv.lieuDintervention,
//             prestataire: rdv.prestataire?.entreprise?.nomEntreprise || `${rdv.prestataire?.utilisateur?.prenom ?? ''} ${rdv.prestataire?.utilisateur?.nom ?? ''}`,
//             nomClient: `${client?.prenom ?? ''} ${client?.nom ?? ''}`,
//             contactClient: client?.email || client?.telephone || '',
//             adresseClient: `${rdv.client?.ville ?? ''}, ${rdv.client?.adresse ?? ''}`,
//             statut: rdv.statut,
//             rdv,
//         }
//     }) || [], [listeRendezVous]);

//     const selectedRows = useMemo(() => rows.filter(row => selectionModel.includes(row.id)), [selectionModel, rows]);
//     const allEnAttente = selectedRows.length > 0 && selectedRows.every(row => row.statut === 'EN_ATTENTE');
//     const allConfirme = selectedRows.length > 0 && selectedRows.every(row => row.statut === 'CONFIRME');
//     const statutsSelectionnes = new Set(selectedRows.map(row => row.statut));
//     const mixedStatuts = statutsSelectionnes.size > 1;

//     const columns = isIntervenant ? [
//         { field: 'nomClient', headerName: 'Nom du client', flex: 1.5 },
//         { field: 'contactClient', headerName: 'Contact', flex: 2 },
//         { field: 'raison', headerName: 'Raison', flex: 2 },
//         { field: 'date', headerName: 'Date', flex: 1.5 },
//         {
//             field: 'adresseClient', headerName: 'Adresse client', flex: 1.5, renderCell: (params) => (
//                 <Link to={`/MapAdresse?adresse=${encodeURIComponent(params.value)}`} style={{ color: '#1976d2' }}>
//                     {params.value}
//                 </Link>
//             ),
//         },
//         {
//             field: 'lieu', headerName: 'Adresse intervention', flex: 1.5, renderCell: (params) => (
//                 <Link to={`/MapAdresse?adresse=${encodeURIComponent(params.value)}`} style={{ color: '#1976d2' }}>
//                     {params.value}
//                 </Link>
//             ),
//         },
//         { field: 'statut', headerName: 'Statut', flex: 1.5, renderCell: ({ value }) => <Chip label={STATUTS[value]?.label || value} style={{ backgroundColor: STATUTS[value]?.color, color: '#fff', width: 100 }} /> },
//         { field: 'actions', headerName: 'Actions', renderCell: ({ row }) => renderIntervenantActions(row.rdv), flex: 2, sortable: false }
//     ] : [
//         { field: 'raison', headerName: 'Raison', flex: 1 },
//         { field: 'date', headerName: 'Date', flex: 1 },
//         {
//             field: 'lieu', headerName: 'Adresse', flex: 1, renderCell: (params) => (
//                 <Link to={`/MapAdresse?adresse=${encodeURIComponent(params.value)}`} style={{ color: '#1976d2' }}>
//                     {params.value}
//                 </Link>
//             ),
//         },
//         { field: 'prestataire', headerName: 'Prestataire', flex: 1 },
//         { field: 'statut', headerName: 'Statut', flex: 1.5, renderCell: ({ value }) => <Chip label={STATUTS[value]?.label || value} style={{ backgroundColor: STATUTS[value]?.color, color: '#fff', width: 100 }} /> },
//         {
//             field: 'actions', headerName: 'Actions', flex: 1.2, sortable: false, renderCell: ({ row }) => {
//                 const { rdv } = row;
//                 const isEditable = rdv.statut === 'EN_ATTENTE';
//                 let datePart = '', timePart = '';
//                 if (rdv.date.includes('T')) [datePart, timePart] = rdv.date.split('T');
//                 return (
//                     <Box display="flex" gap={1}>
//                         <Tooltip title="Modifier">
//                             <span>
//                                 <IconButton onClick={() => {
//                                     setFormData({ id: rdv.id, date: datePart, heure: timePart?.slice(0, 5), lieuDintervention: rdv.lieuDintervention || '', raison: rdv.raison || '', clientId: user?.utilisateurIdCl, prestataireId: rdv.prestataireId || null });
//                                     setIntervenantModal(rdv.prestataire || null);
//                                     setPanelOpen(true);
//                                 }} color="primary" disabled={!isEditable}><EditIcon /></IconButton>
//                             </span>
//                         </Tooltip>
//                         <Tooltip title="Supprimer">
//                             <span>
//                                 <IconButton onClick={() => onDelete(rdv)} color="error" disabled={!isEditable}><DeleteIcon /></IconButton>
//                             </span>
//                         </Tooltip>
//                     </Box>
//                 );
//             }
//         }
//     ];

//     return (
//         <>
//             <Header isClientConnected={isLoggedIn} />
//             <Box className="container mt-4" sx={{ minHeight: 500, width: '95%', maxWidth: '100vw' }}>
//                 <Box mb={3} display="flex" alignItems="center" justifyContent="space-between">
//                     {/* Titre et icône à gauche */}
//                     <Box display="flex" alignItems="center">
//                         <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: 35, color: '#ff6b00', marginRight: 10 }} />
//                         <Box>
//                             <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a3a6c' }}>Mes rendez-vous</Typography>
//                             <Box sx={{ height: 4, width: '80px', backgroundColor: '#ff6b00', borderRadius: 2, mt: 1 }} />
//                         </Box>
//                     </Box>

//                     {isIntervenant && (
//                         <NavLink
//                             to="/calendrier"
//                              target="_blank"
//                             style={{ textDecoration: 'none', marginLeft: 'auto' }} // marginLeft auto pour pousser à droite
//                         >
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 sx={{ textTransform: 'none', fontWeight: 'bold' }}
//                             >
//                                 Calendrier
//                             </Button>
//                         </NavLink>
//                     )}
//                 </Box>
//                 <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
//                     {selectionModel.length > 0 && isIntervenant && (
//                         <Box display="flex" gap={2} justifyContent="flex-end" mb={2}>
//                             {allEnAttente && (
//                                 <>
//                                     <Button onClick={handleConfirmSelection} variant="outlined" startIcon={<CheckCircleIcon />} color="success">Confirmer</Button>
//                                     <Button onClick={handleCancelSelection} variant="outlined" startIcon={<CancelIcon />} color="warning">Annuler</Button>
//                                 </>
//                             )}
//                             {allConfirme && (
//                                 <Button onClick={handleFinishSelection} variant="outlined" startIcon={<DoneAllIcon />} color="primary">Terminer</Button>
//                             )}
//                             {mixedStatuts && (
//                                 <Box
//                                     sx={{
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         gap: 1,
//                                         backgroundColor: '#fdecea',
//                                         color: '#d32f2f',
//                                         border: '1px solid #f9c0bd',
//                                         borderRadius: 2,
//                                         px: 2,
//                                         py: 1,
//                                         fontSize: '0.875rem',
//                                         fontWeight: 500,
//                                     }}
//                                 >
//                                     <CancelIcon fontSize="small" />
//                                     <span>
//                                         Sélection invalide : tous les rendez-vous sélectionnés doivent avoir le même statut.
//                                     </span>
//                                 </Box>
//                             )}

//                         </Box>
//                     )}
//                     {selectionModel.length > 0 && !isIntervenant && (
//                         <Box display="flex" justifyContent="flex-end" mb={2}>
//                             {allEnAttente ? (
//                                 <Button
//                                     onClick={handleDeleteSelection}
//                                     variant="outlined"
//                                     color="error"
//                                     startIcon={<DeleteIcon />}
//                                 >
//                                     Supprimer les cochés
//                                 </Button>
//                             ) : (
//                                 <Box
//                                     sx={{
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         gap: 1,
//                                         backgroundColor: '#fdecea',
//                                         color: '#d32f2f',
//                                         border: '1px solid #f9c0bd',
//                                         borderRadius: 2,
//                                         px: 2,
//                                         py: 1,
//                                         fontSize: '0.875rem',
//                                         fontWeight: 500,
//                                     }}
//                                 >
//                                     <CancelIcon fontSize="small" />
//                                     <span>
//                                         Sélection invalide : tous les rendez-vous sélectionnés doivent avoir le statut "En attente".
//                                     </span>
//                                 </Box>
//                             )}
//                         </Box>
//                     )}

//                     <DataGrid
//                         rows={rows}
//                         columns={columns}
//                         checkboxSelection
//                         onRowSelectionModelChange={(newSelection) => {
//                             if (newSelection?.ids) setSelectionModel(Array.from(newSelection.ids));
//                             else if (Array.isArray(newSelection)) setSelectionModel(newSelection);
//                         }}
//                         selectionModel={selectionModel}
//                         initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
//                         pageSizeOptions={[5, 10, 20]}
//                         pagination
//                         autoHeight
//                         disableRowSelectionOnClick
//                         sx={{ '& .Mui-disabled': { opacity: 0.5 }, '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f6f8', fontWeight: 'bold' } }}
//                     />
//                 </Paper>
//             </Box>
//             <Footer />
//             {panelOpen && (
//                 <RendezVousModal open={panelOpen} onClose={() => setPanelOpen(false)} onSave={onSave} eventData={formData} intervenant={intervenantModal} setEventData={setFormData} />
//             )}
//         </>
//     );
// };

// export default ListeRendezVous;
import React, { useEffect, useState, useMemo } from 'react';
import {
    Box, Paper, IconButton, Tooltip, Typography, Chip, Button, useTheme
} from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import RendezVousModal from './RendezVousModal';
import Swal from 'sweetalert2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faBuilding, faMapMarkerAlt, faEnvelope, faComment, faPhone, faCheckCircle, faCheckDouble, faTimesCircle, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchByClient,
    fetchByIntervenant,
    deleteRendezVous,
    updateRendezVous,
    confirmRendezVous,
    cancelRendezVous,
    finishRendezVous
} from '../../features/RendezVousSlice';

const STATUTS = {
    EN_ATTENTE: {
        label: 'En attente',
        color: '#bc8f05',
        icon: <FontAwesomeIcon icon={faHourglassHalf} />,
    },
    CONFIRME: {
        label: 'Confirmé',
        color: '#127547',
        icon: <FontAwesomeIcon icon={faCheckCircle} />,
    },
    ANNULE: {
        label: 'Annulé',
        color: '#a90616',
        icon: <FontAwesomeIcon icon={faTimesCircle} />,
    },
    TERMINE: {
        label: 'Terminé',
        color: '#949091',
        icon: <FontAwesomeIcon icon={faCheckDouble} />,
    },
};
const ListeRendezVous = () => {
    const dispatch = useDispatch();
    const theme = useTheme();

    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { listeRendezVous } = useSelector((state) => state.rendezVous);
    const [intervenantModal, setIntervenantModal] = useState(null);
    const [panelOpen, setPanelOpen] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const isIntervenant = (user?.utilisateur?.role === 'PRESTATAIRE' || user?.utilisateur?.role === 'ENTREPRISE');

    const [formData, setFormData] = useState({
        id: '', date: '', heure: '', lieuDintervention: '', raison: '',
        clientId: user?.utilisateurIdCl, prestataireId: null
    });

    useEffect(() => {
        if (isLoggedIn) {
            if (user?.utilisateur.role === 'CLIENT') dispatch(fetchByClient(user.utilisateurIdCl));
            else if (user?.utilisateur.role === 'PRESTATAIRE' || user?.utilisateur.role === 'ENTREPRISE') dispatch(fetchByIntervenant(user.utilisateurIdPre));
        }
    }, [isLoggedIn, user, listeRendezVous, dispatch]);
    const rows = useMemo(() => listeRendezVous?.map((rdv) => {
        const client = rdv.client?.utilisateur;
        return {
            id: rdv.id,
            raison: rdv.raison,
            date: new Date(rdv.date).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            lieu: rdv.lieuDintervention,
            prestataire: rdv.prestataire?.entreprise?.nomEntreprise || `${rdv.prestataire?.utilisateur?.prenom ?? ''} ${rdv.prestataire?.utilisateur?.nom ?? ''}`,
            nomClient: `${client?.prenom ?? ''} ${client?.nom ?? ''}`,
            contactClient: client?.email || rdv.client?.numTel || '',
            contactPrestataire: rdv.prestataire?.utilisateur?.email || rdv.prestataire?.numTel || '',
            adresseClient: `${rdv.client?.ville ?? ''}, ${rdv.client?.adresse ?? ''}`,
            statut: rdv.statut,
            rdv,
        }
    }) || [], [listeRendezVous]);
    // Extraire les IDs sélectionnés
    const selectedIds = useMemo(
        () => Object.keys(rowSelection).map((key) => rows[Number(key)]?.id),
        [rowSelection, rows]
    );

    const onSave = async () => {
        const dateTime = `${formData.date}T${formData.heure}:00`;
        Swal.fire({
            title: 'Mise à jour en cours...',
            text: 'Veuillez patienter',
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
        try {
            await dispatch(updateRendezVous({ ...formData, date: dateTime })).unwrap();

            Swal.fire({
                title: 'Rendez-vous modifié ✅',
                html: `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                    <p style="margin:0; text-align: center;">
                        Votre rendez-vous a été mis à jour avec succès.<br>
                        Vous pouvez continuer à gérer vos rendez-vous ci-dessous.
                    </p>
                </div>
            `,
                icon: 'success',
                confirmButtonText: 'Continuer',
                confirmButtonColor: '#198754',
                background: '#f0f9ff',
                iconColor: '#198754',
                timer: 10000,
                timerProgressBar: true,
            });

            setPanelOpen(false);
            if (isIntervenant) dispatch(fetchByIntervenant(user.utilisateurIdPre));
            else dispatch(fetchByClient(user.utilisateurIdCl));
        } catch (err) {
            Swal.fire({
                title: '⚠ Oups, une erreur est survenue',
                html: `
                <p>${err.message || 'Impossible de mettre à jour le rendez-vous pour le moment.'}</p>
                <p>Veuillez réessayer plus tard ou contacter le support si le problème persiste.</p>
            `,
                icon: 'error',
                confirmButtonText: 'Fermer',
                confirmButtonColor: '#d33',
                background: '#fff5f5',
                iconColor: '#c70000',
            });
        }
    };

    const onDelete = async (rdv) => {

        const { isConfirmed } = await Swal.fire({
            icon: 'warning',
            title: 'Voulez‑vous vraiment supprimer ce rendez‑vous ?',
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
        if (isConfirmed) {
            await dispatch(deleteRendezVous({ id: rdv.id })).unwrap();

            Swal.fire({
                title: 'Rendez-vous supprimé',
                html: `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                        <p style="margin:0; text-align: center;">
                            Le rendez-vous a été supprimé avec succès.<br>
                            Vous pouvez continuer à gérer vos rendez-vous ci-dessous.
                        </p>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'Continuer',
                confirmButtonColor: '#198754',
                background: '#f0f9ff',
                iconColor: '#198754',
                timer: 10000,
                timerProgressBar: true,
            });

            if (isIntervenant) dispatch(fetchByIntervenant(user.utilisateurIdPre));
            else dispatch(fetchByClient(user.utilisateurIdCl));
        }
    };

    const handleDeleteSelection = async () => {
        const toDelete = rows.filter(row => selectedIds.includes(row.id) && row.statut === 'EN_ATTENTE');
        if (toDelete.length === 0) return Swal.fire('Info', 'Aucun rendez-vous en attente sélectionné', 'info');

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
        if (isConfirmed) {
            for (const row of toDelete) await dispatch(deleteRendezVous({ id: row.id })).unwrap();
            setRowSelection({});

            Swal.fire({
                title: 'Suppression réussie',
                html: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#4CAF50"/>
            </svg>
            <h3 style="color: #2E7D32; margin: 0;">${toDelete.length} rendez-vous supprimé${toDelete.length > 1 ? 's' : ''}</h3>
            <p style="color: #616161; margin: 0; text-align: center;">
                ${toDelete.length > 1
                        ? 'Les rendez-vous sélectionnés ont été supprimés avec succès.'
                        : 'Le rendez-vous a été supprimé avec succès.'}
            </p>
        </div>
    `,
                showConfirmButton: true,
                confirmButtonText: 'OK',
                confirmButtonColor: '#4CAF50',
                background: '#f0f9f5',
                iconColor: '#4CAF50',
                timer: 8000,
                timerProgressBar: true
            });

            dispatch(fetchByClient(user.utilisateurIdCl));
        }
    };

    const handleConfirmSelection = async () => {
        const toConfirm = rows.filter(row => selectedIds.includes(row.id) && row.statut === 'EN_ATTENTE');
        Swal.fire({ title: 'Confirmation en cours...', text: 'Veuillez patienter', didOpen: () => Swal.showLoading(), allowOutsideClick: false, allowEscapeKey: false });
        for (const r of toConfirm) await dispatch(confirmRendezVous(r.rdv)).unwrap();

        Swal.fire({
            title: 'Rendez-vous confirmés',
            html: `
        <div style="
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            gap: 12px; 
            padding: 10px;
        ">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#4CAF50"/>
            </svg>
            <h2 style="
                color: #2E7D32; 
                font-size: 1.5rem; 
                font-weight: 600; 
                margin: 0;
            ">
                ${toConfirm.length} rendez-vous confirmés
            </h2>
            <p style="
                color: #555; 
                font-size: 1rem; 
                text-align: center; 
                margin: 0;
                line-height: 1.4;
            ">
                Les rendez-vous sélectionnés ont été confirmés avec succès.
            </p>
        </div>
    `,
            showConfirmButton: true,
            confirmButtonText: 'Continuer',
            confirmButtonColor: '#4CAF50',
            background: '#f0fdf4',
            timer: 6000,
            timerProgressBar: true,
            icon: 'success',
            iconColor: '#4CAF50'
        });


        setRowSelection({});
        dispatch(fetchByIntervenant(user.utilisateurIdPre));
    };


    const handleCancelSelection = async () => {
        const toCancel = rows.filter(row => selectedIds.includes(row.id) && row.statut === 'EN_ATTENTE');

        Swal.fire({
            title: 'Annulation en cours...',
            text: 'Merci de patienter, vos actions sont en cours de traitement.',
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
            allowEscapeKey: false,
        });

        for (const r of toCancel) await dispatch(cancelRendezVous(r.rdv)).unwrap();
        Swal.close();

        Swal.fire({
            title: 'Rendez-vous annulés',
            html: `<div style="text-align:center;">
                <svg width="60" height="60" fill="#a90616" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <p style="margin-top:12px; color:#616161; font-size:0.95rem;">
                    ${toCancel.length} rendez-vous ont été annulés avec succès.
                </p>
               </div>`,
            confirmButtonText: 'Terminé',
            confirmButtonColor: '#a90616'
        });

        setRowSelection({});
    };


    const handleFinishSelection = async () => {
        const toFinish = rows.filter(row => selectedIds.includes(row.id) && row.statut === 'CONFIRME');

        Swal.fire({
            title: 'Finalisation en cours...',
            text: 'Merci de patienter pendant la mise à jour des rendez-vous.',
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
            allowEscapeKey: false,
        });

        for (const r of toFinish) await dispatch(finishRendezVous(r.rdv)).unwrap();
        Swal.close();

        Swal.fire({
            title: 'Rendez-vous terminés',
            html: `<div style="text-align:center;">
                <svg width="60" height="60" fill="#9E9E9E" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <p style="margin-top:12px; color:#616161; font-size:0.95rem;">
                    ${toFinish.length} rendez-vous ont été marqués comme terminés avec succès.
                </p>
               </div>`,
            confirmButtonText: 'Terminé',
            confirmButtonColor: '#9E9E9E'
        });

        setRowSelection({});
        dispatch(fetchByIntervenant(user.utilisateurIdPre));
    };


    const handleConfirmSingle = async (rdv) => {
        Swal.fire({
            title: 'Confirmation en cours...',
            text: 'Merci de patienter pendant la confirmation du rendez-vous.',
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
            allowEscapeKey: false,
        });

        await dispatch(confirmRendezVous(rdv)).unwrap();
        Swal.close();

        Swal.fire({
            title: 'Rendez-vous confirmé',
            html: `<div style="text-align:center;">
                <svg width="60" height="60" fill="#4CAF50" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <p style="margin-top:12px; color:#616161; font-size:0.95rem;">
                    Le rendez-vous a été confirmé avec succès.
                </p>
               </div>`,
            confirmButtonText: 'Terminé',
            confirmButtonColor: '#4CAF50'
        });

        dispatch(fetchByIntervenant(user.utilisateurIdPre));
    };


    const handleCancelSingle = async (rdv) => {
        Swal.fire({
            title: 'Annulation en cours...',
            text: 'Merci de patienter pendant l’annulation du rendez-vous.',
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
            allowEscapeKey: false,
        });

        await dispatch(cancelRendezVous(rdv)).unwrap();
        Swal.close();

        Swal.fire({
            title: 'Rendez-vous annulé',
            html: `<div style="text-align:center;">
                <svg width="60" height="60" fill="#a90616" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <p style="margin-top:12px; color:#616161; font-size:0.95rem;">
                    Le rendez-vous a été annulé avec succès.
                </p>
               </div>`,
            confirmButtonText: 'Terminé',
            confirmButtonColor: '#a90616'
        });

        dispatch(fetchByIntervenant(user.utilisateurIdPre));
    };


    const handleFinishSingle = async (rdv) => {
        Swal.fire({
            title: 'Finalisation en cours...',
            html: '<p style="font-size:0.95rem; color:#616161; margin-top:8px;">Merci de patienter pendant la finalisation du rendez-vous.</p>',
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
            allowEscapeKey: false,
        });

        await dispatch(finishRendezVous(rdv)).unwrap();
        Swal.close();

        Swal.fire({
            title: 'Rendez-vous terminé',
            html: `<div style="text-align:center;">
                <svg width="60" height="60" fill="#9E9E9E" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <p style="margin-top:12px; color:#616161; font-size:0.95rem;">
                    Le rendez-vous a été marqué comme terminé.
                </p>
               </div>`,
            confirmButtonText: 'Terminé',
            confirmButtonColor: '#9E9E9E'
        });

        dispatch(fetchByIntervenant(user.utilisateurIdPre));
    };


    const renderIntervenantActions = (rdv) => (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'flex-start',
                alignItems: 'center',
                py: 1,
                gap: 1,
            }}
        >
            {rdv.statut === 'EN_ATTENTE' && (
                <>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleConfirmSingle(rdv)}
                        sx={{
                            backgroundColor: '#2e7d32',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            px: 1.5,
                            py: 0.4,
                            fontSize: '0.75rem',
                            lineHeight: 1.4,
                            minHeight: '32px',
                            width: { xs: '100%', sm: 'auto' },
                            maxWidth: 140,
                            whiteSpace: 'nowrap',
                            '& .MuiButton-startIcon': { marginRight: '4px' },
                            '&:hover': { backgroundColor: '#1b5e20' },
                        }}
                    >
                        Confirmer
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<CancelIcon />}
                        onClick={() => handleCancelSingle(rdv)}
                        sx={{
                            backgroundColor: '#ef6c00',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            px: 1.5,
                            py: 0.7,
                            fontSize: '0.75rem',
                            width: { xs: '100%', sm: 'auto' },
                            maxWidth: 140,
                            '&:hover': { backgroundColor: '#e65100' },
                        }}
                    >
                        Annuler
                    </Button>
                </>
            )}

            {rdv.statut === 'CONFIRME' && (
                <Button
                    size="small"
                    variant="contained"
                    startIcon={<DoneAllIcon />}
                    onClick={() => handleFinishSingle(rdv)}
                    sx={{
                        backgroundColor: '#787877',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        px: 1.5,
                        py: 0.4,
                        fontSize: '0.75rem',
                        lineHeight: 1.4,
                        minHeight: '32px',
                        width: { xs: '100%', sm: 'auto' },
                        maxWidth: 140,
                        whiteSpace: 'nowrap',
                        '& .MuiButton-startIcon': { marginRight: '4px' },
                        '&:hover': { backgroundColor: '#616161' },
                    }}
                >
                    Terminer
                </Button>
            )}
        </Box>
    );

    const getContactIcon = (contact) => {
        if (!contact) return faEnvelope; // Par défaut email
        return contact.includes('@') ? faEnvelope : faPhone;
    };


    const selectedRows = useMemo(
        () => rows.filter((row) => selectedIds.includes(row.id)),
        [selectedIds, rows]
    );
    const allEnAttente = selectedRows.length > 0 && selectedRows.every(row => row.statut === 'EN_ATTENTE');
    const allConfirme = selectedRows.length > 0 && selectedRows.every(row => row.statut === 'CONFIRME');
    const statutsSelectionnes = new Set(selectedRows.map(row => row.statut));
    const mixedStatuts = statutsSelectionnes.size > 1;

    // Définition des colonnes pour MaterialReactTable
    const columns = useMemo(() => isIntervenant ? [
        {
            accessorKey: 'nomClient',
            header: 'Client',
            size: 200,
            Cell: ({ cell }) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <FontAwesomeIcon icon={faUser} style={{ color: '#757575', fontSize: '14px' }} />
                    <Typography variant="body2" fontWeight="medium">{cell.getValue()}</Typography>
                </Box>
            ),
        },
        {
            accessorKey: 'contactClient',
            header: 'Contact',
            size: 200,
            Cell: ({ cell }) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <FontAwesomeIcon
                        icon={getContactIcon(cell.getValue())}
                        style={{ color: '#757575', fontSize: '14px' }}
                    />
                    <Typography variant="body2" color="textSecondary">
                        {cell.getValue()}
                    </Typography>
                </Box>
            ),
        },
        {
            accessorKey: 'raison',
            header: 'Raison',
            size: 300,
            Cell: ({ cell }) => (
                <Box
                    sx={{
                        p: 1,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        borderLeft: '3px solid',
                        borderLeftColor: theme.palette.primary.main
                    }}
                >
                    <Tooltip title={cell.getValue()} arrow>
                        <Typography
                            variant="body2"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontStyle: 'italic',
                                lineHeight: 1.4
                            }}
                        >
                            "{cell.getValue()}"
                        </Typography>
                    </Tooltip>
                </Box>
            ),
        },
        {
            accessorKey: 'date',
            header: 'Date',
            size: 200,
            Cell: ({ cell }) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#757575', fontSize: '14px' }} />
                    <Typography variant="body2">{cell.getValue()}</Typography>
                </Box>
            ),
        },
        {
            accessorKey: 'adresseClient',
            header: 'Adresse client',
            size: 200,
            Cell: ({ cell }) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#757575', fontSize: '14px' }} />
                    <Link
                        to={`/MapAdresse?adresse=${encodeURIComponent(cell.getValue())}`}
                        onClick={(e) => {
                            e.preventDefault(); // empêche la navigation normale
                            window.open(
                                `/MapAdresse?adresse=${encodeURIComponent(cell.getValue())}`,
                                "_blank",
                                "noopener,noreferrer"
                            );
                        }}
                        style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ "&:hover": { textDecoration: "underline" } }}
                        >
                            {cell.getValue()}
                        </Typography>
                    </Link>
                </Box>
            ),
        },
        {
            accessorKey: 'lieu',
            header: 'Lieu d\'intervention',
            size: 200,
            Cell: ({ cell }) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#757575', fontSize: '14px' }} />
                    <Link
                        to={`/MapAdresse?adresse=${encodeURIComponent(cell.getValue())}`}
                        onClick={(e) => {
                            e.preventDefault(); // empêche la navigation interne
                            window.open(
                                `/MapAdresse?adresse=${encodeURIComponent(cell.getValue())}`,
                                "_blank",
                                "noopener,noreferrer"
                            );
                        }}
                        style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ "&:hover": { textDecoration: "underline" } }}
                        >
                            {cell.getValue()}
                        </Typography>
                    </Link>
                </Box>
            ),
        },
        {
            accessorKey: 'statut',
            header: 'Statut',
            size: 200,
            Cell: ({ cell }) => {
                const statut = STATUTS[cell.getValue()];
                return (
                    <Chip
                        icon={statut?.icon}   // ✅ direct, sans <span>
                        label={statut?.label || cell.getValue()}
                        sx={{
                            backgroundColor: statut?.color,
                            color: '#fff',
                            fontWeight: 'bold',
                            '& .MuiChip-icon': { color: '#fff', marginLeft: '8px' }, // ici tu forces bien en blanc
                        }}
                    />
                );
            },
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            size: 250,
            Cell: ({ row }) => renderIntervenantActions(row.original.rdv),
        }
    ] : [
        {
            accessorKey: 'prestataire',
            header: 'Prestataire',
            size: 200,
            Cell: ({ cell }) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <FontAwesomeIcon
                        icon={user?.utilisateur?.role === 'ENTREPRISE' ? faBuilding : faUser}
                        style={{ color: '#757575', fontSize: '14px' }}
                    />
                    <Typography variant="body2" fontWeight="medium">{cell.getValue()}</Typography>
                </Box>
            ),
        },
        {
            accessorKey: 'contactPrestataire',
            header: 'Contact',
            size: 200,
            Cell: ({ cell }) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <FontAwesomeIcon
                        icon={getContactIcon(cell.getValue())}
                        style={{ color: '#757575', fontSize: '14px' }}
                    />
                    <Typography variant="body2" color="textSecondary">
                        {cell.getValue()}
                    </Typography>
                </Box>
            ),
        },
        {
            accessorKey: 'raison',
            header: 'Raison',
            size: 300,
            Cell: ({ cell }) => (
                <Box
                    sx={{
                        p: 1,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        borderLeft: '3px solid',
                        borderLeftColor: theme.palette.primary.main
                    }}
                >
                    <Tooltip title={cell.getValue()} arrow>
                        <Typography
                            variant="body2"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontStyle: 'italic',
                                lineHeight: 1.4
                            }}
                        >
                            "{cell.getValue()}"
                        </Typography>
                    </Tooltip>
                </Box>
            ),
        },
        {
            accessorKey: 'date',
            header: 'Date',
            size: 200,
            Cell: ({ cell }) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#757575', fontSize: '14px' }} />
                    <Typography variant="body2">{cell.getValue()}</Typography>
                </Box>
            ),
        },
        {
            accessorKey: 'lieu',
            header: 'Lieu d\'intervention',
            size: 200,
            Cell: ({ cell }) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#757575', fontSize: '14px' }} />
                    <Link
                        to={`/MapAdresse?adresse=${encodeURIComponent(cell.getValue())}`}
                        onClick={(e) => {
                            e.preventDefault(); // bloque la navigation interne
                            window.open(
                                `/MapAdresse?adresse=${encodeURIComponent(cell.getValue())}`,
                                "_blank",
                                "noopener,noreferrer"
                            );
                        }}
                        style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ "&:hover": { textDecoration: "underline" } }}
                        >
                            {cell.getValue()}
                        </Typography>
                    </Link>
                </Box>
            ),
        },
        {
            accessorKey: 'statut',
            header: 'Statut',
            size: 200,
            Cell: ({ cell }) => {
                const statut = STATUTS[cell.getValue()];
                return (
                    <Chip
                        icon={statut?.icon}
                        label={statut?.label || cell.getValue()}
                        sx={{
                            backgroundColor: statut?.color,
                            color: '#fff',
                            fontWeight: 'bold',
                            '& .MuiChip-icon': { color: '#fff', marginLeft: '8px' }, // ici tu forces bien en blanc
                        }}
                    />
                );
            },
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            size: 250,
            Cell: ({ row }) => {
                const { rdv } = row.original;
                const isEditable = rdv.statut === 'EN_ATTENTE';
                let datePart = '', timePart = '';
                if (rdv.date.includes('T')) [datePart, timePart] = rdv.date.split('T');

                return (
                    <Box display="flex" gap={1}>
                        <Tooltip title="Modifier">
                            <span>
                                <IconButton
                                    onClick={() => {
                                        setFormData({
                                            id: rdv.id,
                                            date: datePart,
                                            heure: timePart?.slice(0, 5),
                                            lieuDintervention: rdv.lieuDintervention || '',
                                            raison: rdv.raison || '',
                                            clientId: user?.utilisateurIdCl,
                                            prestataireId: rdv.prestataireId || null
                                        });
                                        setIntervenantModal(rdv.prestataire || null);
                                        setPanelOpen(true);
                                    }}
                                    color="primary"
                                    disabled={!isEditable}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#e3f2fd',
                                        '&:hover': { backgroundColor: '#bbdefb' }
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                            <span>
                                <IconButton
                                    onClick={() => onDelete(rdv)}
                                    color="error"
                                    disabled={!isEditable}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#ffebee',
                                        '&:hover': { backgroundColor: '#ffcdd2' }
                                    }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                );
            }
        }
    ], [isIntervenant, user, theme]);

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <Box
                sx={{
                    minHeight: '80vh',
                    width: "100%",
                    maxWidth: "100vw",
                    p: 3,
                    backgroundColor: '#f9fafb',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Box sx={{
                    minHeight: 600,
                    width: '95%',
                    maxWidth: '1800px'
                }}>
                    <Box mb={3} display="flex" alignItems="center" sx={{ width: '100%' }}>
                        <Box
                            sx={{
                                backgroundColor: '#f5f5f5',
                                borderRadius: '50%',
                                p: 1.5,
                                mr: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: `2px solid ${theme.palette.primary.main}`
                            }}
                        >
                            <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: 25, color: theme.palette.primary.main }} />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                                Mes Rendez-vous
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Consultez et gérez tous vos rendez-vous
                            </Typography>
                        </Box>

                        {isIntervenant && (
                            <NavLink
                                to="/calendrier"
                                target="_blank"
                                style={{ textDecoration: 'none' }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1
                                    }}
                                >
                                    Calendrier
                                </Button>
                            </NavLink>
                        )}
                    </Box>

                    <Paper
                        elevation={1}
                        sx={{
                            width: '100%',
                            overflow: 'hidden',
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: `1px solid #e0e0e0`
                        }}
                    >
                        {selectedIds.length > 0 && isIntervenant && (
                            <Box display="flex" gap={2} justifyContent="flex-end" mb={2} p={2} sx={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                                {allEnAttente && (
                                    <>
                                        <Button onClick={handleConfirmSelection} variant="contained" startIcon={<CheckCircleIcon />} color="success" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                            Confirmer ({selectedIds.length})
                                        </Button>
                                        <Button onClick={handleCancelSelection} variant="contained" startIcon={<CancelIcon />} color="warning" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                            Annuler ({selectedIds.length})
                                        </Button>
                                    </>
                                )}
                                {allConfirme && (
                                    <Button onClick={handleFinishSelection} variant="contained" startIcon={<DoneAllIcon />} color="primary" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                        Terminer ({selectedIds.length})
                                    </Button>
                                )}
                                {mixedStatuts && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            backgroundColor: '#fdecea',
                                            color: '#d32f2f',
                                            border: '1px solid #f9c0bd',
                                            borderRadius: 2,
                                            px: 2,
                                            py: 1,
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                        }}
                                    >
                                        <CancelIcon fontSize="small" />
                                        <span>
                                            Sélection invalide : tous les rendez-vous sélectionnés doivent avoir le même statut.
                                        </span>
                                    </Box>
                                )}
                            </Box>
                        )}
                        {selectedIds.length > 0 && !isIntervenant && (
                            <Box display="flex" justifyContent="flex-end" mb={2} p={2} sx={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                                {allEnAttente ? (
                                    <Button
                                        onClick={handleDeleteSelection}
                                        variant="contained"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                    >
                                        Supprimer ({selectedIds.length})
                                    </Button>
                                ) : (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            backgroundColor: '#fdecea',
                                            color: '#d32f2f',
                                            border: '1px solid #f9c0bd',
                                            borderRadius: 2,
                                            px: 2,
                                            py: 1,
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                        }}
                                    >
                                        <CancelIcon fontSize="small" />
                                        <span>
                                            Sélection invalide : tous les rendez-vous sélectionnés doivent avoir le statut "En attente".
                                        </span>
                                    </Box>
                                )}
                            </Box>
                        )}

                        <MaterialReactTable
                            columns={columns}
                            data={rows}
                            enableRowSelection
                            enableMultiRowSelection
                            enableFullScreenToggle={false}
                            enableDensityToggle={false}
                            enableHiding={false}
                            onRowSelectionChange={setRowSelection}
                            state={{ rowSelection }}
                            initialState={{
                                pagination: { pageSize: 5, pageIndex: 0 },
                                density: 'comfortable'
                            }}
                            muiTablePaperProps={{
                                sx: {
                                    boxShadow: 'none',
                                }
                            }}
                            muiTableHeadCellProps={{
                                sx: {
                                    fontWeight: 'bold',
                                    backgroundColor: '#f5f5f5',
                                    color: '#424242',
                                    fontSize: '0.95rem',
                                    py: 1.5,
                                    borderRight: '1px solid #e0e0e0',
                                    '&:last-child': {
                                        borderRight: 'none'
                                    }
                                },
                            }}
                            muiTableBodyCellProps={{
                                sx: {
                                    py: 1.5,
                                    borderBottom: '1px solid',
                                    borderColor: 'grey.100',
                                    borderRight: '1px solid #f0f0f0',
                                    '&:last-child': {
                                        borderRight: 'none'
                                    }
                                },
                            }}
                            muiTableBodyRowProps={{
                                sx: {
                                    '&:nth-of-type(even)': {
                                        backgroundColor: '#fafafa',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#f1f1f1',
                                    },
                                },
                            }}
                            muiBottomToolbarProps={{
                                sx: {
                                    backgroundColor: '#f5f5f5',
                                    borderTop: '1px solid',
                                    borderColor: '#e0e0e0',
                                },
                            }}
                        />
                    </Paper>
                </Box>
            </Box>
            <Footer />
            {panelOpen && (
                <RendezVousModal open={panelOpen} onClose={() => setPanelOpen(false)} onSave={onSave} eventData={formData} intervenant={intervenantModal} setEventData={setFormData} />
            )}
        </>
    );
};

export default ListeRendezVous;