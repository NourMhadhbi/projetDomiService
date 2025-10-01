import React, { useEffect, useMemo } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {
    Box, Typography, Paper, CircularProgress, useTheme, Chip, Snackbar, Alert, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Zoom
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faBuilding,
    faCalendar,
    faUser,
    faExclamationTriangle,
    faTrashAlt
} from "@fortawesome/free-solid-svg-icons";

import { archiverSignaleThunk } from "../../features/SignalementSlice";
import { Archive } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { fetchMesSignales } from "../../features/SignalementSlice";
import { MaterialReactTable } from 'material-react-table';
import { useState } from "react";

const ListSignalsPrestataires = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { mesSignales, loading } = useSelector((state) => state.signalement);
    const theme = useTheme();

    useEffect(() => {
        if (user?.utilisateur?.id) {
            dispatch(fetchMesSignales(user.utilisateur.id))
                .unwrap()
                .then((data) => console.log("Signales reçus:", data))
                .catch((err) => console.error("Erreur fetchMesSignales:", err));
        }
    }, [dispatch, user]);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    // Transformer les données pour MRT
    const rows = useMemo(
        () =>
            mesSignales.map((s) => {
                const entreprise = s.prestataire.entreprise || {};

                const prestataire = s.prestataire || {};
                const utilisateurPrestataire = prestataire.utilisateur || {};

                return {
                    id: s.id,
                    type: entreprise.nomEntreprise ? "Entreprise" : "Prestataire",
                    raison: s.raison || "—",
                    date: s.date
                        ? new Date(s.date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })
                        : "—",
                    entrepriseNom: entreprise.nomEntreprise || "—",
                    responsable: entreprise.nomEntreprise
                        ? `${utilisateurPrestataire.nom || ""} ${utilisateurPrestataire.prenom || ""}`.trim()
                        : `${utilisateurPrestataire.nom || ""} ${utilisateurPrestataire.prenom || ""}`.trim(),


                };
            }),
        [mesSignales]
    );


    const handleArchive = (id) => {
        dispatch(archiverSignaleThunk(id))
            .unwrap()
            .then(() => {
                setSnackbar({
                    open: true,
                    message: 'Signalement archivé avec succès',
                    severity: 'success'
                });
            })
            .catch(() => {
                setSnackbar({
                    open: true,
                    message: 'Erreur lors de l’archivage',
                    severity: 'error'
                });
            });
    };

    // Colonnes MRT avec des largeurs proportionnelles
    const columns = useMemo(
        () => [


            {
                accessorKey: 'responsable',
                header: 'Nom/Responsable',
                size: 180,
                Cell: ({ cell }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faUser} style={{ marginRight: 8, color: '#6c757d' }} />
                        <span>{cell.getValue()}</span>
                    </Box>
                ),
            },
            {
                accessorKey: 'type',
                header: 'Type',
                size: 200,
                Cell: ({ cell }) => (
                    <Chip
                        label={cell.getValue()}
                        color={cell.getValue() === "Entreprise" ? "primary" : "secondary"}
                        variant="outlined"
                        size="small"
                    />
                ),
            },
            {
                accessorKey: 'entrepriseNom',
                header: 'Entreprise',
                size: 180,
                Cell: ({ cell }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faBuilding} style={{ marginRight: 8, color: '#6c757d' }} />
                        <span>{cell.getValue()}</span>
                    </Box>
                ),
            },

            {
                accessorKey: 'raison',
                header: 'Raison du signalement',
                minSize: 200,
                maxSize: 400,
                Cell: ({ cell }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: 8, color: '#dc3545' }} />
                        <Chip
                            label={cell.getValue()}
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{
                                borderRadius: 1,
                                maxWidth: '100%',
                                '& .MuiChip-label': {
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }
                            }}
                        />
                    </Box>
                ),
            },
            {
                accessorKey: 'date',
                header: 'Date',
                size: 120,
                Cell: ({ cell }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faCalendar} style={{ marginRight: 8, color: '#6c757d' }} />
                        <span>{cell.getValue()}</span>
                    </Box>
                ),
            },
            {
                accessorKey: 'actions',
                header: 'Actions',
                size: 100,
                Cell: ({ row }) => (
                    <IconButton
                        color="primary"
                        onClick={() => setConfirmDialog({ open: true, id: row.original.id })}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} style={{ color: '#da0606ff' }} />
                    </IconButton>
                ),
            },
        ],
        []
    );

    const handleConfirmArchive = () => {
        const id = confirmDialog.id;
        dispatch(archiverSignaleThunk(id))
            .unwrap()
            .then(() => {
                setSnackbar({ open: true, message: "Signalement archivé avec succès", severity: "success" });

                if (user?.utilisateur?.id) {
                    dispatch(fetchMesSignales(user.utilisateur.id));
                }
            })
            .catch(() => {
                setSnackbar({ open: true, message: "Erreur lors de l'archivage", severity: "error" });
            })
            .finally(() => setConfirmDialog({ open: false, id: null }));
    };

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, id: null })}
                TransitionComponent={Zoom}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 2,
                        maxWidth: 400,
                    },
                }}
            >
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "black" }}>
                    <Box display="flex" justifyContent="center" mb={1}>
                        <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: 40, color: "#d81908ff" }} />
                    </Box>
                    Confirmation
                </DialogTitle>

                <DialogContent>
                    <Typography align="center" variant="body1" sx={{ mb: 2 }}>
                        Voulez-vous vraiment <strong>supprimer</strong> ce signalement ? <br />
                        Cette action peut être annulée plus tard.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => setConfirmDialog({ open: false, id: null })}
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmArchive}
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        ...(snackbar.severity === "success" && {
                            backgroundColor: "#2e7d32",
                            color: "#fff",
                            "& .MuiAlert-icon": { color: "#fff" }
                        })
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Box
                sx={{
                    minHeight: '80vh',
                    width: "100%",
                    maxWidth: "100vw",
                    p: 3,
                    backgroundColor: '#f9fafb'
                }}
            >
                <Box mb={4} display="flex" alignItems="center">
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
                            Liste des signalements
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Gestion des signalements des entreprises envers les prestataires
                        </Typography>
                    </Box>
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
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                            <CircularProgress sx={{ color: 'primary.main' }} />
                            <Typography variant="body1" sx={{ ml: 2 }}>
                                Chargement des données...
                            </Typography>
                        </Box>
                    ) : mesSignales.length === 0 ? (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 300,
                            color: 'text.secondary'
                        }}>
                            <FontAwesomeIcon icon={faList} style={{ fontSize: 48, marginBottom: 16 }} />
                            <Typography variant="h6" gutterBottom>
                                Aucun signalement trouvé
                            </Typography>
                            <Typography variant="body2">
                                Tous les signalements apparaîtront ici
                            </Typography>
                        </Box>
                    ) : (
                        <MaterialReactTable
                            columns={columns}
                            data={rows}
                            enableColumnResizing
                            enableColumnFilters={false}
                            enablePagination
                            enableSorting
                            enableStickyHeader
                            enableFullScreenToggle={false}
                            enableDensityToggle={false}
                            enableHiding={false}
                            initialState={{
                                pagination: { pageSize: 10, pageIndex: 0 },
                                density: 'comfortable',
                                sorting: [{ id: 'id', desc: true }]
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
                            muiTableBodyRowProps={{
                                sx: {
                                    '&:hover': {
                                        backgroundColor: 'grey.50',
                                    },
                                },
                            }}
                            muiBottomToolbarProps={{
                                sx: {
                                    backgroundColor: 'grey.100',
                                    borderTop: '1px solid',
                                    borderColor: 'grey.300',
                                },
                            }}
                            layoutMode="table"
                            displayColumnDefOptions={{
                                'mrt-row-actions': {
                                    header: 'Actions',
                                    size: 120,
                                },
                            }}
                            defaultColumn={{
                                minSize: 40,
                                maxSize: 500,
                            }}
                        />
                    )}
                </Paper>
            </Box>
            <Footer />
        </>
    );
};

export default ListSignalsPrestataires;