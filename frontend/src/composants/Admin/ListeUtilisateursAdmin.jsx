// import React, { useEffect, useState } from "react";
// import Header from "../Header/Header";
// import Footer from "../Footer/Footer";
// import {
//     Box,
//     Typography,
//     Select,
//     MenuItem,
//     InputLabel,
//     FormControl,
//     Paper
// } from "@mui/material";
// import { Button } from "@mui/material";
// import BlockIcon from '@mui/icons-material/Block';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import { DataGrid } from "@mui/x-data-grid";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faList } from '@fortawesome/free-solid-svg-icons';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//     fetchUtilisateursParRole,
//     activerCompteThunk,
//     desactiverCompteThunk,
//     clearUtilisateurState,
// } from "../../features/UtilisateurSlice";
// import { checkSignales } from "../../features/SignalementSlice";
// import Swal from 'sweetalert2';

// const ListeUtilisateursAdmin = () => {
//     const [filtreRole, setFiltreRole] = useState("TOUS");
//     const dispatch = useDispatch();
//     const { isLoggedIn } = useSelector((state) => state.auth);
//     const { utilisateursParRole, loading: loadingUtilisateurs } = useSelector(state => state.utilisateur);
//     const { signalementsParUtilisateur } = useSelector((state) => state.signalement);
//     const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

//     useEffect(() => {
//         dispatch(fetchUtilisateursParRole("TOUS"));
//         dispatch(checkSignales());
//     }, [dispatch]);

//     const utilisateursAvecSignalements = utilisateursParRole.map((user) => {
//         const match = signalementsParUtilisateur?.find(s => s.utilisateurId === user.id);
//         return {
//             ...user,
//             nbSignalements: match?.nbSignalements || 0
//         };
//     });

//     const handleActiver = async (id) => {
//         const action = await dispatch(activerCompteThunk(id));
//         dispatch(fetchUtilisateursParRole("TOUS"));
//         if (activerCompteThunk.fulfilled.match(action)) {
//             Swal.fire({ icon: 'success', title: 'Compte activé', text: 'Le compte a été activé avec succès.' });
//         } else {
//             Swal.fire({ icon: 'error', title: 'Erreur', text: action.payload || 'Echec de l’activation.' });
//         }
//         dispatch(clearUtilisateurState());
//     };

//     const handleDesactiver = (row) => {
//         Swal.fire({
//             title: 'Raison de désactivation',
//             input: 'textarea',
//             inputLabel: 'Veuillez indiquer la raison',
//             showCancelButton: true,
//             confirmButtonText: 'Désactiver',
//             preConfirm: (raison) => {
//                 if (!raison) Swal.showValidationMessage('La raison est requise');
//                 return raison;
//             }
//         }).then(async (result) => {
//             if (result.isConfirmed && result.value) {
//                 const action = await dispatch(desactiverCompteThunk({ id: row.id, raison: result.value }));
//                 dispatch(fetchUtilisateursParRole("TOUS"));
//                 if (desactiverCompteThunk.fulfilled.match(action)) {
//                     Swal.fire('Désactivé', 'Le compte a été désactivé.', 'success');
//                 } else {
//                     Swal.fire('Erreur', action.payload || 'Erreur de désactivation.', 'error');
//                 }
//                 dispatch(clearUtilisateurState());
//             }
//         });
//     };

//     const getColonnesParRole = (role) => {
//         const base = [
//             { field: 'id', headerName: 'ID', width: 80 },
//             { field: 'nom', headerName: 'Nom', flex: 1 },
//             { field: 'prenom', headerName: 'Prénom', flex: 1 },
//             {
//                 field: 'email',
//                 headerName: 'Email',
//                 flex: 1,
//                 renderCell: ({ row }) => row.email || row.numTel || "Non défini"
//             },
//             {
//                 field: 'nbSignalements',
//                 headerName: 'Signalements',
//                 width: 130,
//                 cellClassName: (params) =>
//                     params.value >= 10 ? 'cell-red' : ''
//             }
//         ];

//         const actionColumn = {
//             field: 'action',
//             headerName: 'Action',
//             flex: 1,
//             renderCell: ({ row }) => {
//                 const styleBtn = {
//                     borderRadius: 2, fontWeight: 600, fontSize: '0.9rem', padding: '6px 12px', minWidth: 110
//                 };
//                 return row.isActive ? (
//                     <Button variant="contained" color="warning" onClick={() => handleDesactiver(row)} startIcon={<BlockIcon />} sx={styleBtn}>Désactiver</Button>
//                 ) : (
//                     <Button variant="contained" color="success" onClick={() => handleActiver(row.id)} startIcon={<CheckCircleOutlineIcon />} sx={styleBtn}>Activer</Button>
//                 );
//             }
//         };

//         if (role === "CLIENT") {
//             return [...base,
//             { field: 'ville', headerName: 'Ville', flex: 1 },
//             { field: 'adresse', headerName: 'Adresse', flex: 1 },
//             { field: 'numTel', headerName: 'Téléphone', flex: 1 },
//                 actionColumn];
//         }

//         if (role === "PRESTATAIRE") {
//             return [...base,
//             { field: 'specialite', headerName: 'Spécialité', flex: 1 },
//             { field: 'service', headerName: 'Service', flex: 1 },
//             { field: 'ville', headerName: 'Ville', flex: 1 },
//             { field: 'adresse', headerName: 'Adresse', flex: 1 },
//             { field: 'numTel', headerName: 'Téléphone', flex: 1 },
//                 actionColumn];
//         }

//         if (role === "ENTREPRISE") {
//             return [...base,
//             { field: 'specialite', headerName: 'Spécialité', flex: 1 },
//             { field: 'nomEntreprise', headerName: 'Entreprise', flex: 1 },
//             { field: 'siteWeb', headerName: 'Site Web', flex: 1 },
//             { field: 'identifiant', headerName: 'Identifiant', flex: 1 },
//             { field: 'service', headerName: 'Service', flex: 1 },
//             { field: 'ville', headerName: 'Ville', flex: 1 },
//             { field: 'adresse', headerName: 'Adresse', flex: 1 },
//             { field: 'numTel', headerName: 'Téléphone', flex: 1 },
//                 actionColumn];
//         }

//         return [...base, { field: 'role', headerName: 'Rôle', flex: 1 }, actionColumn];
//     };

//     const rowsFiltres = utilisateursAvecSignalements.filter(u =>
//         filtreRole === "TOUS" ? true : u.role === filtreRole
//     );

//     return (
//         <>
//             <Header isClientConnected={isLoggedIn} />
//             <Box className="container mt-4" sx={{ minHeight: 500, width: '95%', maxWidth: '100vw' }}>
//                 <Box mb={3} display="flex" alignItems="center">
//                     <FontAwesomeIcon icon={faList} style={{ fontSize: 35, color: '#ff6b00', marginRight: 10 }} />
//                     <Box>
//                         <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a3a6c' }}>
//                             Liste des Utilisateurs
//                         </Typography>
//                         <Box sx={{ height: 4, width: '80px', backgroundColor: '#ff6b00', borderRadius: 2, mt: 1 }} />
//                     </Box>
//                 </Box>
//                 <FormControl fullWidth sx={{ mb: 2 }}>
//                     <InputLabel id="filtre-role-label">Filtrer par rôle</InputLabel>
//                     <Select
//                         labelId="filtre-role-label"
//                         id="filtreRole"
//                         value={filtreRole}
//                         label="Filtrer par rôle"
//                         onChange={(e) => setFiltreRole(e.target.value)}
//                     >
//                         <MenuItem value="TOUS">Tous</MenuItem>
//                         <MenuItem value="CLIENT">Client</MenuItem>
//                         <MenuItem value="PRESTATAIRE">Prestataire</MenuItem>
//                         <MenuItem value="ENTREPRISE">Entreprise</MenuItem>
//                     </Select>
//                 </FormControl>
//                 <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
//                     {loadingUtilisateurs ? (
//                         <p>Chargement...</p>
//                     ) : (
//                         <DataGrid
//                             rows={rowsFiltres}
//                             columns={getColonnesParRole(filtreRole)}
//                             paginationModel={paginationModel}
//                             onPaginationModelChange={setPaginationModel}
//                             rowsPerPageOptions={[10, 20, 50]}
//                             pagination
//                             disableRowSelectionOnClick
//                             getRowClassName={(params) =>
//                                 params.row.nbSignalements >= 10 ? 'ligne-rouge' :
//                                     (!params.row.isActive ? 'ligne-desactive' : '')
//                             }
//                             sx={{ border: 'none' }}
//                         />
//                     )}
//                 </Paper>
//             </Box>
//             <style>{`
//                 .ligne-desactive {
//                     opacity: 0.5;
//                     pointer-events: none;
//                 }
//                 .ligne-rouge {
//                     background-color: rgba(255, 0, 0, 0.1);
//                 }
//                 .cell-red {
//                     color: red;
//                     font-weight: bold;
//                 }
//             `}</style>
//             <Footer />
//         </>
//     );
// };

// export default ListeUtilisateursAdmin;
import React, { useEffect, useState, useMemo } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {
    Box,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Paper,
    Button,
    Chip,
    useTheme
} from "@mui/material";
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faUser, faEnvelope, faPhone, faMapMarkerAlt, faBuilding, faGlobe, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchUtilisateursParRole,
    activerCompteThunk,
    desactiverCompteThunk,
    clearUtilisateurState,
} from "../../features/UtilisateurSlice";
import { checkSignales } from "../../features/SignalementSlice";
import Swal from 'sweetalert2';
import { MaterialReactTable } from 'material-react-table';

const ListeUtilisateursAdmin = () => {
    const [filtreRole, setFiltreRole] = useState("TOUS");
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { utilisateursParRole, loading: loadingUtilisateurs } = useSelector(state => state.utilisateur);
    const { signalementsParUtilisateur } = useSelector((state) => state.signalement);
    const theme = useTheme();

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

        Swal.fire({
            title: 'Activation en cours...',
            text: 'Veuillez patienter pendant que le compte est activé.',
            didOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            background: '#f5f5f5',
            customClass: {
                popup: 'swal-popup-custom',
                title: 'swal-title-custom',
                content: 'swal-content-custom',
            },
        });

        try {
            const action = await dispatch(activerCompteThunk(id)).unwrap();

            dispatch(fetchUtilisateursParRole("TOUS"));

            Swal.close();

            Swal.fire({
                icon: 'success',
                title: 'Activation réussie',
                text: `Le compte de l'utilisateur a été activé avec succès.`,
                confirmButtonText: 'OK',
                background: '#f5f5f5',
                customClass: {
                    popup: 'swal-popup-custom',
                    confirmButton: 'swal-confirm-button'
                },
            });
        } catch (error) {
            Swal.close();

            Swal.fire({
                icon: 'error',
                title: 'Erreur d’activation',
                text: error?.message || "Impossible d'activer le compte. Veuillez réessayer.",
                confirmButtonText: 'OK',
                background: '#f5f5f5',
                customClass: {
                    popup: 'swal-popup-custom',
                    confirmButton: 'swal-confirm-button'
                },
            });
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
                Swal.fire({
                    title: 'Désactivation en cours...',
                    text: 'Veuillez patienter pendant que le compte est désactivé.',
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    background: '#f5f5f5',
                    customClass: {
                        popup: 'swal-popup-custom',
                        title: 'swal-title-custom',
                        content: 'swal-content-custom',
                    },
                });
                const action = await dispatch(desactiverCompteThunk({ id: row.original.id, raison: result.value }));
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

    // Configuration des colonnes pour MaterialReactTable

    const getColumns = (role) => {
        const baseColumns = [
            {
                accessorKey: 'id',
                header: 'ID',
                size: 70,
                Cell: ({ cell }) => (
                    <Box sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1a3a6c' }}>
                        #{cell.getValue()}
                    </Box>
                ),
            },
            {
                accessorKey: 'nom',
                header: 'Nom',
                size: 200,
                Cell: ({ cell }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faUser} style={{ marginRight: 8, color: '#6c757d' }} />
                        <span>{cell.getValue()}</span>
                    </Box>
                ),
            },
            {
                accessorKey: 'prenom',
                header: 'Prénom',
                size: 200,
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 200,
                Cell: ({ cell, row }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8, color: '#6c757d' }} />
                        <span>{row.original.email || "Non défini"}</span>
                    </Box>
                ),
            },
            {
                accessorKey: 'nbSignalements',
                header: 'Signalements',
                size: 200,
                Cell: ({ cell }) => (
                    <Chip
                        label={cell.getValue()}
                        color={cell.getValue() >= 10 ? "error" : "default"}
                        variant={cell.getValue() >= 10 ? "filled" : "outlined"}
                        size="small"
                    />
                ),
            }
        ];

        const actionColumn = {
            id: 'actions',
            header: 'Actions',
            size: 150,
            position: 'last',
            Cell: ({ row }) => {

                if (row.original.role === "CLIENT") {
                    return row.original.isActive ? (
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={() => handleDesactiver(row)}
                            startIcon={<BlockIcon />}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                py: 0.5,
                                px: 1.5,
                                minWidth: 'auto',
                                size: "small"

                            }}
                        >
                            Désactiver
                        </Button>
                    ) : (
                        // Pour les clients désactivés, on n'affiche aucun bouton
                        <Chip
                            label="Compte désactivé"
                            color="default"
                            variant="outlined"
                            size="small"
                        />
                    );
                }


                return row.original.isActive ? (
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleDesactiver(row)}
                        startIcon={<BlockIcon />}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            py: 0.5,
                            px: 1.5,
                            minWidth: 'auto',
                            size: "small"
                        }}
                    >
                        Désactiver
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleActiver(row.original.id)}
                        startIcon={<CheckCircleOutlineIcon />}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            py: 0.5,
                            px: 1.5,
                            minWidth: 'auto'
                        }}
                    >
                        Activer
                    </Button>
                );
            }
        };


        let roleSpecificColumns = [];

        if (role === "CLIENT") {
            roleSpecificColumns = [
                {
                    accessorKey: 'ville',
                    header: 'Ville',
                    size: 200,
                    Cell: ({ cell }) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: 8, color: '#6c757d' }} />
                            <span>{cell.getValue()}</span>
                        </Box>
                    ),
                },
                {
                    accessorKey: 'adresse',
                    header: 'Adresse',
                    size: 200,
                },
                {
                    accessorKey: 'numTel',
                    header: 'Téléphone',
                    size: 200,
                    Cell: ({ cell }) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faPhone} style={{ marginRight: 8, color: '#6c757d' }} />
                            <span>{cell.getValue()}</span>
                        </Box>
                    ),
                }
            ];
        } else if (role === "PRESTATAIRE") {
            roleSpecificColumns = [
                {
                    accessorKey: 'specialite',
                    header: 'Spécialité',
                    size: 200,
                },
                {
                    accessorKey: 'service',
                    header: 'Service',
                    size: 200,
                },
                {
                    accessorKey: 'ville',
                    header: 'Ville',
                    size: 200,
                    Cell: ({ cell }) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: 8, color: '#6c757d' }} />
                            <span>{cell.getValue()}</span>
                        </Box>
                    ),
                },
                {
                    accessorKey: 'adresse',
                    header: 'Adresse',
                    size: 200,
                },
                {
                    accessorKey: 'numTel',
                    header: 'Téléphone',
                    size: 200,
                    Cell: ({ cell }) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faPhone} style={{ marginRight: 8, color: '#6c757d' }} />
                            <span>{cell.getValue()}</span>
                        </Box>
                    ),
                }
            ];
        } else if (role === "ENTREPRISE") {
            roleSpecificColumns = [
                {
                    accessorKey: 'specialite',
                    header: 'Spécialité',
                    size: 200,
                },
                {
                    accessorKey: 'nomEntreprise',
                    header: 'Entreprise',
                    size: 200,
                    Cell: ({ cell }) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faBuilding} style={{ marginRight: 8, color: '#6c757d' }} />
                            <span>{cell.getValue()}</span>
                        </Box>
                    ),
                },
                {
                    accessorKey: 'siteWeb',
                    header: 'Site Web',
                    size: 200,
                    Cell: ({ cell }) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faGlobe} style={{ marginRight: 8, color: '#6c757d' }} />
                            <span>{cell.getValue()}</span>
                        </Box>
                    ),
                },
                {
                    accessorKey: 'identifiant',
                    header: 'Identifiant',
                    size: 200,
                    Cell: ({ cell }) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faIdCard} style={{ marginRight: 8, color: '#6c757d' }} />
                            <span>{cell.getValue()}</span>
                        </Box>
                    ),
                },
                {
                    accessorKey: 'service',
                    header: 'Service',
                    size: 200,
                },
                {
                    accessorKey: 'ville',
                    header: 'Ville',
                    size: 200,
                    Cell: ({ cell }) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: 8, color: '#6c757d' }} />
                            <span>{cell.getValue()}</span>
                        </Box>
                    ),
                },
                {
                    accessorKey: 'adresse',
                    header: 'Adresse',
                    size: 200,
                },
                {
                    accessorKey: 'numTel',
                    header: 'Téléphone',
                    size: 200,
                    Cell: ({ cell }) => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faPhone} style={{ marginRight: 8, color: '#6c757d' }} />
                            <span>{cell.getValue()}</span>
                        </Box>
                    ),
                }
            ];
        }
        else {

            roleSpecificColumns = [
                {
                    accessorKey: 'role',
                    header: 'Rôle',
                    size: 120,
                    Cell: ({ cell }) => (
                        <Chip
                            label={cell.getValue()}
                            color={
                                cell.getValue() === "CLIENT" ? "primary" :
                                    cell.getValue() === "PRESTATAIRE" ? "secondary" :
                                        cell.getValue() === "ENTREPRISE" ? "info" : "default"
                            }
                            variant="outlined"
                            size="small"
                        />
                    ),
                }
            ];
        }

        // Retourner toujours les colonnes de base + colonnes spécifiques + colonne d'action
        return [...baseColumns, ...roleSpecificColumns, actionColumn];
    };
    const rowsFiltres = utilisateursAvecSignalements.filter(u =>
        filtreRole === "TOUS" ? true : u.role === filtreRole
    );

    const columns = useMemo(() => getColumns(filtreRole), [filtreRole]);

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <Box sx={{
                minHeight: '80vh',
                width: "100%",
                maxWidth: "100vw",
                p: 3,
                backgroundColor: '#f9fafb'
            }}>
                <Box mb={4} display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 50,
                            height: 50,
                            borderRadius: 2,
                            backgroundColor: '#ff6b00',
                            mr: 2
                        }}>
                            <FontAwesomeIcon
                                icon={faList}
                                style={{ fontSize: 24, color: "white" }}
                            />
                        </Box>
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: "bold",
                                    color: "#1a3a6c",
                                    mb: 0.5
                                }}
                            >
                                Liste des Utilisateurs
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Gestion des utilisateurs par rôle
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mb: 3, width: 500 }}>
                    <FormControl fullWidth>
                        <InputLabel id="filtre-role-label">Filtrer par rôle</InputLabel>
                        <Select
                            labelId="filtre-role-label"
                            value={filtreRole}
                            label="Filtrer par rôle"
                            onChange={(e) => setFiltreRole(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="TOUS">Tous les utilisateurs</MenuItem>
                            <MenuItem value="CLIENT">Clients</MenuItem>
                            <MenuItem value="PRESTATAIRE">Prestataires</MenuItem>
                            <MenuItem value="ENTREPRISE">Entreprises</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }}
                >
                    {loadingUtilisateurs ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                            <Typography variant="body1">
                                Chargement des utilisateurs...
                            </Typography>
                        </Box>
                    ) : rowsFiltres.length === 0 ? (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 300,
                            color: 'text.secondary'
                        }}>
                            <FontAwesomeIcon icon={faUser} style={{ fontSize: 48, marginBottom: 16 }} />
                            <Typography variant="h6" gutterBottom>
                                Aucun utilisateur trouvé
                            </Typography>
                            <Typography variant="body2">
                                {filtreRole === "TOUS"
                                    ? "Aucun utilisateur dans le système"
                                    : `Aucun utilisateur avec le rôle ${filtreRole.toLowerCase()}`
                                }
                            </Typography>
                        </Box>
                    ) : (
                        <MaterialReactTable
                            columns={columns}
                            data={rowsFiltres}
                            enableColumnResizing
                            enableColumnFilters={false}
                            enablePagination
                            enableSorting
                            enableColumnOrdering={false}
                            enableStickyHeader
                            enableFullScreenToggle={false}
                            enableDensityToggle={false}
                            enableHiding={true}
                            layoutMode="table"
                            initialState={{
                                pagination: { pageSize: 10, pageIndex: 0 },
                                density: 'comfortable',
                            }}
                            muiTableContainerProps={{
                                sx: {
                                    maxHeight: '65vh',
                                    width: '100%',
                                    '&::-webkit-scrollbar': {
                                        width: 8,
                                        height: 8,
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: '#c1c1c1',
                                        borderRadius: 4,
                                    },
                                },
                            }}
                            muiTablePaperProps={{
                                sx: {
                                    width: '100%',
                                    boxShadow: 'none',
                                },
                            }}
                            muiTableHeadCellProps={{
                                sx: {
                                    fontWeight: 'bold',
                                    backgroundColor: '#f5f5f5',
                                    color: '#333',
                                    fontSize: '0.9rem',
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
                            muiTableBodyRowProps={({ row }) => ({
                                sx: {
                                    '&:hover': {
                                        backgroundColor: 'grey.50',
                                    },
                                    opacity: row.original.isActive ? 1 : 0.6,
                                    backgroundColor: row.original.nbSignalements >= 10 ?
                                        'rgba(255, 0, 0, 0.05)' : 'inherit',
                                },
                            })}
                            muiBottomToolbarProps={{
                                sx: {
                                    backgroundColor: 'grey.100',
                                    borderTop: '1px solid',
                                    borderColor: 'grey.300',
                                },
                            }}
                            localization={{
                                noRecordsToDisplay: 'Aucun utilisateur à afficher',
                                of: 'sur',
                                rowsPerPage: 'Lignes par page',
                            }}
                        />
                    )}
                </Paper>
            </Box>
            <Footer />
        </>
    );
};

export default ListeUtilisateursAdmin;