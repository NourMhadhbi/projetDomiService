// Le code contient plusieurs incohérences et des erreurs d'état. Voici une version corrigée et refactorisée.

import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Paper, IconButton, Tooltip, Typography, Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import AvisModal from './AvisModal';
import { faCommentDots, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import {
    updateAvis,
    archiverAvis,
    getAvisByClient,
    getAvisByPrestataire
} from '../../features/AvisSlice';

const ListeAvis = () => {
    const [reaction, setReaction] = useState('');
    const dispatch = useDispatch();
    const listeAvis = useSelector((state) => state.avis.listeAvis || []);
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [panelOpen, setPanelOpen] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    const isIntervenant = user?.utilisateur?.role === 'PRESTATAIRE' || user?.utilisateur?.role === 'ENTREPRISE';

    const [intervenantModal, setIntervenantModal] = useState(null);

    const [formData, setFormData] = useState({
        id: '', commentaire: '', note: '', aime: '',
        clientId: user?.utilisateurIdCl || null,
        prestataireId: null
    });

    useEffect(() => {
        if (!isLoggedIn || !user?.utilisateur) return;
        if (user.utilisateur.role === 'CLIENT') dispatch(getAvisByClient(user.utilisateurIdCl));
        if (user.utilisateur.role === 'PRESTATAIRE' || user.utilisateur.role === 'ENTREPRISE') dispatch(getAvisByPrestataire(user.utilisateurIdPre));
    }, [isLoggedIn, user, dispatch]);



    const rows = useMemo(() => listeAvis.map((avis) => {
        const client = avis.client?.utilisateur;
        return {
            id: avis.id,
            commentaire: avis.commentaire,
            date: new Date(avis.date).toLocaleString('fr-FR'),
            note: avis.note,
            prestataire: avis.prestataire?.entreprise?.nomEntreprise || `${avis.prestataire?.utilisateur?.prenom ?? ''} ${avis.prestataire?.utilisateur?.nom ?? ''}`,
            nomClient: `${client?.prenom ?? ''} ${client?.nom ?? ''}`,
            contactClient: client?.email || client?.telephone || '',
            adresseClient: `${avis.client?.ville ?? ''}, ${avis.client?.adresse ?? ''}`,
            aime: avis.aime,
            avis,
        }
    }), [listeAvis]);

    const handleEdit = (avis) => {
        setFormData({
            id: avis.id,
            commentaire: avis.commentaire || '',
            note: avis.note || '',
            aime: avis.aime || '',
            clientId: user?.utilisateurIdCl,
            prestataireId: avis.prestataireId || null,
        });
        setReaction(avis.aime === true ? 'like' : avis.aime === false ? 'dislike' : '');
        setIntervenantModal(avis.prestataire || null);
        setPanelOpen(true);
    };

    const handleDelete = async (avis) => {
        const confirm = await Swal.fire({ icon: 'warning', title: 'Supprimer ?', showCancelButton: true });
        if (confirm.isConfirmed) {
            await dispatch(archiverAvis({ id: avis.id })).unwrap();
            Swal.fire('Supprimé', 'Avis supprimé avec succès', 'success');
            if (isIntervenant) dispatch(getAvisByPrestataire(user.utilisateurIdPre));
            else dispatch(getAvisByClient(user.utilisateurIdCl));
        }
    };

    const handleSave = async () => {
        try {
            await dispatch(updateAvis(formData)).unwrap();
            Swal.fire('Succès', 'Avis mis à jour', 'success');
            setPanelOpen(false);
            if (isIntervenant) dispatch(getAvisByPrestataire(user.utilisateurIdPre));
            else dispatch(getAvisByClient(user.utilisateurIdCl));
        } catch (err) {
            Swal.fire('Erreur', err.message || 'Erreur inconnue', 'error');
        }
    };

    const columns = isIntervenant ? [
        { field: 'nomClient', headerName: 'Client', flex: 1 },
        { field: 'contactClient', headerName: 'Contact', flex: 1.5 },
        { field: 'commentaire', headerName: 'Commentaire', flex: 2 },
        { field: 'note', headerName: 'Note', flex: 0.7, renderCell: ({ value }) => `${value} / 10` },
        {
            field: 'aime',
            headerName: 'Réaction',
            flex: 0.8,
            renderCell: ({ value }) =>
                value === true ? (
                    <FontAwesomeIcon icon={faThumbsUp} style={{ color: '#034813ff', fontSize: '1.5rem' }} />
                ) : value === false ? (
                    <FontAwesomeIcon icon={faThumbsDown} style={{ color: '#790e19ff', fontSize: '1.5rem' }} />
                ) : null
        },
        { field: 'date', headerName: 'Date', flex: 1.5 },
        {
            field: 'adresseClient', headerName: 'Adresse', flex: 1.5, renderCell: ({ value }) => (
                <Link to={`/MapAdresse?adresseA=${encodeURIComponent(value)}`} style={{ color: '#1976d2' }}>{value}</Link>
            )
        }
    ] : [
        { field: 'prestataire', headerName: 'Prestataire/Entreprise', flex: 1.5 },
        { field: 'commentaire', headerName: 'Commentaire', flex: 2 },
        { field: 'note', headerName: 'Note', flex: 0.7, renderCell: ({ value }) => `${value} / 10` },
        {
            field: 'aime',
            headerName: 'Réaction',
            flex: 0.8,
            renderCell: ({ value }) =>
                value === true ? (
                    <FontAwesomeIcon icon={faThumbsUp} style={{ color: '#034813ff', fontSize: '1.5rem' }} />
                ) : value === false ? (
                    <FontAwesomeIcon icon={faThumbsDown} style={{ color: '#790e19ff', fontSize: '1.5rem' }} />
                ) : null
        },
        { field: 'date', headerName: 'Date', flex: 1.5 },

        {
            field: 'actions', headerName: 'Actions', flex: 1.2, sortable: false, renderCell: ({ row }) => (
                <Box display="flex" gap={1}>
                    <Tooltip title="Modifier">
                        <IconButton onClick={() => handleEdit(row.avis)} color="primary"><EditIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <IconButton onClick={() => handleDelete(row.avis)} color="error"><DeleteIcon /></IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <Box className="container mt-4" sx={{ minHeight: 500, width: '95%' }}>
                <Box mb={3} display="flex" alignItems="center">
                    <FontAwesomeIcon icon={faCommentDots} style={{ fontSize: 35, color: '#ff6b00', marginRight: 10 }} />
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a3a6c' }}>Mes Avis</Typography>
                        <Box sx={{ height: 4, width: '80px', backgroundColor: '#ff6b00', borderRadius: 2, mt: 1 }} />
                    </Box>
                </Box>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
                        selectionModel={selectionModel}
                        initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
                        pageSizeOptions={[5, 10, 20]}
                        autoHeight
                        pagination
                        disableRowSelectionOnClick
                        sx={{
                            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f4f6f8', fontWeight: 'bold' },
                            '& .Mui-disabled': { opacity: 0.5 }
                        }}
                    />
                </Paper>
            </Box>
            <Footer />
            <AvisModal
                show={panelOpen}
                onClose={() => setPanelOpen(false)}
                onSubmit={handleSave}
                formData={formData}
                setFormData={setFormData}
                reaction={reaction}
                setReaction={setReaction}
            />
        </>
    );
};

export default ListeAvis;
