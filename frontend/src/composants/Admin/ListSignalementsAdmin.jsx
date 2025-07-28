import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {
    Box,
    Typography,
    Paper,
    Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { fetchSignales } from "../../features/SignalementSlice";

const ListeSignaleAdmin = () => {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { signales, loading } = useSelector((state) => state.signalement);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    useEffect(() => {
        dispatch(fetchSignales());
    }, [dispatch]);


    const getColonnes = () => [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "client",
            headerName: "Client",
            flex: 1,
            valueGetter: ({ row }) => {
                if (!row || !row.client || !row.client.utilisateur) return "—";
                return `${row.client.utilisateur.nom} ${row.client.utilisateur.prenom}`;
            }
        },

        {
            field: "prestataire",
            headerName: "Prestataire / Entreprise",
            flex: 1,
            valueGetter: ({ row }) => {
                if (!row || !row.prestataire) return "—";
                const utilisateur = row.prestataire.utilisateur;
                const entreprise = row.prestataire.entreprise;

                if (entreprise?.nomEntreprise) {
                    return entreprise.nomEntreprise;
                } else if (utilisateur) {
                    return `${utilisateur.nom} ${utilisateur.prenom}`;
                }
                return "—";
            }
        },
        {
            field: "raison",
            headerName: "Raison",
            flex: 2
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
            valueGetter: ({ row }) => {
                if (!row || !row.date) return "—";
                new Date(row.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                })
            }
        }
    ];
    useEffect(() => {
        if (signales.length > 0) {
            console.log("🟢 Exemple signalement complet :", signales[0]);
        }
    }, [signales]);

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <Box className="container mt-4" sx={{ minHeight: 500, width: "95%", maxWidth: "100vw" }}>
                <Box mb={3} display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <FontAwesomeIcon icon={faList} style={{ fontSize: 35, color: "#ff6b00", marginRight: 10 }} />
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1a3a6c" }}>
                                Liste des signalements
                            </Typography>
                            <Box sx={{ height: 4, width: "80px", backgroundColor: "#ff6b00", borderRadius: 2, mt: 1 }} />
                        </Box>
                    </Box>
                </Box>
                {console.log("signales", signales)}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <div style={{ width: "100%", overflow: "auto" }}>
                        <div style={{ minWidth: "1200px", height: "600px" }}>
                            {loading ? (
                                <Typography>Chargement des données...</Typography>
                            ) : signales.length === 0 ? (
                                <Typography>Aucun signalement trouvé.</Typography>
                            ) : (
                            
                            <DataGrid
                            
                                rows={signales}
                                columns={getColonnes()}
                                getRowId={(row) => row.id}
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                rowsPerPageOptions={[10, 20, 50]}
                                pagination
                                disableRowSelectionOnClick
                            />
                            )}
                        </div>
                    </div>
                </Paper>
            </Box>
            <Footer />
        </>
    );
};

export default ListeSignaleAdmin;
