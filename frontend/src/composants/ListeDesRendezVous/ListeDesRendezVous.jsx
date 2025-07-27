
import React, { useEffect, useState, useMemo } from 'react';
import {
    Box, Paper, IconButton, Tooltip, Typography, Chip, Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
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
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
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
    EN_ATTENTE: { label: 'En attente', color: '#bc8f05' },
    CONFIRME: { label: 'Confirmé', color: '#127547' },
    ANNULE: { label: 'Annulé', color: '#a90616' },
    TERMINE: { label: 'Terminé', color: '#949091' },
};

const ListeRendezVous = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { listeRendezVous } = useSelector((state) => state.rendezVous);
    const [intervenantModal, setIntervenantModal] = useState(null);
    const [panelOpen, setPanelOpen] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    const isIntervenant = user?.utilisateur?.role === 'PRESTATAIRE' || user?.utilisateur?.role === 'ENTREPRISE';

    const [formData, setFormData] = useState({
        id: '', date: '', heure: '', lieuDintervention: '', raison: '',
        clientId: user?.utilisateurIdCl, prestataireId: null
    });

    useEffect(() => {
        if (isLoggedIn) {
            if (user?.utilisateur.role === 'CLIENT') dispatch(fetchByClient(user.utilisateurIdCl));
            else if (user?.utilisateur.role === 'PRESTATAIRE' || user?.utilisateur.role === 'ENTREPRISE') dispatch(fetchByIntervenant(user.utilisateurIdPre));
        }
    }, [isLoggedIn, user, dispatch]);

    const onSave = async () => {
        const dateTime = `${formData.date}T${formData.heure}:00`;
        try {
            await dispatch(updateRendezVous({ ...formData, date: dateTime })).unwrap();
            Swal.fire('Succès', 'Rendez-vous modifié', 'success');
            setPanelOpen(false);
            if (isIntervenant) dispatch(fetchByIntervenant(user.utilisateurIdPre));
            else dispatch(fetchByClient(user.utilisateurIdCl));
        } catch (err) {
            Swal.fire('Erreur', err.message || 'Erreur', 'error');
        }
    };

    const onDelete = async (rdv) => {
        const { isConfirmed } = await Swal.fire({
            icon: 'warning', title: 'Supprimer ?', showCancelButton: true,
            confirmButtonColor: '#dc3545', cancelButtonColor: '#6c757d'
        });
        if (isConfirmed) {
            await dispatch(deleteRendezVous({ id: rdv.id })).unwrap();
            Swal.fire('Supprimé', 'Rendez-vous supprimé', 'success');
            if (isIntervenant) dispatch(fetchByIntervenant(user.utilisateurIdPre));
            else dispatch(fetchByClient(user.utilisateurIdCl));
        }
    };

    const handleDeleteSelection = async () => {
        const toDelete = rows.filter(row => selectionModel.includes(row.id) && row.statut === 'EN_ATTENTE');
        if (toDelete.length === 0) return Swal.fire('Info', 'Aucun en attente', 'info');
        const { isConfirmed } = await Swal.fire({ icon: 'warning', title: 'Confirmer ?', showCancelButton: true });
        if (isConfirmed) {
            for (const row of toDelete) await dispatch(deleteRendezVous({ id: row.id })).unwrap();
            setSelectionModel([]);
            Swal.fire('Succès', 'Supprimés', 'success');
            dispatch(fetchByClient(user.utilisateurIdCl));;
        }
    };

    const handleConfirmSelection = async () => {
        const toConfirm = rows.filter(row => selectionModel.includes(row.id) && row.statut === 'EN_ATTENTE');
        for (const r of toConfirm) await dispatch(confirmRendezVous(r.rdv)).unwrap();
        Swal.fire('Succès', 'Confirmés', 'success');
        setSelectionModel([]);
        dispatch(fetchByIntervenant(user.utilisateurIdPre));
    };
    const handleCancelSelection = async () => {
        const toCancel = rows.filter(row => selectionModel.includes(row.id) && row.statut === 'EN_ATTENTE');
        for (const r of toCancel) await dispatch(cancelRendezVous(r.rdv)).unwrap();
        Swal.fire('Succès', 'Annulés', 'success');
        setSelectionModel([]);
    };
    const handleFinishSelection = async () => {
        const toFinish = rows.filter(row => selectionModel.includes(row.id) && row.statut === 'CONFIRME');
        for (const r of toFinish) await dispatch(finishRendezVous(r.rdv)).unwrap();
        Swal.fire('Succès', 'Terminés', 'success');
        setSelectionModel([]);
        dispatch(fetchByIntervenant(user.utilisateurIdPre));
    };
 

    const renderIntervenantActions = (rdv) => (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: {
                    xs: 'column',
                    sm: 'row',
                },
                justifyContent: 'flex-start',
                alignItems: 'center',
                py: 1,
                gap: 1,
                marginRight: "10%",
            }}
        >
            {rdv.statut === 'EN_ATTENTE' && (
                <>
                    <Button size="small" variant="outlined" startIcon={<CheckCircleIcon />} onClick={async () => {
                        await dispatch(confirmRendezVous(rdv)).unwrap();
                        await Swal.fire('Succès', 'Rendez-vous confirmé.', 'success');
                        dispatch(fetchByIntervenant(user.utilisateurIdPre));
                    }} sx={{
                        color: '#2e7d32',
                        borderColor: '#2e7d32',
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

                        '& .MuiButton-startIcon': {
                            marginRight: '4px',
                        },
                        '&:hover': {
                            backgroundColor: '#e8f5e9',
                            borderColor: '#2e7d32',
                        },
                    }}>
                        Confirmer
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<CancelIcon />} onClick={async () => {
                        await dispatch(cancelRendezVous(rdv)).unwrap();
                        await Swal.fire('Succès', 'Rendez-vous annulé.', 'success');
                        dispatch(fetchByIntervenant(user.utilisateurIdPre));
                    }}
                        sx={{
                            color: '#ef6c00',
                            borderColor: '#ef6c00',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            px: 1.5,
                            py: 0.7,
                            fontSize: '0.75rem',
                            width: {
                                xs: '100%',
                                sm: 'auto',
                            },
                            maxWidth: 140,
                            '&:hover': {
                                backgroundColor: '#fff3e0',
                                borderColor: '#ef6c00',
                            },
                        }}
                    >
                        Annuler
                    </Button>
                </>
            )}
            {rdv.statut === 'CONFIRME' && (
                <Button size="small" variant="outlined" startIcon={<DoneAllIcon />} onClick={async () => {
                    await dispatch(finishRendezVous(rdv)).unwrap();
                    await Swal.fire('Succès', 'Rendez-vous terminé.', 'success');
                    dispatch(fetchByIntervenant(user.utilisateurIdPre));
                }} sx={{
                    color: '#787877ff',
                    borderColor: '#787877ff',
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
                    '& .MuiButton-startIcon': {
                        marginRight: '4px',
                    },
                    marginRight: "50%",
                    '&:hover': {
                        backgroundColor: '#fff3e0',
                        borderColor: '#787877ff',
                    },
                }}>
                    Terminer
                </Button>
            )}
        </Box>
    );

    const rows = useMemo(() => listeRendezVous?.map((rdv) => {
        const client = rdv.client?.utilisateur;
        return {
            id: rdv.id,
            raison: rdv.raison,
            date: new Date(rdv.date).toLocaleString(),
            lieu: rdv.lieuDintervention,
            prestataire: rdv.prestataire?.entreprise?.nomEntreprise || `${rdv.prestataire?.utilisateur?.prenom ?? ''} ${rdv.prestataire?.utilisateur?.nom ?? ''}`,
            nomClient: `${client?.prenom ?? ''} ${client?.nom ?? ''}`,
            contactClient: client?.email || client?.telephone || '',
            adresseClient: `${rdv.client?.ville ?? ''}, ${rdv.client?.adresse ?? ''}`,
            statut: rdv.statut,
            rdv,
        }
    }) || [], [listeRendezVous]);

    const selectedRows = useMemo(() => rows.filter(row => selectionModel.includes(row.id)), [selectionModel, rows]);
    const allEnAttente = selectedRows.length > 0 && selectedRows.every(row => row.statut === 'EN_ATTENTE');
    const allConfirme = selectedRows.length > 0 && selectedRows.every(row => row.statut === 'CONFIRME');
    const statutsSelectionnes = new Set(selectedRows.map(row => row.statut));
    const mixedStatuts = statutsSelectionnes.size > 1;

    const columns = isIntervenant ? [
        { field: 'nomClient', headerName: 'Nom du client', flex: 1.5 },
        { field: 'contactClient', headerName: 'Contact', flex: 2 },
        { field: 'raison', headerName: 'Raison', flex: 2 },
        { field: 'date', headerName: 'Date', flex: 1.5 },
        {
            field: 'adresseClient', headerName: 'Adresse client', flex: 1.5, renderCell: (params) => (
                <Link to={`/MapAdresse?adresse=${encodeURIComponent(params.value)}`} style={{ color: '#1976d2' }}>
                    {params.value}
                </Link>
            ),
        },
        {
            field: 'lieu', headerName: 'Adresse intervention', flex: 1.5, renderCell: (params) => (
                <Link to={`/MapAdresse?adresse=${encodeURIComponent(params.value)}`} style={{ color: '#1976d2' }}>
                    {params.value}
                </Link>
            ),
        },
        { field: 'statut', headerName: 'Statut', flex: 1.5, renderCell: ({ value }) => <Chip label={STATUTS[value]?.label || value} style={{ backgroundColor: STATUTS[value]?.color, color: '#fff', width: 100 }} /> },
        { field: 'actions', headerName: 'Actions', renderCell: ({ row }) => renderIntervenantActions(row.rdv), flex: 2, sortable: false }
    ] : [
        { field: 'raison', headerName: 'Raison', flex: 1 },
        { field: 'date', headerName: 'Date', flex: 1 },
        {
            field: 'lieu', headerName: 'Adresse', flex: 1, renderCell: (params) => (
                <Link to={`/MapAdresse?adresse=${encodeURIComponent(params.value)}`} style={{ color: '#1976d2' }}>
                    {params.value}
                </Link>
            ),
        },
        { field: 'prestataire', headerName: 'Prestataire', flex: 1 },
        { field: 'statut', headerName: 'Statut', flex: 1.5, renderCell: ({ value }) => <Chip label={STATUTS[value]?.label || value} style={{ backgroundColor: STATUTS[value]?.color, color: '#fff', width: 100 }} /> },
        {
            field: 'actions', headerName: 'Actions', flex: 1.2, sortable: false, renderCell: ({ row }) => {
                const { rdv } = row;
                const isEditable = rdv.statut === 'EN_ATTENTE';
                let datePart = '', timePart = '';
                if (rdv.date.includes('T')) [datePart, timePart] = rdv.date.split('T');
                return (
                    <Box display="flex" gap={1}>
                        <Tooltip title="Modifier">
                            <span>
                                <IconButton onClick={() => {
                                    setFormData({ id: rdv.id, date: datePart, heure: timePart?.slice(0, 5), lieuDintervention: rdv.lieuDintervention || '', raison: rdv.raison || '', clientId: user?.utilisateurIdCl, prestataireId: rdv.prestataireId || null });
                                    setIntervenantModal(rdv.prestataire || null);
                                    setPanelOpen(true);
                                }} color="primary" disabled={!isEditable}><EditIcon /></IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                            <span>
                                <IconButton onClick={() => onDelete(rdv)} color="error" disabled={!isEditable}><DeleteIcon /></IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                );
            }
        }
    ];

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <Box className="container mt-4" sx={{ minHeight: 500, width: '95%', maxWidth: '100vw' }}>
                <Box mb={3} display="flex" alignItems="center">
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: 35, color: '#ff6b00', marginRight: 10 }} />
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a3a6c' }}>Mes rendez-vous</Typography>
                        <Box sx={{ height: 4, width: '80px', backgroundColor: '#ff6b00', borderRadius: 2, mt: 1 }} />
                    </Box>
                </Box>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    {selectionModel.length > 0 && isIntervenant && (
                        <Box display="flex" gap={2} justifyContent="flex-end" mb={2}>
                            {allEnAttente && (
                                <>
                                    <Button onClick={handleConfirmSelection} variant="outlined" startIcon={<CheckCircleIcon />} color="success">Confirmer</Button>
                                    <Button onClick={handleCancelSelection} variant="outlined" startIcon={<CancelIcon />} color="warning">Annuler</Button>
                                </>
                            )}
                            {allConfirme && (
                                <Button onClick={handleFinishSelection} variant="outlined" startIcon={<DoneAllIcon />} color="primary">Terminer</Button>
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
                    {selectionModel.length > 0 && !isIntervenant && (
                        <Box display="flex" justifyContent="flex-end" mb={2}>
                            {allEnAttente ? (
                                <Button
                                    onClick={handleDeleteSelection}
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                >
                                    Supprimer les cochés
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

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={(newSelection) => {
                            if (newSelection?.ids) setSelectionModel(Array.from(newSelection.ids));
                            else if (Array.isArray(newSelection)) setSelectionModel(newSelection);
                        }}
                        selectionModel={selectionModel}
                        initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                        pageSizeOptions={[5, 10, 20]}
                        pagination
                        autoHeight
                        disableRowSelectionOnClick
                        sx={{ '& .Mui-disabled': { opacity: 0.5 }, '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f6f8', fontWeight: 'bold' } }}
                    />
                </Paper>
            </Box>
            <Footer />
            {panelOpen && (
                <RendezVousModal open={panelOpen} onClose={() => setPanelOpen(false)} onSave={onSave} eventData={formData} intervenant={intervenantModal} setEventData={setFormData} />
            )}
        </>
    );
};

export default ListeRendezVous;
