import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';
import { useFormik } from 'formik';
import {
    Container,
    Paper,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Button,
    Box,
    Divider,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    CircularProgress,
    Alert,
    Fade
} from "@mui/material";
import {
    Edit,
    Save,
    Cancel,
    Visibility,
    VisibilityOff,
    Lock,
    Person,
    Email,
    Phone,
    LocationOn,
    Business,
    Work,
    School,
    AttachMoney,
    Star,
    Event,
    Warning,
    Security, Notes,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { updateCompte, logout } from "../../features/AuthSlice";
import Swal from "sweetalert2";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

// Register FilePond plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Styles personnalisés
const ProfileContainer = styled(Container)(({ theme }) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

const ProfileCard = styled(Card)(({ theme }) => ({
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
}));

const StatCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: "center",
    borderRadius: 12,
    backgroundColor: theme.palette.background.default,
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    color: theme.palette.primary.main,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 140,
    height: 140,
    border: `4px solid ${theme.palette.primary.main}`,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
}));

const EditProfileButton = styled(Button)(({ theme }) => ({
    borderRadius: 20,
    padding: "8px 20px",
    fontWeight: 600,
    textTransform: 'none',
    background: "linear-gradient(45deg, #1261a0 30%, #0c3c78 90%)",
    boxShadow: "0 3px 10px rgba(18, 97, 160, 0.3)",
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: 10,
    padding: "8px 20px",
    fontWeight: 500,
    textTransform: 'none',
    margin: '0 8px',
}));

const PageProfil = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn, user, stats, isLoading, isError, isSuccess } = useSelector((state) => state.auth);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [files, setFiles] = useState([]);
    const filePondRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const isActive = user?.utilisateur?.isActive ?? user?.isActive ?? true;
    console.log("isActive", user)
    // useEffect pour vérifier si l'utilisateur n'est plus actif
    useEffect(() => {
        if (isActive === false) {
            dispatch(logout());
            navigate('/');
            Swal.fire({
                icon: 'info',
                title: 'Déconnexion',
                text: 'Votre email a été modifié. Veuillez vous reconnecter avec votre nouvel email.',
                confirmButtonText: 'OK'
            });
        }
    }, [isActive, dispatch, navigate]);
    // Configuration Cloudinary
    const serverOptions = {
        process: {
            url: 'https://api.cloudinary.com/v1_1/dkhjej8yx/image/upload',
            withCredentials: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: 7000,
            onload: (response) => {
                const data = JSON.parse(response);
                setForm(prev => ({ ...prev, image: data.secure_url }));
                setIsUploading(false);
                return data.secure_url;
            },
            onerror: (error) => {
                console.error('Erreur de téléchargement:', error);
                setIsUploading(false);
                return error;
            },
            ondata: (formData) => {
                formData.append('upload_preset', 'DomiService');
                formData.append('cloud_name', 'dkhjej8yx');
                return formData;
            }
        },
        revert: {
            url: 'https://api.cloudinary.com/v1_1/dkhjej8yx/delete_by_token',
            method: 'POST',
            withCredentials: false,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            onload: (response) => {
                console.log('Fichier supprimé');
                setForm(prev => ({ ...prev, image: '' }));
            },
            onerror: (error) => {
                console.error('Erreur de suppression:', error);
            }
        }
    };

    const [form, setForm] = useState({
        id: user?.utilisateur?.id || "",
        nom: user?.utilisateur?.nom || "",
        prenom: user?.utilisateur?.prenom || "",
        email: user?.utilisateur?.email || user?.email || "",
        genre: user?.utilisateur?.genre
            ? user.utilisateur.genre.charAt(0).toUpperCase() +
            user.utilisateur.genre.slice(1).toLowerCase()
            : "",
        adresse: user?.adresse || "",
        ville: user?.ville || "",
        numTel: user?.numTel || "",
        specialite: user?.specialite || "",
        competence: user?.competence || "",
        experience: user?.experience || "",
        tarifDeplacement: user?.tarifDeplacement || "",
        nomEntreprise: user?.entreprise?.nomEntreprise || "",
        siteWeb: user?.entreprise?.siteWeb || "",
        identifiant: user?.entreprise?.identifiant || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        image: user?.utilisateur?.image || user?.image || ""
    });



    if (!user) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    const u = user?.utilisateur || user;
    const role = (user?.utilisateur?.role || user?.role || "").toUpperCase();
    const avatarUrl = form.image || user?.utilisateur?.image || user?.image || "/images/avatarDefault.png";

    const dateInscription = user?.utilisateur?.createdAt || user?.createdAt
        ? new Date(user.utilisateur?.createdAt || user.createdAt).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "-";

    const counter = {
        rendezVous: stats?.rendezVous || 0,
        avis: stats?.avis || 0,
        signalements: stats?.signalements || 0,
    };

    const roleColors = {
        CLIENT: "primary",
        PRESTATAIRE: "success",
        ADMIN: "secondary",
        ENTREPRISE: "warning",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (passwordErrors[name]) {
            setPasswordErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    const schema = yup.object().shape({
        newPassword: yup
            .string()

            .min(8, "Minimum 8 caractères")
            .matches(/[0-9]/, "Doit contenir un chiffre")
            .matches(/[^a-zA-Z0-9]/, "Doit contenir un symbole"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('newPassword'), null], "Les mots de passe ne correspondent pas"),

    });


    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: schema,
        onSubmit: async (values, { resetForm }) => {
            const dataToSend = {
                ...form,
                id: u.id,
                currentPassword: values.currentPassword,
                motDePasse: values.newPassword,
                genre: form.genre === "Homme" ? "HOMME" : form.genre === "Femme" ? "FEMME" : null,
            };

            delete dataToSend.newPassword;
            delete dataToSend.confirmPassword;

            if (!values.currentPassword) {
                delete dataToSend.currentPassword;
                delete dataToSend.motDePasse;
            }

            try {
                await dispatch(updateCompte(dataToSend)).unwrap();
                Swal.fire({
                    icon: 'success',
                    title: 'Modification réussie',
                    text: 'Vos informations ont été mises à jour avec succès',
                    confirmButtonText: 'OK',
                    background: '#f5f5f5',
                    customClass: {
                        popup: 'swal-popup-custom',
                        confirmButton: 'swal-confirm-button'
                    },
                    willClose: () => {
                        setEditModalOpen(false);
                        setFiles([]);
                        resetForm(); // ✅ reset Formik (plus besoin de setForm)
                    }
                });
            } catch (error) {
                console.error("Erreur mise à jour :", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Erreur lors de la mise à jour du compte',
                    confirmButtonText: 'OK',
                    background: '#f5f5f5',
                    customClass: {
                        popup: 'swal-popup-custom'
                    }
                });
            }
        },
    });

    const handleClickShowPassword = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    return (
        <>
            <Header isClientConnected={isLoggedIn} />

            <ProfileContainer maxWidth="lg">
                <Box>
                    <ProfileCard>
                        <CardContent sx={{ p: 4 }}>
                            <Grid container spacing={4}>
                                {/* Colonne gauche - Photo de profil et stats */}
                                <Grid item xs={12} md={4}>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <Box position="relative" mb={3}>
                                            <StyledAvatar
                                                src={avatarUrl}
                                                alt={`${u.prenom} ${u.nom}`}
                                            />
                                            <IconButton
                                                sx={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    right: 0,
                                                    backgroundColor: "primary.main",
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "primary.dark" },
                                                }}
                                                onClick={() => setEditModalOpen(true)}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </Box>

                                        <Typography variant="h5" fontWeight="700" gutterBottom>
                                            {u.prenom} {u.nom}
                                        </Typography>

                                        <Chip
                                            label={role}
                                            color={roleColors[role] || "default"}
                                            sx={{ mb: 3, fontWeight: 600 }}
                                        />

                                        <Grid container spacing={2} mb={3}>
                                            <Grid item xs={4}>
                                                <StatCard>
                                                    <Event color="primary" />
                                                    <Typography variant="h6" fontWeight="700" mt={1}>
                                                        {counter.rendezVous}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        RDV
                                                    </Typography>
                                                </StatCard>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <StatCard>
                                                    <Star color="warning" />
                                                    <Typography variant="h6" fontWeight="700" mt={1}>
                                                        {counter.avis}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Avis
                                                    </Typography>
                                                </StatCard>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <StatCard>
                                                    <Warning color="error" />
                                                    <Typography variant="h6" fontWeight="700" mt={1}>
                                                        {counter.signalements}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Signals
                                                    </Typography>
                                                </StatCard>
                                            </Grid>
                                        </Grid>

                                        <EditProfileButton
                                            variant="contained"
                                            startIcon={<Edit />}
                                            onClick={() => setEditModalOpen(true)}
                                            sx={{ mb: 2 }}
                                        >
                                            Modifier le profil
                                        </EditProfileButton>

                                        <Typography variant="body2" color="textSecondary">
                                            Membre depuis : <strong>{dateInscription}</strong>
                                        </Typography>
                                    </Box>
                                </Grid>


                                <Grid item xs={12} md={8}>

                                    <Box mb={4}>
                                        <SectionTitle variant="h6">
                                            Informations personnelles
                                        </SectionTitle>
                                        <Box sx={{ pl: 2 }}>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                <strong>Nom:</strong> {u.nom}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                <strong>Prénom:</strong> {u.prenom}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                <strong>Email:</strong> {u.email}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                <strong>Genre:</strong> {u.genre}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 3 }} />

                                    {/* Coordonnées */}
                                    {(role === "CLIENT" || role === "PRESTATAIRE" || role === "ENTREPRISE") && (
                                        <Box mb={4}>
                                            <SectionTitle variant="h6">
                                                <LocationOn sx={{ mr: 1 }} />
                                                Coordonnées
                                            </SectionTitle>
                                            <Box sx={{ pl: 2 }}>
                                                <Typography variant="body1" sx={{ mb: 1 }}>
                                                    <strong>Adresse:</strong> {user.adresse || "-"}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 1 }}>
                                                    <strong>Ville:</strong> {user.ville || "-"}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mb: 1 }}>
                                                    <strong>Téléphone:</strong> {user.numTel || "-"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {(["PRESTATAIRE", "ENTREPRISE"].includes(role)) && (
                                        <>
                                            <Divider sx={{ my: 3 }} />
                                            <Box mb={4}>
                                                <SectionTitle variant="h6">
                                                    <Work sx={{ mr: 1 }} />
                                                    Informations professionnelles
                                                </SectionTitle>
                                                <Box sx={{ pl: 2 }}>
                                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                                        <strong>Spécialité:</strong> {user.Spécialite || "-"}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                                        <strong>Tarif déplacement:</strong> {user.tarifDeplacement ? `${user.tarifDeplacement} DT` : "-"}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                                        <strong>Compétences:</strong> {user.competence || "-"}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                                        <strong>Expérience:</strong> {user.experience || "-"}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                                        <strong>Description:</strong> {user.descriptionCourte || "-"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </>
                                    )}

                                    {role === "ENTREPRISE" && (
                                        <>
                                            <Divider sx={{ my: 3 }} />
                                            <Box mb={4}>
                                                <SectionTitle variant="h6">
                                                    <Business sx={{ mr: 1 }} />
                                                    Détails de l'entreprise
                                                </SectionTitle>
                                                <Box sx={{ pl: 2 }}>
                                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                                        <strong>Nom:</strong> {user.entreprise?.nomEntreprise || "-"}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                                        <strong>Identifiant:</strong> {user.entreprise?.identifiant || "-"}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                                        <strong>Site web:</strong> {user.entreprise?.siteWeb || "-"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </ProfileCard>
                </Box>
            </ProfileContainer>

            {/* Modal d'édition */}
            <Dialog
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                maxWidth="md"
                fullWidth
                TransitionComponent={Fade}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(45deg, #1261a0 30%, #0c3c78 90%)',
                    color: 'white',
                    py: 2,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <Edit sx={{ mr: 1, fontSize: '1.5rem' }} />
                    <Typography variant="h5" fontWeight="600">
                        Modifier le profil
                    </Typography>
                </DialogTitle>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    centered
                    sx={{
                        px: 3,
                        mt: 2,
                        '& .MuiTab-root': {
                            fontWeight: 500,
                            minWidth: 'auto',
                            px: 3
                        }
                    }}
                >
                    <Tab label="Informations personnelles" />
                    <Tab label="Sécurité du compte" />
                </Tabs>

                <DialogContent dividers sx={{ p: 3 }}>
                    <form onSubmit={formik.handleSubmit}>
                        {activeTab === 0 && (
                            <Box>
                                <Box textAlign="center" mb={3}>
                                    <Box sx={{
                                        position: 'relative',
                                        width: 120,
                                        height: 120,
                                        margin: '0 auto',
                                        '&:hover .edit-icon': {
                                            transform: 'scale(1.1)'
                                        }
                                    }}>
                                        <Paper
                                            elevation={4}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                border: '3px solid white',
                                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                                cursor: 'pointer',
                                                transition: 'transform 0.3s',
                                                '&:hover': {
                                                    transform: 'scale(1.03)'
                                                }
                                            }}
                                            onClick={() => filePondRef.current?.browse()}
                                        >
                                            {avatarUrl ? (
                                                <img
                                                    src={avatarUrl}
                                                    alt="Profile"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <Avatar sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    fontSize: 40,
                                                    bgcolor: 'primary.main'
                                                }}>
                                                    {u.prenom?.charAt(0)}{u.nom?.charAt(0)}
                                                </Avatar>
                                            )}
                                        </Paper>

                                        <IconButton
                                            className="edit-icon"
                                            sx={{
                                                position: 'absolute',
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    backgroundColor: 'primary.dark',
                                                },
                                                width: 32,
                                                height: 32
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                filePondRef.current?.browse();
                                            }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ mt: 2, mb: 2 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            Glissez-déposez votre image ou parcourir
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'none' }}>
                                        <FilePond
                                            ref={filePondRef}
                                            files={files}
                                            onupdatefiles={setFiles}
                                            allowMultiple={false}
                                            maxFiles={1}
                                            server={serverOptions}
                                            name="file"
                                            onprocessfile={() => setIsUploading(true)}
                                            onprocessfiles={() => setIsUploading(false)}
                                            labelIdle=""
                                        />
                                    </Box>
                                </Box>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h6"
                                        sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', fontWeight: 600, color: "#1a3a6c" }}
                                    >
                                        <Person sx={{ mr: 1 }} />
                                        Informations Personnelles
                                    </Typography>
                                    <Divider sx={{ borderColor: "#1a3a6c", mb: 2 }} />
                                </Grid>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Nom"
                                            name="nom"
                                            value={form.nom}
                                            onChange={handleChange}
                                            margin="normal"
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    paddingLeft: '8px',
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Prénom"
                                            name="prenom"
                                            value={form.prenom}
                                            onChange={handleChange}
                                            margin="normal"
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    paddingLeft: '8px',
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={8}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            margin="normal"
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    paddingLeft: '8px',
                                                }
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <FormControl fullWidth margin="normal" size="small">
                                            <InputLabel>Genre</InputLabel>
                                            <Select
                                                name="genre"
                                                value={form.genre || ""}
                                                onChange={handleChange}
                                                label="Genre"
                                            >
                                                <MenuItem value="Homme">Homme</MenuItem>
                                                <MenuItem value="Femme">Femme</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography
                                        variant="h6"
                                        sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', fontWeight: 600, color: "#1a3a6c" }}
                                    >
                                        <LocationOn sx={{ mr: 1 }} />
                                        Coordonnées
                                    </Typography>
                                    <Divider sx={{ borderColor: "#1a3a6c", mb: 2 }} />
                                </Grid>

                                <Grid container spacing={3}>
                                    {(["CLIENT", "PRESTATAIRE", "ENTREPRISE"].includes(role)) && (
                                        <>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Adresse"
                                                    name="adresse"
                                                    value={form.adresse}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            paddingLeft: '8px',
                                                        }
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Ville"
                                                    name="ville"
                                                    value={form.ville}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationOn color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            paddingLeft: '8px',
                                                        }
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Téléphone"
                                                    name="numTel"
                                                    value={form.numTel}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Phone color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            paddingLeft: '8px',
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                </Grid>


                                {(["PRESTATAIRE", "ENTREPRISE"].includes(role)) && (
                                    <>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="h6"
                                                sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', fontWeight: 600, color: "#1a3a6c" }}
                                            >
                                                <Work sx={{ mr: 1 }} />
                                                Informations professionnelles
                                            </Typography>
                                            <Divider sx={{ borderColor: "#1a3a6c", mb: 2 }} />
                                        </Grid>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Spécialité"
                                                    name="Spécialite"
                                                    value={form.Spécialite}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Work color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            paddingLeft: '8px',
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Tarif déplacement (DT)"
                                                    name="tarifDeplacement"
                                                    type="number"
                                                    value={form.tarifDeplacement}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <AttachMoney color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            paddingLeft: '8px',
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={3} sx={{ mt: 3 }}>
                                            <Grid item xs={12}  >
                                                <TextField
                                                    fullWidth
                                                    label="Compétences"
                                                    name="competence"
                                                    multiline
                                                    rows={3}
                                                    value={form.competence}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <School color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            paddingLeft: '8px',
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}  >
                                                <TextField
                                                    fullWidth
                                                    label="Expérience"
                                                    name="experience"
                                                    multiline
                                                    rows={3}
                                                    value={form.experience}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Work color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            paddingLeft: '8px',
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}  >
                                                <TextField
                                                    fullWidth
                                                    label="Description"
                                                    name="descriptionCourte"
                                                    multiline
                                                    rows={3}
                                                    value={form.descriptionCourte}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Notes color="disabled" fontSize="small" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            paddingLeft: '8px',
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </>
                                )}

                                {/* Détails de l'entreprise pour ENTREPRISE */}
                                {role === "ENTREPRISE" && (
                                    <>
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="h6"
                                                sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', fontWeight: 600, color: "#1a3a6c" }}
                                            >
                                                <Business sx={{ mr: 1 }} />
                                                Détails de l'entreprise
                                            </Typography>
                                            <Divider sx={{ borderColor: "#1a3a6c", mb: 2 }} />
                                        </Grid>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Nom de l'entreprise"
                                                    name="nomEntreprise"
                                                    value={form.nomEntreprise}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Business color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            paddingLeft: '8px',
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Identifiant"
                                                    name="identifiant"
                                                    value={form.identifiant}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Business color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            paddingLeft: '8px',
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Site web"
                                                    name="siteWeb"
                                                    value={form.siteWeb}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                    placeholder="ex: domiservice.tn"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Business color="action" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            paddingLeft: '8px',
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                            </Box>
                        )}

                        {activeTab === 1 && (
                            <>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h6"
                                        sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', fontWeight: 600, color: "#1a3a6c" }}
                                    >
                                        <Security color="primary" sx={{ mr: 1 }} />
                                        Sécurité du compte
                                    </Typography>
                                    <Divider sx={{ borderColor: "#1a3a6c", mb: 2 }} />
                                </Grid>
                                <Box sx={{ maxWidth: 600, mx: 'auto' }}>


                                    <TextField
                                        fullWidth
                                        label="Mot de passe actuel"
                                        name="currentPassword"
                                        type={showPassword.current ? "text" : "password"}
                                        value={form.currentPassword}
                                        onChange={handleChange}
                                        margin="normal"
                                        variant="outlined"
                                        size="small"
                                        error={!!passwordErrors.currentPassword}
                                        helperText={passwordErrors.currentPassword}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => handleClickShowPassword("current")}
                                                        edge="end"
                                                    >
                                                        {showPassword.current ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Nouveau mot de passe"
                                        name="newPassword"
                                        type={showPassword.new ? "text" : "password"}
                                        value={formik.values.newPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        margin="normal"
                                        variant="outlined"
                                        // size supprimé pour taille standard
                                        error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                        helperText={formik.touched.newPassword && formik.errors.newPassword}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => handleClickShowPassword("new")}
                                                        edge="end"
                                                    >
                                                        {showPassword.new ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Confirmer le mot de passe"
                                        name="confirmPassword"
                                        type={showPassword.confirm ? "text" : "password"}
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        margin="normal"
                                        variant="outlined"
                                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => handleClickShowPassword("confirm")}
                                                        edge="end"
                                                    >
                                                        {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                            </>
                        )}

                        {isError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {isError.message || "Une erreur s'est produite lors de la mise à jour."}
                            </Alert>
                        )}

                        <DialogActions sx={{ px: 0, pt: 3, justifyContent: 'center' }}>
                            <ActionButton
                                onClick={() => {
                                    setEditModalOpen(false);
                                    setFiles([]);
                                }}
                                startIcon={<Cancel />}
                                sx={{
                                    color: 'text.secondary',
                                    border: '1px solid',
                                    borderColor: 'grey.300',
                                    '&:hover': {
                                        backgroundColor: 'action.hover'
                                    }
                                }}
                            >
                                Annuler
                            </ActionButton>
                            <ActionButton
                                type="submit"
                                variant="contained"
                                startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
                                disabled={isLoading || isUploading}
                                sx={{
                                    background: 'linear-gradient(45deg, #1261a0 30%, #0c3c78 90%)',
                                    boxShadow: '0 3px 5px 2px rgba(18, 97, 160, .3)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #0c3c78 30%, #1261a0 90%)',
                                    }
                                }}
                            >
                                {isLoading ? "Enregistrement..." : "Enregistrer"}
                            </ActionButton>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>

            <Footer />

            <style>
                {`
            .swal2-container {
  z-index: 20000 !important;
}
                `}
            </style>
        </>
    );
};

export default PageProfil;