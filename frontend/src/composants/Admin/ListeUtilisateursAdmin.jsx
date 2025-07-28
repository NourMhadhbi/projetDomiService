import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {
    Box,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Paper
} from "@mui/material";
import { Button } from "@mui/material";
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { DataGrid } from "@mui/x-data-grid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchUtilisateursParRole,
    activerCompteThunk,
    desactiverCompteThunk,
    clearUtilisateurState,
} from "../../features/UtilisateurSlice";
import { checkSignales } from "../../features/SignalementSlice";
import Swal from 'sweetalert2';

const ListeUtilisateursAdmin = () => {
    const [filtreRole, setFiltreRole] = useState("TOUS");
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { utilisateursParRole, loading: loadingUtilisateurs } = useSelector(state => state.utilisateur);
    const { signalementsParUtilisateur } = useSelector((state) => state.signalement);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    useEffect(() => {
        dispatch(fetchUtilisateursParRole("TOUS"));
        dispatch(checkSignales());
    }, [dispatch]);

    const utilisateursAvecSignalements = utilisateursParRole.map((user) => {
        const match = signalementsParUtilisateur?.find(s => s.utilisateurId === user.id);
        return {
            ...user,
            nbSignalements: match?.nbSignalements || 0
        };
    });

    const handleActiver = async (id) => {
        const action = await dispatch(activerCompteThunk(id));
        dispatch(fetchUtilisateursParRole("TOUS"));
        if (activerCompteThunk.fulfilled.match(action)) {
            Swal.fire({ icon: 'success', title: 'Compte activé', text: 'Le compte a été activé avec succès.' });
        } else {
            Swal.fire({ icon: 'error', title: 'Erreur', text: action.payload || 'Echec de l’activation.' });
        }
        dispatch(clearUtilisateurState());
    };

    const handleDesactiver = (row) => {
        Swal.fire({
            title: 'Raison de désactivation',
            input: 'textarea',
            inputLabel: 'Veuillez indiquer la raison',
            showCancelButton: true,
            confirmButtonText: 'Désactiver',
            preConfirm: (raison) => {
                if (!raison) Swal.showValidationMessage('La raison est requise');
                return raison;
            }
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                const action = await dispatch(desactiverCompteThunk({ id: row.id, raison: result.value }));
                dispatch(fetchUtilisateursParRole("TOUS"));
                if (desactiverCompteThunk.fulfilled.match(action)) {
                    Swal.fire('Désactivé', 'Le compte a été désactivé.', 'success');
                } else {
                    Swal.fire('Erreur', action.payload || 'Erreur de désactivation.', 'error');
                }
                dispatch(clearUtilisateurState());
            }
        });
    };

    const getColonnesParRole = (role) => {
        const base = [
            { field: 'id', headerName: 'ID', width: 80 },
            { field: 'nom', headerName: 'Nom', flex: 1 },
            { field: 'prenom', headerName: 'Prénom', flex: 1 },
            {
                field: 'email',
                headerName: 'Email',
                flex: 1,
                renderCell: ({ row }) => row.email || row.numTel || "Non défini"
            },
            {
                field: 'nbSignalements',
                headerName: 'Signalements',
                width: 130,
                cellClassName: (params) =>
                    params.value >= 10 ? 'cell-red' : ''
            }
        ];

        const actionColumn = {
            field: 'action',
            headerName: 'Action',
            flex: 1,
            renderCell: ({ row }) => {
                const styleBtn = {
                    borderRadius: 2, fontWeight: 600, fontSize: '0.9rem', padding: '6px 12px', minWidth: 110
                };
                return row.isActive ? (
                    <Button variant="contained" color="warning" onClick={() => handleDesactiver(row)} startIcon={<BlockIcon />} sx={styleBtn}>Désactiver</Button>
                ) : (
                    <Button variant="contained" color="success" onClick={() => handleActiver(row.id)} startIcon={<CheckCircleOutlineIcon />} sx={styleBtn}>Activer</Button>
                );
            }
        };

        if (role === "CLIENT") {
            return [...base,
            { field: 'ville', headerName: 'Ville', flex: 1 },
            { field: 'adresse', headerName: 'Adresse', flex: 1 },
            { field: 'numTel', headerName: 'Téléphone', flex: 1 },
                actionColumn];
        }

        if (role === "PRESTATAIRE") {
            return [...base,
            { field: 'specialite', headerName: 'Spécialité', flex: 1 },
            { field: 'service', headerName: 'Service', flex: 1 },
            { field: 'ville', headerName: 'Ville', flex: 1 },
            { field: 'adresse', headerName: 'Adresse', flex: 1 },
            { field: 'numTel', headerName: 'Téléphone', flex: 1 },
                actionColumn];
        }

        if (role === "ENTREPRISE") {
            return [...base,
            { field: 'specialite', headerName: 'Spécialité', flex: 1 },
            { field: 'nomEntreprise', headerName: 'Entreprise', flex: 1 },
            { field: 'siteWeb', headerName: 'Site Web', flex: 1 },
            { field: 'identifiant', headerName: 'Identifiant', flex: 1 },
            { field: 'service', headerName: 'Service', flex: 1 },
            { field: 'ville', headerName: 'Ville', flex: 1 },
            { field: 'adresse', headerName: 'Adresse', flex: 1 },
            { field: 'numTel', headerName: 'Téléphone', flex: 1 },
                actionColumn];
        }

        return [...base, { field: 'role', headerName: 'Rôle', flex: 1 }, actionColumn];
    };

    const rowsFiltres = utilisateursAvecSignalements.filter(u =>
        filtreRole === "TOUS" ? true : u.role === filtreRole
    );

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <Box className="container mt-4" sx={{ minHeight: 500, width: '95%', maxWidth: '100vw' }}>
                <Box mb={3} display="flex" alignItems="center">
                    <FontAwesomeIcon icon={faList} style={{ fontSize: 35, color: '#ff6b00', marginRight: 10 }} />
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a3a6c' }}>
                            Liste des Utilisateurs
                        </Typography>
                        <Box sx={{ height: 4, width: '80px', backgroundColor: '#ff6b00', borderRadius: 2, mt: 1 }} />
                    </Box>
                </Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="filtre-role-label">Filtrer par rôle</InputLabel>
                    <Select
                        labelId="filtre-role-label"
                        id="filtreRole"
                        value={filtreRole}
                        label="Filtrer par rôle"
                        onChange={(e) => setFiltreRole(e.target.value)}
                    >
                        <MenuItem value="TOUS">Tous</MenuItem>
                        <MenuItem value="CLIENT">Client</MenuItem>
                        <MenuItem value="PRESTATAIRE">Prestataire</MenuItem>
                        <MenuItem value="ENTREPRISE">Entreprise</MenuItem>
                    </Select>
                </FormControl>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    {loadingUtilisateurs ? (
                        <p>Chargement...</p>
                    ) : (
                        <DataGrid
                            rows={rowsFiltres}
                            columns={getColonnesParRole(filtreRole)}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            rowsPerPageOptions={[10, 20, 50]}
                            pagination
                            disableRowSelectionOnClick
                            getRowClassName={(params) =>
                                params.row.nbSignalements >= 10 ? 'ligne-rouge' :
                                    (!params.row.isActive ? 'ligne-desactive' : '')
                            }
                            sx={{ border: 'none' }}
                        />
                    )}
                </Paper>
            </Box>
            <style>{`
                .ligne-desactive {
                    opacity: 0.5;
                    pointer-events: none;
                }
                .ligne-rouge {
                    background-color: rgba(255, 0, 0, 0.1);
                }
                .cell-red {
                    color: red;
                    font-weight: bold;
                }
            `}</style>
            <Footer />
        </>
    );
};

export default ListeUtilisateursAdmin;