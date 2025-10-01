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
    useTheme, Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton
} from "@mui/material";
import BlockIcon from '@mui/icons-material/Block';
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faUser, faEnvelope, faPhone, faMapMarkerAlt, faBuilding, faGlobe, faIdCard, faMoneyBill, faStar, faCertificate, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
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
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
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
    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };
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
                accessorKey: 'image',
                header: 'Image',
                size: 100,
                Cell: ({ cell, row }) => (
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        sx={{ p: 1 }}
                    >
                        {cell.getValue() ? (
                            <Avatar
                                src={cell.row.original.image}
                                alt={cell.row.original.nom}
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 2,
                                    boxShadow: theme.shadows[2]
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    bgcolor: "grey.100",
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Typography variant="caption" color="textSecondary">
                                    Aucune image
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )
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
            },
            {
                id: 'details',
                header: 'Plus de détails',
                size: 150,
                Cell: ({ row }) => (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenDialog(row.original)}
                        startIcon={<InfoIcon />}
                        size="small"
                    >
                        Détails
                    </Button>
                ),
            }
        ];

        const actionColumn = {
            id: 'actions',
            header: 'Actions',
            size: 150,
            position: 'last',
            Cell: ({ row }) => {
                return row.original.isActive ? (
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleDesactiver(row)}
                        startIcon={<BlockIcon />}
                        sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: '0.8rem',
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

        if (role === "TOUS") {
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
                                    opacity: 1,
                                    backgroundColor: row.original.nbSignalements >= 10 ?
                                        'rgba(255, 0, 0, 0.05)' : 'inherit',
                                }
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
                {/* Dialog pour afficher les détails de l'utilisateur */}
                {/* Dialog pour afficher les détails de l'utilisateur */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            boxShadow: theme.shadows[10],
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            m: 0,
                            p: 2,
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h6">Détails de l'utilisateur</Typography>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseDialog}
                            sx={{
                                color: 'white',
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent
                        sx={{
                            p: 3,

                            maxHeight: '70vh',
                            overflowY: 'auto',
                        }}
                    >
                        {selectedUser && (
                            <Grid container spacing={3} >
                                {/* Partie gauche - Informations personnelles */}
                                <Grid item xs={12} md={6}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        mb: 3,
                                        p: 2,
                                        borderRight: { md: '1px solid', xs: 'none' },
                                        borderColor: 'divider',
                                        height: '100%'
                                    }}>
                                        <Avatar
                                            src={selectedUser.image}
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                mb: 2,
                                                boxShadow: theme.shadows[4]
                                            }}
                                        />
                                        <Chip
                                            label={selectedUser.role}
                                            color={
                                                selectedUser.role === "CLIENT" ? "primary" :
                                                    selectedUser.role === "PRESTATAIRE" ? "secondary" : "info"
                                            }
                                            sx={{ mb: 2 }}
                                        />
                                        <Chip
                                            label={selectedUser.isActive ? "Compte actif" : "Compte désactivé"}
                                            color={selectedUser.isActive ? "success" : "error"}
                                            variant="outlined"
                                            sx={{ mb: 3 }}
                                        />



                                        <Divider sx={{ my: 2, width: '100%' }} />

                                        {/* Section signalements */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <Chip
                                                label={`${selectedUser.nbSignalements} signalement(s)`}
                                                color={selectedUser.nbSignalements >= 10 ? "error" : "default"}
                                                variant={selectedUser.nbSignalements >= 10 ? "filled" : "outlined"}
                                                sx={{ mr: 1 }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedUser.nbSignalements >= 10 ?
                                                    "Ce compte a un nombre élevé de signalements" :
                                                    "Nombre de signalements reçus"
                                                }
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Partie droite - Informations professionnelles */}
                                <Grid item xs={12} md={6} sx={{ height: "100%" }}>
                                    {selectedUser.role === "CLIENT" && (
                                        <>
                                            <Typography variant="h6" gutterBottom sx={{
                                                color: theme.palette.primary.main,
                                                alignSelf: 'flex-start',
                                                mt: 2
                                            }}>
                                                Informations personnelles
                                            </Typography>

                                            <Box sx={{ width: '150%' }}>
                                                <Grid container spacing={2}>

                                                    <Grid item xs={12} sm={4}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <FontAwesomeIcon icon={faUser} style={{ marginRight: 8, color: '#6c757d', minWidth: 20 }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">Nom complet</Typography>
                                                                <Typography variant="body1">{selectedUser.prenom} {selectedUser.nom}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>

                                                </Grid>
                                                <Grid container spacing={2} sx={{ mt: 3 }}>
                                                    <Grid item xs={12} sm={4}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8, color: '#6c757d', minWidth: 20 }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">Email</Typography>
                                                                <Typography variant="body1">{selectedUser.email}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                                <Grid container spacing={2} sx={{ mt: 3 }}>
                                                    <Grid item xs={12} sm={4}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <FontAwesomeIcon icon={faPhone} style={{ marginRight: 8, color: '#6c757d', minWidth: 20 }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">Téléphone</Typography>
                                                                <Typography variant="body1">{selectedUser.numTel || "Non renseigné"}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                                <Grid container spacing={2} sx={{ mt: 3 }}>

                                                    <Grid item xs={12} sm={6}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: 8, color: '#6c757d', minWidth: 20, marginTop: 4 }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">Ville</Typography>
                                                                <Typography variant="body1">{selectedUser.ville || "Non renseignée"}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                                <Grid container spacing={2} sx={{ mt: 3 }}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: 8, color: '#6c757d', minWidth: 20, marginTop: 4 }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">Adresse</Typography>
                                                                <Typography variant="body1">{selectedUser.adresse || "Non renseignée"}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                </Grid>

                                            </Box>

                                        </>
                                    )}

                                    <Box sx={{ p: 2, height: '100%', width: '100%' }}>
                                        {/* Informations spécifiques au rôle */}
                                        {(selectedUser.role === "PRESTATAIRE" || selectedUser.role === "ENTREPRISE") && (
                                            <>
                                                <Typography variant="h6" gutterBottom sx={{
                                                    color: theme.palette.primary.main,
                                                    alignSelf: 'flex-start',
                                                    mt: 2
                                                }}>
                                                    Informations personnelles
                                                </Typography>

                                                <Box sx={{ width: '150%' }}>
                                                    <Grid container spacing={2}>

                                                        <Grid item xs={12} sm={4}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <FontAwesomeIcon icon={faUser} style={{ marginRight: 8, color: '#6c757d', minWidth: 20 }} />
                                                                <Box>
                                                                    <Typography variant="body2" color="text.secondary">Nom complet</Typography>
                                                                    <Typography variant="body1">{selectedUser.prenom} {selectedUser.nom}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>


                                                        <Grid item xs={12} sm={4}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8, color: '#6c757d', minWidth: 20 }} />
                                                                <Box>
                                                                    <Typography variant="body2" color="text.secondary">Email</Typography>
                                                                    <Typography variant="body1">{selectedUser.email}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>


                                                        <Grid item xs={12} sm={4}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <FontAwesomeIcon icon={faPhone} style={{ marginRight: 8, color: '#6c757d', minWidth: 20 }} />
                                                                <Box>
                                                                    <Typography variant="body2" color="text.secondary">Téléphone</Typography>
                                                                    <Typography variant="body1">{selectedUser.numTel || "Non renseigné"}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container spacing={2} sx={{ mt: 3 }}>

                                                        <Grid item xs={12} sm={6}>
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: 8, color: '#6c757d', minWidth: 20, marginTop: 4 }} />
                                                                <Box>
                                                                    <Typography variant="body2" color="text.secondary">Ville</Typography>
                                                                    <Typography variant="body1">{selectedUser.ville || "Non renseignée"}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>


                                                        <Grid item xs={12} sm={6}>
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: 8, color: '#6c757d', minWidth: 20, marginTop: 4 }} />
                                                                <Box>
                                                                    <Typography variant="body2" color="text.secondary">Adresse</Typography>
                                                                    <Typography variant="body1">{selectedUser.adresse || "Non renseignée"}</Typography>
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>

                                                </Box>
                                                <Box sx={{ p: 2, height: '100%' }}></Box>
                                                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                                                    Informations professionnelles
                                                </Typography>
                                                <Grid container spacing={3}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 4 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <FontAwesomeIcon icon={faCertificate} style={{ marginRight: 8, color: '#6c757d', minWidth: 20 }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">Spécialité</Typography>
                                                                <Typography variant="body1">{selectedUser.specialite || "Non renseignée"}</Typography>
                                                            </Box>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <FontAwesomeIcon icon={faList} style={{ marginRight: 8, color: '#6c757d', minWidth: 20 }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">Service</Typography>
                                                                <Typography variant="body1">{selectedUser.service || "Non renseigné"}</Typography>
                                                            </Box>
                                                        </Box>



                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <FontAwesomeIcon icon={faMoneyBill} style={{ marginRight: 12, color: '#6c757d', minWidth: 20 }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Tarif de déplacement
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                    {selectedUser.tarifDeplacement ? `${selectedUser.tarifDeplacement} €` : "Non renseigné"}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 600 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                        <FontAwesomeIcon icon={faStar} style={{ marginRight: 12, color: '#6c757d', minWidth: 20 }} />
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Expérience
                                                            </Typography>
                                                            <Typography variant="body1">
                                                                {selectedUser.experience || "Non renseignée"}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                                        <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 12, color: '#6c757d', minWidth: 20, marginTop: 4 }} />
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Description
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                                                {selectedUser.description || "Non renseignée"}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                                        <FontAwesomeIcon icon={faCertificate} style={{ marginRight: 12, color: '#6c757d', minWidth: 20, marginTop: 4 }} />
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Compétence
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                                                {selectedUser.competence || "Non renseignée"}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </>
                                        )}

                                        {selectedUser.role === "ENTREPRISE" && (
                                            <>
                                                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                                                    Informations de l'entreprise
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 4 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <FontAwesomeIcon icon={faBuilding} style={{ marginRight: 8, color: '#6c757d', minWidth: 20 }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">Nom de l'entreprise</Typography>
                                                                <Typography variant="body1">{selectedUser.nomEntreprise || "Non renseigné"}</Typography>
                                                            </Box>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <FontAwesomeIcon icon={faGlobe} style={{ marginRight: 8, color: '#6c757d', minWidth: 20 }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">Site web</Typography>
                                                                <Typography variant="body1">{selectedUser.siteWeb || "Non renseigné"}</Typography>
                                                            </Box>
                                                        </Box>

                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <FontAwesomeIcon icon={faIdCard} style={{ marginRight: 8, color: '#6c757d', minWidth: 20 }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">Identifiant</Typography>
                                                                <Typography variant="body1">{selectedUser.identifiant || "Non renseigné"}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Grid>


                                            </>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={handleCloseDialog} color="primary" variant="outlined">
                            Fermer
                        </Button>
                        {selectedUser && (
                            selectedUser.isActive ? (
                                <Button
                                    onClick={() => {
                                        handleCloseDialog();
                                        handleDesactiver({ original: selectedUser });
                                    }}
                                    color="warning"
                                    variant="contained"
                                    startIcon={<BlockIcon />}
                                >
                                    Désactiver le compte
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        handleCloseDialog();
                                        handleActiver(selectedUser.id);
                                    }}
                                    color="success"
                                    variant="contained"
                                    startIcon={<CheckCircleOutlineIcon />}
                                >
                                    Activer le compte
                                </Button>
                            )
                        )}
                    </DialogActions>
                </Dialog>

            </Box >
            <Footer />
        </>
    );
};

export default ListeUtilisateursAdmin;