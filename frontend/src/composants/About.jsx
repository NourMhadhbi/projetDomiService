
import React from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    LinearProgress
} from "@mui/material";

import { styled } from "@mui/system";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import HandymanIcon from "@mui/icons-material/Handyman";
import SecurityIcon from "@mui/icons-material/Security";
import PhoneIcon from "@mui/icons-material/Phone";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import domiServe from '../assets/img/domiserivice.jpg';
import { Link } from 'react-router-dom';
import AProposSection from "./Accueil/AProposSection";
import StatistiquesSection from "./Accueil/StatistiquesSection";
import { useSelector } from "react-redux";

const IconWrapper = styled(Box)({
    fontSize: "50px",
    marginBottom: "15px",
    color: "#ff4d00",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
});

// Titre section
const SectionTitle = styled(Typography)({
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: "28px",
    textAlign: "center",
    marginBottom: "10px",
});

// Texte description
const SectionDesc = styled(Typography)({
    fontFamily: "'Poppins', sans-serif",
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#777",
    textAlign: "center",
});

const APropos = () => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    return (
        <>
            <Header isClientConnected={isLoggedIn} />

            {/* Section DomiService */}
            <Box sx={{ backgroundColor: "#fff", py: 8 }}>
                <Container>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            {
                                icon: <VerifiedUserIcon sx={{ fontSize: 35, color: "#fff" }} />,
                                title: "Prestataires vérifiés",
                                desc: "Tous nos intervenants sont soigneusement sélectionnés pour leur expérience et leur professionnalisme."
                            },
                            {
                                icon: <HandymanIcon sx={{ fontSize: 35, color: "#fff" }} />,
                                title: "Interventions rapides",
                                desc: "Nous vous mettons en relation avec un prestataire proche de chez vous pour agir sans délai."
                            },
                            {
                                icon: <SecurityIcon sx={{ fontSize: 35, color: "#fff" }} />,
                                title: "Service fiable",
                                desc: "Chaque mission est suivie par notre équipe pour garantir un travail de qualité."
                            },
                            {
                                icon: <PriceCheckIcon sx={{ fontSize: 35, color: "#fff" }} />,
                                title: "Satisfaction assurée",
                                desc: "Votre satisfaction est notre priorité, et nous nous engageons à répondre à vos besoins."
                            }
                        ].map((item, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                key={index}
                                sx={{ textAlign: "center" }}
                            >
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "50%",
                                        backgroundColor: "#ff4d00",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 15px",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                                    }}
                                >
                                    {item.icon}
                                </Box>
                                <Typography
                                    sx={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: "18px",
                                        fontWeight: 600,
                                        mb: 1
                                    }}
                                >
                                    {item.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: "15px",
                                        lineHeight: 1.6,
                                        color: "#666",
                                        maxWidth: 250,
                                        margin: "0 auto"
                                    }}
                                >
                                    {item.desc}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <AProposSection />
            {/* Bannière CTA */}
            <Box
                sx={{
                    position: 'relative',
                    py: 10,
                    color: "#fff",
                    textAlign: "center",
                    background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${domiServe}) center/cover`,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        zIndex: 1,
                    },
                    '& > *': {
                        position: 'relative',
                        zIndex: 2,
                    },
                }}
            >
                <Container>
                    <Typography
                        sx={{
                            mb: 2,
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "20px",
                            color: "#ff4d00",
                            fontWeight: 600
                        }}
                    >
                        <PhoneIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        +216-20-714-492
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 700,
                            fontSize: "30px",
                            mb: 2
                        }}
                    >
                        Besoin d’un service à domicile ? Contactez DomiService !
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "16px",
                            mb: 4,
                            color: "#ddd"
                        }}
                    >
                        Urgence ou rendez-vous planifié, nos prestataires interviennent rapidement dans votre région.
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#ff4d00",
                            px: 3,
                            py: 1.2,
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 600,
                            mr: 2,
                            "&:hover": { backgroundColor: "#e04300" }
                        }}
                    >
                        Prendre rendez-vous
                    </Button>
                    <Button
                        component={Link}
                        to="/contact"
                        variant="outlined"
                        sx={{
                            px: 3,
                            py: 1.2,
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 600,
                            color: "#fff",
                            borderColor: "#fff",
                            "&:hover": { borderColor: "#ff4d00", color: "#ff4d00" }
                        }}
                    >
                        Contactez-nous
                    </Button>
                </Container>
            </Box>
            {/* <StatistiquesSection /> */}
            {/* Pourquoi nous choisir */}

            <Box sx={{ backgroundColor: "#f9f9f9", py: 8 }}>
                <Container>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        {/* Texte + barres */}
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                {/* <CheckCircleIcon sx={{ color: "#ff4d00", mr: 1, fontSize: 30 }} /> */}
                                <Typography
                                    sx={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: "18px",
                                        fontWeight: 600,
                                        color: "#ff4d00",
                                        mb: 0,
                                    }}
                                >
                                    Pourquoi Nous Choisir
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontSize: "26px",
                                    fontWeight: 700,
                                    mb: 5,
                                }}
                            >
                                DomiService : La solution fiable pour tous vos besoins à domicile
                            </Typography>

                            {[
                                { label: "Réactivité des interventions", value: 96 },
                                { label: "Satisfaction client", value: 92 },
                                { label: "Diversité des services", value: 88 },
                                { label: "Fiabilité des prestataires", value: 95 },
                            ].map((item, index) => (
                                <Box key={index} mb={3}>
                                    <Typography
                                        sx={{
                                            fontFamily: "'Poppins', sans-serif",
                                            fontSize: "15px",
                                            mb: 1,
                                        }}
                                    >
                                        {item.label} – {item.value}%
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={item.value}
                                        sx={{
                                            height: 8,
                                            borderRadius: 5,
                                            backgroundColor: "#e0e0e0",
                                            "& .MuiLinearProgress-bar": {
                                                backgroundColor: "#ff4d00",
                                            },
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>


                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                component="img"
                                src={domiServe}
                                alt="Pourquoi choisir DomiService"
                                sx={{
                                    maxWidth: 700,
                                    width: '100%',
                                    height: 'auto',
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    borderRadius: 0,
                                    objectFit: 'contain',
                                }}
                            />
                        </Box>

                    </Box>
                </Container>
            </Box>


            <Footer />
        </>
    );
};

export default APropos;
