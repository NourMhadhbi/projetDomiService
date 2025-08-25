import React, { useEffect, useMemo } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Box, Typography, Paper, CircularProgress, useTheme, Chip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faBuilding,
    faCalendar,
    faUser,
    faEnvelope,
    faTags,
    faHeartBroken
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { fetchNonFavoris } from "../../features/favorisPrestataireSlice";
import { MaterialReactTable } from 'material-react-table';

const ListNonFavorisPrestataires = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    // Correction: Vérifiez le chemin exact dans votre store
    const { nonFavoris, loading } = useSelector((state) => state.favoris);
    const theme = useTheme();

    useEffect(() => {
        if (user?.utilisateur?.id) {
            dispatch(fetchNonFavoris(user.utilisateur.id))
                .unwrap()
                .then((data) => console.log("Non favoris reçus:", data))
                .catch((err) => console.error("Erreur fetchNonFavoris:", err));
        }
    }, [dispatch, user]);

    // Transformer les données pour MRT
    const rows = useMemo(() =>
        nonFavoris.map((item) => {
            const prestataire = item.prestataire || {};
            const utilisateur = prestataire.utilisateur || {};
            const entreprise = prestataire.entreprise || {};
            const service = prestataire.service || {};

            return {
                id: item.id,
                type: entreprise.nomEntreprise ? "Entreprise" : "Prestataire",
                nom: entreprise.nomEntreprise
                    ? `${utilisateur.nom || ""} ${utilisateur.prenom || ""}`.trim()
                    : `${utilisateur.nom || ""} ${utilisateur.prenom || ""}`.trim(),
                entrepriseNom: entreprise.nomEntreprise || "—",
                service: service.nom || "—",
                telephone: utilisateur.numTel || "—",
                email: utilisateur.email || "—",
                dateAjout: item.dateAjout
                    ? new Date(item.dateAjout).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })
                    : "—",
            };
        }),
        [nonFavoris]
    );

    // Colonnes MRT
    const columns = useMemo(() => [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 30,
            Cell: ({ cell }) => (
                <Box sx={{ textAlign: 'center', fontWeight: 'bold', color: '#1a3a6c' }}>
                    #{cell.getValue()}
                </Box>
            ),
        },
        {
            accessorKey: 'nom',
            header: 'Nom / Responsable',
            size: 250,
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
            size: 200,
            Cell: ({ cell, row }) => (
                row.original.type === "Entreprise"
                    ? <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={faBuilding} style={{ marginRight: 8, color: '#6c757d' }} />
                        <span>{cell.getValue()}</span>
                    </Box>
                    : <Chip label="—" size="small" variant="outlined" />
            ),
        },
        {
            accessorKey: 'service',
            header: 'Service',
            size: 200,
            Cell: ({ cell }) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faTags} style={{ marginRight: 8, color: '#6c757d' }} />
                    <span>{cell.getValue()}</span>
                </Box>
            ),
        },
        { accessorKey: 'telephone', header: 'Téléphone', size: 200 },
        {
            accessorKey: 'email',
            header: 'Email',
            size: 200,
            Cell: ({ cell }) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: 8, color: '#6c757d' }} />
                    <span>{cell.getValue()}</span>
                </Box>
            ),
        },
        {
            accessorKey: 'dateAjout',
            header: "Date d'ajout",
            size: 200,
            Cell: ({ cell }) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faCalendar} style={{ marginRight: 8, color: '#6c757d' }} />
                    <span>{cell.getValue()}</span>
                </Box>
            ),
        },
    ], []);

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
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
                            icon={faHeartBroken} // Changé de faHeart à faList pour les non-favoris
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
                            Liste des non-favoris
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Prestataires et entreprises non ajoutés aux favoris
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
                                Chargement...
                            </Typography>
                        </Box>
                    ) : nonFavoris.length === 0 ? ( // Correction: nonFavoris au lieu de favoris
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 300,
                            color: 'text.secondary'
                        }}>
                            <FontAwesomeIcon icon={faHeartBroken} style={{ fontSize: 48, marginBottom: 16, color: theme.palette.text.secondary }} />
                            <Typography variant="h6" gutterBottom>
                                Aucun prestataire trouvé
                            </Typography>
                            <Typography variant="body2">
                                Tous les prestataires sont dans vos favoris
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
                            layoutMode="table"
                            initialState={{
                                pagination: { pageSize: 10, pageIndex: 0 },
                                density: 'comfortable',
                                sorting: [{ id: 'dateAjout', desc: true }]
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

export default ListNonFavorisPrestataires;