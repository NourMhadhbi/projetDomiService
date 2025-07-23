
import React, { useEffect, useState, useMemo } from 'react';
import {
    Box, Paper, IconButton, Tooltip, Typography, Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


import { useSelector, useDispatch } from 'react-redux';
import {
    fetchByClient,
    deleteRendezVous,
    updateRendezVous
} from '../../features/RendezVousSlice';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import RendezVousModal from './RendezVousModal';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
const STATUTS = {
    EN_ATTENTE: { label: 'En attente', color: '#bc8f05' },
    CONFIRME: { label: 'Confirmé', color: '#127547' },
    ANNULE: { label: 'Annulé  ', color: '#a90616' },
    TERMINE: { label: 'Terminé', color: '#949091' },
};

const ListeRendezVous = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { listeRendezVous } = useSelector((state) => state.rendezVous);
    const [intervenantModal, setIntervenantModal] = useState(null);
    const [panelOpen, setPanelOpen] = useState(false);

    const [formData, setFormData] = useState({
        id: '',
        date: '',
        heure: '',
        lieuDintervention: '',
        raison: '',
        clientId: user?.utilisateurIdCl,
        prestataireId: null,
    });

    useEffect(() => {
        if (isLoggedIn && user?.utilisateurIdCl) {
            dispatch(fetchByClient(user.utilisateurIdCl));
        }
    }, [isLoggedIn, user, dispatch]);

    const onSave = async () => {
        const dateTime = `${formData.date}T${formData.heure}:00`;
        const payload = { ...formData, date: dateTime };

        try {
            await dispatch(updateRendezVous(payload)).unwrap();
            Swal.fire({
                title: 'Modification réussie !',
                text: 'Le rendez-vous a été modifié avec succès.',
                icon: 'success',
                confirmButtonColor: '#198754'
            });
            setPanelOpen(false);
        } catch (err) {
            Swal.fire({
                title: 'Erreur',
                text: err.message || 'Une erreur est survenue.',
                icon: 'error'
            });
        }
    };

    const onDelete = async (rdv) => {
        const { isConfirmed } = await Swal.fire({
            icon: 'warning',
            title: 'Confirmer la suppression',
            text: 'Cette action est irréversible.',
            showCancelButton: true,
            confirmButtonText: 'Supprimer',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
        });

        if (!isConfirmed) return;

        try {
            await dispatch(deleteRendezVous({ id: rdv.id })).unwrap();
            Swal.fire({
                icon: 'success',
                title: 'Rendez-vous supprimé',
                text: 'Suppression effectuée avec succès.',
                confirmButtonColor: '#198754'
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: err.message || 'Impossible de supprimer ce rendez-vous.',
            });
        }
    };

    const rows = useMemo(() =>
        listeRendezVous?.map((rdv) => ({
            id: rdv.id,
            raison: rdv.raison,
            date: new Date(rdv.date).toLocaleString(),
            lieu: rdv.lieuDintervention,
            prestataire: rdv.prestataire?.entreprise
                ? rdv.prestataire.entreprise.nomEntreprise
                : `${rdv.prestataire.utilisateur.prenom} ${rdv.prestataire.utilisateur.nom}` ?? '',
            statut: rdv.statut,
            rdv,
        })) || [], [listeRendezVous]);

    const columns = [
        { field: 'raison', headerName: 'Raison', flex: 1 },
        { field: 'date', headerName: 'Date', flex: 1.2 },
        { field: 'lieu', headerName: 'Lieu', flex: 1 },
        { field: 'prestataire', headerName: 'Prestataire', flex: 1 },
        {
            field: 'statut',
            headerName: 'Statut',
            align: 'center',
            flex: 1,

            renderCell: ({ value }) => (
                <Chip label={STATUTS[value]?.label || value} style={{
                    backgroundColor: STATUTS[value]?.color,
                    color: '#fff',
                    width: 100,
                    textAlign: 'center',
                }} />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            filterable: false,
            align: 'right',
            headerAlign: 'right',
            renderCell: ({ row }) => {
                const { rdv } = row;
                const isEditable = rdv.statut === 'EN_ATTENTE';

                let datePart = '';
                let timePart = '';

                if (typeof rdv.date === 'string' && rdv.date.includes('T')) {
                    [datePart, timePart] = rdv.date.split('T');
                } else {
                    const iso = new Date(rdv.date).toISOString();
                    [datePart, timePart] = iso.split('T');
                }

                return (
                    <>
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
                                            prestataireId: rdv.prestataireId || null,
                                        });
                                        setIntervenantModal(rdv.prestataire || null);
                                        setPanelOpen(true);
                                    }}
                                    color="primary"
                                    disabled={!isEditable}
                                >
                                    <EditIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                            <span>
                                <IconButton
                                    onClick={() => isEditable && onDelete(rdv)}
                                    color="error"
                                    disabled={!isEditable}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </>
                );
            },
            width: 250,
        },
    ];

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <Box className="container mt-4" sx={{ minHeight: 500,  width: '95%',  maxWidth: '100vw', }}>
                <Box mb={3}>
                    <Box display="flex" alignItems="center">
                        <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: 35, color: '#ff6b00', marginRight: 10 }} />
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a3a6c' }}>
                                Mes rendez-vous
                            </Typography>
                            <Box
                                sx={{
                                    height: 4,
                                    width: '80px',
                                    backgroundColor: '#ff6b00',
                                    borderRadius: 2,
                                    mt: 1
                                }}
                            />
                        </Box>
                    </Box>
                </Box>



                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5, page: 0 },
                            },
                        }}
                        pageSizeOptions={[5, 10, 20]}
                        pagination
                        autoHeight
                        disableRowSelectionOnClick
                        sx={{
                            '& .Mui-disabled': {
                                opacity: 0.5,
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#f4f6f8',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                </Paper>
            </Box>
            <Footer />
            {panelOpen && (
                <RendezVousModal
                    open={panelOpen}
                    onClose={() => setPanelOpen(false)}
                    onSave={onSave}
                    eventData={formData}
                    intervenant={intervenantModal}
                    setEventData={setFormData}
                />
            )}
        </>
    );
};

export default ListeRendezVous;
