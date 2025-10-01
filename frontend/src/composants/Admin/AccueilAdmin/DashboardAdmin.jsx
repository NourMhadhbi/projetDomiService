import { React, useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import PieChartRepartition from "./PieChartRepartition";
import PieChartRendezVous from "./PieChartRendezVous";
import PieChartClientInteractions from "./PieChartClientInteractions";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer"

import InscriptionsMensuellesChart from "./InscriptionsMensuellesChart";
import ConsultationChart from "./ConsultationChart";
import {
    fetchRepartitionUtilisateurs,
    fetchRendezVousStats,
    fetchClientInteractions,
    fetchInscriptionsParMois,
    fetchConsultationsMensuelles
} from '../../../features/statistiquesAdminSlice';
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
const DashboardAdmin = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchRepartitionUtilisateurs());
        dispatch(fetchRendezVousStats());
        dispatch(fetchClientInteractions());
        dispatch(fetchInscriptionsParMois());
        dispatch(fetchConsultationsMensuelles());
    }, [dispatch]);
    const {
        repartitionUtilisateurs,
        rendezVous,
        clientInteractions,
        inscriptionsParMois,
        consultationsMensuelles,
        loading,
        error
    } = useSelector((state) => state.statistiquesAdmin);
    const { isLoggedIn } = useSelector((state) => state.auth);
    const dataRepartition = repartitionUtilisateurs
        ? [
            { name: "Clients", value: repartitionUtilisateurs.clients },
            { name: "Prestataires", value: repartitionUtilisateurs.prestataires },
            { name: "Entreprises", value: repartitionUtilisateurs.entreprises }
        ]
        : [];
    const rendezVousData = rendezVous
        ? [
            { name: "Annulé", value: rendezVous.nbAnnuler },
            { name: "Confirmé", value: rendezVous.nbConfirmer },
            { name: "En attente", value: rendezVous.nbEnAttent },
            { name: "Terminé", value: rendezVous.nbTerminer }
        ]
        : [];
    const clientinteractionData = clientInteractions
        ? [
            { name: "Favoris", value: clientInteractions.favoris },
            { name: "Non Favoris", value: clientInteractions.nonFavoris },
            { name: "Signalés", value: clientInteractions.signalements }

        ]
        : [];
    const InscriptionMensuelles = Array.isArray(inscriptionsParMois)
        ? inscriptionsParMois.map(item => ({
            month: item.mois,
            clients: item.clients,
            prestataires: item.prestataires,
            entreprises: item.entreprises
        }))
        : [];
    const ConsultationMensuelles = Array.isArray(consultationsMensuelles)
        ? consultationsMensuelles.map(item => ({
            month: item.month,
            clients: item.clients,
            prestataires: item.prestataires,
            entreprises: item.entreprises
        }))
        : [];
    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <Box sx={{ padding: "40px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
                <Grid container spacing={7} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{ fontWeight: 600, color: "#1a3a6c", marginBottom: "15px" }}
                        >
                            Répartition des utilisateurs
                        </Typography>
                        <PieChartRepartition data={dataRepartition} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{ fontWeight: 600, color: "#1a3a6c", marginBottom: "15px" }}
                        >
                            Répartition des rendez-vous
                        </Typography>
                        <PieChartRendezVous data={rendezVousData} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{ fontWeight: 600, color: "#1a3a6c", marginBottom: "15px" }}
                        >
                            Répartition des Interactions Clients
                        </Typography>
                        <PieChartClientInteractions data={clientinteractionData} />
                    </Grid>
                </Grid>
                <Typography
                    variant="h6"

                    sx={{ fontWeight: 600, fontSize: "30px", fontStyle: "italic", color: "#1a3a6c", marginBottom: "15px" }}
                >
                    Nombre d'inscriptions par mois
                </Typography>
                <InscriptionsMensuellesChart data={InscriptionMensuelles} />
                <Box>    <Typography
                    variant="h6"

                    sx={{ fontWeight: 600, fontSize: "30px", fontStyle: "italic", color: "#1a3a6c", marginTop: "40px" }}
                >
                    Nombre de consultations mensuelles de l’application
                </Typography>
                    <ConsultationChart data={ConsultationMensuelles} /></Box>

            </Box>

            <Footer />
        </>
    );
};
export default DashboardAdmin;
