import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import PieChartRepartition from "./PieChartRepartition";
import PieChartRendezVous from "./PieChartRendezVous";
import PieChartClientInteractions from "./PieChartClientInteractions";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer"
import { useSelector } from "react-redux";
import InscriptionsMensuellesChart from "./InscriptionsMensuellesChart";
import ConsultationChart from "./ConsultationChart";
const DashboardAdmin = () => {
    const { isLoggedIn } = useSelector((state) => state.auth);
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
                        <PieChartRepartition />
                    </Grid>

                    <Grid item xs={12} sm={1} md={4}>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{ fontWeight: 600, color: "#1a3a6c", marginBottom: "15px" }}
                        >
                            Répartition des rendez-vous
                        </Typography>
                        <PieChartRendezVous />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{ fontWeight: 600, color: "#1a3a6c", marginBottom: "15px" }}
                        >
                            Clients Interactions(Favoris & signalements)
                        </Typography>
                        <PieChartClientInteractions />
                    </Grid>
                </Grid>
                <Typography
                    variant="h6"

                    sx={{ fontWeight: 600, fontSize: "30px", fontStyle: "italic", color: "#1a3a6c", marginBottom: "15px" }}
                >
                    Nombre d'inscriptions par mois
                </Typography>
                <InscriptionsMensuellesChart />
                <Box>    <Typography
                    variant="h6"

                    sx={{ fontWeight: 600, fontSize: "30px", fontStyle: "italic", color: "#1a3a6c", marginTop: "40px" }}
                >
                     Nombre de consultations mensuelles de l’application
                </Typography>
                    <ConsultationChart /></Box>

            </Box>

            <Footer />
        </>
    );
};
export default DashboardAdmin;
