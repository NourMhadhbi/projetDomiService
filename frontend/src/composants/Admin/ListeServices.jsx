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
//     Paper,
//     Button,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     IconButton,
//     CircularProgress
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import ArchiveIcon from "@mui/icons-material/Archive";
// import { DataGrid } from "@mui/x-data-grid";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faList } from "@fortawesome/free-solid-svg-icons";
// import { useSelector, useDispatch } from "react-redux";
// import { FilePond, registerPlugin } from 'react-filepond';
// import 'filepond/dist/filepond.min.css';
// import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
// import {
//     fetchServices,
//     ajouterServiceThunk,
//     modifierServiceThunk,
//     archiverServiceThunk
// } from "../../features/ServiceSlice";
// import Swal from "sweetalert2";
// import ImageService from "./ImageService";
// // Register FilePond plugins
// registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// const ListeServicesAdmin = () => {
//     const [filtreEtat, setFiltreEtat] = useState("TOUS");
//     const [openAddDialog, setOpenAddDialog] = useState(false);
//     const [newService, setNewService] = useState({ nom: "", description: "", image: null });
//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [serviceToEdit, setServiceToEdit] = useState(null);
//     const [filesAdd, setFilesAdd] = useState([]);
//     const [filesEdit, setFilesEdit] = useState([]);
//     const [isUploading, setIsUploading] = useState(false);

//     const dispatch = useDispatch();
//     const { isLoggedIn } = useSelector((state) => state.auth);
//     const { services, loading } = useSelector((state) => state.service);
//     const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

//     // Configuration Cloudinary pour FilePond
//     const serverOptions = {
//         process: {
//             url: 'https://api.cloudinary.com/v1_1/dkhjej8yx/image/upload',
//             method: 'POST',
//             withCredentials: false,
//             headers: {},
//             timeout: 7000,
//             onload: (response) => {
//                 const data = JSON.parse(response);
//                 setIsUploading(false);
//                 return data.secure_url;
//             },
//             onerror: (error) => {
//                 console.error('Erreur de téléchargement:', error);
//                 setIsUploading(false);
//                 Swal.fire("Erreur", "Erreur lors du téléchargement de l'image", "error");
//                 return error;
//             },
//             ondata: (formData) => {
//                 // Ici le fichier est automatiquement ajouté par FilePond sous 'file'
//                 formData.append('upload_preset', 'DomiService');
//                 return formData;
//             }
//         }
//     };


//     useEffect(() => {
//         dispatch(fetchServices());
//     }, [dispatch]);

//     const handleEdit = (row) => {
//         setServiceToEdit({ ...row });

//         if (row.image) {
//             setFilesEdit([
//                 {
//                     source: row.image,
//                     options: {
//                         type: 'remote',
//                         file: {
//                             name: 'image-service.jpg',
//                             size: 12345,
//                             type: 'image/jpeg'
//                         },
//                         metadata: {
//                             poster: row.image
//                         }
//                     }
//                 }
//             ]);
//         } else {
//             setFilesEdit([]);
//         }

//         setEditDialogOpen(true);
//     };

//     const handleArchiver = async (row) => {
//         const confirm = await Swal.fire({
//             title: "Archiver ?",
//             text: `Archiver le service "${row.nom}" ?`,
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d33",
//             confirmButtonText: "Oui, archiver"
//         });

//         if (confirm.isConfirmed) {
//             await dispatch(archiverServiceThunk(row.id));
//             Swal.fire("Archivé", "Le service a été archivé.", "success");
//         }
//     };

//     const handleAddService = async () => {
//         if (!newService.nom) {
//             Swal.fire("Erreur", "Le nom du service est obligatoire", "error");
//             return;
//         }

//         const data = {
//             nom: newService.nom,
//             description: newService.description,
//             image: newService.image
//         };

//         await dispatch(ajouterServiceThunk(data));
//         Swal.fire("Ajouté", "Le service a été ajouté.", "success");
//         setOpenAddDialog(false);
//         setNewService({ nom: "", description: "", image: null });
//         setFilesAdd([]);
//     };

//     const handleUpdateService = async () => {
//         if (!serviceToEdit.nom) {
//             Swal.fire("Erreur", "Le nom du service est obligatoire", "error");
//             return;
//         }

//         const { id, nom, description, image } = serviceToEdit;
//         const data = { nom, description, image };

//         await dispatch(modifierServiceThunk({ id, data }));
//         setEditDialogOpen(false);
//         setServiceToEdit(null);
//         setFilesEdit([]);
//         Swal.fire("Modifié", "Le service a été mis à jour.", "success");
//     };

//     const getColonnes = () => {
//         const base = [
//             { field: "id", headerName: "ID", width: 80 },
//             {
//                 field: "image",
//                 headerName: "Image",
//                 flex: 1,
//                 renderCell: ({ row }) => (
//                     <Box
//                         display="flex"
//                         alignItems="center"
//                         justifyContent="center"
//                         height="100%"
//                         sx={{ p: 1 }}
//                     >
//                         {row.image ? (
//                             <img
//                                 src={row.image}
//                                 alt={row.nom}
//                                 style={{
//                                     width: 70,
//                                     height: 70,
//                                     objectFit: "cover",
//                                     borderRadius: 8,
//                                     boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
//                                 }}
//                             />
//                         ) : (
//                             <Box
//                                 sx={{
//                                     width: 70,
//                                     height: 70,
//                                     bgcolor: "grey.100",
//                                     borderRadius: 2,
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center"
//                                 }}
//                             >
//                                 <Typography variant="caption" color="textSecondary">
//                                     Aucune image
//                                 </Typography>
//                             </Box>
//                         )}
//                     </Box>
//                 )
//             },
//             { field: "nom", headerName: "Nom Service", flex: 1 },
//             { field: "description", headerName: "Description", flex: 2 },
//             {
//                 field: "etatArchive",
//                 headerName: "État",
//                 flex: 1,
//                 renderCell: ({ row }) => (
//                     <Typography color={row.etatArchive ? "error" : "success.main"}>
//                         {row.etatArchive ? "Archivé" : "Actif"}
//                     </Typography>
//                 )
//             }
//         ];

//         const actionColumn = {
//             field: "action",
//             headerName: "Actions",
//             flex: 1,
//             renderCell: ({ row }) => (
//                 <Box display="flex" gap={1}>
//                     <IconButton color="primary" onClick={() => handleEdit(row)}>
//                         <EditIcon />
//                     </IconButton>
//                     <IconButton color="warning" onClick={() => handleArchiver(row)}>
//                         <ArchiveIcon />
//                     </IconButton>
//                 </Box>
//             )
//         };

//         return [...base, actionColumn];
//     };

//     const rowsFiltres = services.filter((s) =>
//         filtreEtat === "TOUS" ? true : filtreEtat === "Archive" ? s.etatArchive : !s.etatArchive
//     );

//     return (
//         <>
//             <Header isClientConnected={isLoggedIn} />
//             <Box className="container mt-4" sx={{ minHeight: 500, width: "95%", maxWidth: "100vw" }}>
//                 <Box mb={3} display="flex" alignItems="center" justifyContent="space-between">
//                     <Box display="flex" alignItems="center">
//                         <FontAwesomeIcon icon={faList} style={{ fontSize: 35, color: "#ff6b00", marginRight: 10 }} />
//                         <Box>
//                             <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1a3a6c" }}>
//                                 Liste des services
//                             </Typography>
//                             <Box sx={{ height: 4, width: "80px", backgroundColor: "#ff6b00", borderRadius: 2, mt: 1 }} />
//                         </Box>
//                     </Box>
//                     <Button
//                         variant="contained"
//                         startIcon={<AddIcon />}
//                         onClick={() => setOpenAddDialog(true)}
//                         sx={{
//                             backgroundColor: '#1976d2',
//                             color: 'white',
//                             paddingX: 2.5,
//                             paddingY: 1,
//                             textTransform: 'none',
//                             fontWeight: 'bold',
//                             borderRadius: 2,
//                             fontSize: '0.95rem',
//                             boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
//                             '&:hover': {
//                                 backgroundColor: '#115293'
//                             }
//                         }}
//                     >
//                         Ajouter un service
//                     </Button>
//                 </Box>

//                 <FormControl fullWidth sx={{ mb: 2 }}>
//                     <InputLabel id="filtre-etat-label">Filtrer par État</InputLabel>
//                     <Select
//                         labelId="filtre-etat-label"
//                         value={filtreEtat}
//                         label="Filtrer par État"
//                         onChange={(e) => setFiltreEtat(e.target.value)}
//                     >
//                         <MenuItem value="TOUS">Tous</MenuItem>
//                         <MenuItem value="Archive">Archivé</MenuItem>
//                         <MenuItem value="NonArchive">Actif</MenuItem>
//                     </Select>
//                 </FormControl>

//                 <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
//                     <div style={{ width: "100%", overflow: "auto" }}>
//                         <div style={{ minWidth: "1200px", height: "600px" }}>
//                             <DataGrid
//                                 rows={rowsFiltres}
//                                 columns={getColonnes()}
//                                 paginationModel={paginationModel}
//                                 onPaginationModelChange={setPaginationModel}
//                                 rowsPerPageOptions={[10, 20, 50]}
//                                 pagination
//                                 disableRowSelectionOnClick
//                             />
//                         </div>
//                     </div>
//                 </Paper>
//             </Box>

//             {/** Modal Modification service */}
//             <Dialog
//                 open={editDialogOpen}
//                 onClose={() => setEditDialogOpen(false)}
//                 maxWidth="sm"
//                 fullWidth
//                 PaperProps={{
//                     sx: {
//                         borderRadius: 3,
//                         overflow: 'hidden'
//                     }
//                 }}
//             >
//                 <DialogTitle sx={{
//                     background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
//                     color: 'white',
//                     py: 2,
//                     px: 3,
//                     display: 'flex',
//                     alignItems: 'center',
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//                 }}>
//                     <EditIcon sx={{
//                         mr: 1.5,
//                         fontSize: '1.8rem',
//                         background: 'rgba(255,255,255,0.2)',
//                         borderRadius: '50%',
//                         p: 0.5
//                     }} />
//                     <Typography variant="h6" fontWeight="500" sx={{ letterSpacing: '0.5px' }}>
//                         Modifier le service
//                     </Typography>
//                 </DialogTitle>

//                 <DialogContent
//                     dividers
//                     sx={{
//                         p: 3,
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: 3,
//                         maxHeight: '70vh',
//                         overflow: 'auto'
//                     }}
//                 >
//                     {serviceToEdit && (
//                         <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//                             <ImageService
//                                 service={serviceToEdit}
//                                 setService={setServiceToEdit}
//                             />
//                         </Box>
//                     )}

//                     <TextField
//                         label="Nom du service"
//                         value={serviceToEdit?.nom || ""}
//                         onChange={(e) => setServiceToEdit({ ...serviceToEdit, nom: e.target.value })}
//                         fullWidth
//                         required
//                         variant="outlined"
//                         size="small"
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 borderRadius: 2
//                             }
//                         }}
//                     />

//                     <TextField
//                         label="Description"
//                         multiline
//                         rows={4}
//                         value={serviceToEdit?.description || ""}
//                         onChange={(e) => setServiceToEdit({ ...serviceToEdit, description: e.target.value })}
//                         fullWidth
//                         variant="outlined"
//                         size="small"
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 borderRadius: 2
//                             }
//                         }}
//                     />
//                 </DialogContent>

//                 <DialogActions sx={{
//                     px: 3,
//                     py: 2,
//                     borderTop: 1,
//                     borderColor: 'divider',
//                     background: 'rgba(0,0,0,0.02)'
//                 }}>
//                     <Button
//                         onClick={() => {
//                             setEditDialogOpen(false);
//                         }}
//                         variant="outlined"
//                         color="inherit"
//                         sx={{
//                             borderRadius: '8px',
//                             textTransform: 'none',
//                             px: 3,
//                             py: 1,
//                             fontWeight: '500'
//                         }}
//                     >
//                         Annuler
//                     </Button>

//                     <Button
//                         onClick={handleUpdateService}
//                         variant="contained"
//                         color="primary"
//                         disabled={isUploading}
//                         sx={{
//                             borderRadius: '8px',
//                             textTransform: 'none',
//                             px: 3,
//                             py: 1,
//                             boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
//                             fontWeight: '500',
//                             '&:hover': {
//                                 boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)'
//                             }
//                         }}
//                     >
//                         {isUploading ? (
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                 <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
//                                 Enregistrement...
//                             </Box>
//                         ) : "Enregistrer"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Modal Ajout Service */}
//             <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth
//                 PaperProps={{
//                     sx: {
//                         borderRadius: 3,
//                         overflow: 'hidden'
//                     }
//                 }}
//             >
//                 <DialogTitle sx={{
//                     background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
//                     color: 'white',
//                     py: 2,
//                     px: 3,
//                     display: 'flex',
//                     alignItems: 'center',
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//                 }}>
//                     <AddIcon sx={{
//                         mr: 1.5,
//                         fontSize: '1.8rem',
//                         background: 'rgba(255,255,255,0.2)',
//                         borderRadius: '50%',
//                         p: 0.5
//                     }} />
//                     <Typography variant="h6" fontWeight="500" sx={{ letterSpacing: '0.5px' }}>
//                         Ajouter un service
//                     </Typography>
//                 </DialogTitle>

//                 <DialogContent
//                     dividers
//                     sx={{
//                         p: 3,
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: 3,
//                         maxHeight: '70vh',
//                         overflow: 'auto'
//                     }}
//                 >
//                     <Box>
//                         <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
//                             Ajouter une image
//                         </Typography>
//                         <FilePond
//                             files={filesAdd}
//                             onupdatefiles={setFilesAdd}
//                             allowMultiple={false}
//                             maxFiles={1}
//                             name="file"
//                             labelIdle='Glissez-déposez votre image ou <span class="filepond--label-action">Parcourir</span>'
//                             server={serverOptions}
//                             onprocessfile={(error, file) => {
//                                 if (!error) {
//                                     setNewService({ ...newService, image: file.serverId });
//                                 }
//                             }}
//                             onremovefile={() => {
//                                 setNewService({ ...newService, image: null });
//                             }}
//                         />
//                         {isUploading && <CircularProgress size={24} sx={{ alignSelf: 'center', mt: 1 }} />}
//                     </Box>

//                     <TextField
//                         label="Nom du service"
//                         value={newService.nom}
//                         onChange={(e) => setNewService({ ...newService, nom: e.target.value })}
//                         fullWidth
//                         required
//                         variant="outlined"
//                         size="small"
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 borderRadius: 2
//                             }
//                         }}
//                     />

//                     <TextField
//                         label="Description"
//                         multiline
//                         rows={4}
//                         value={newService.description}
//                         onChange={(e) => setNewService({ ...newService, description: e.target.value })}
//                         fullWidth
//                         variant="outlined"
//                         size="small"
//                         sx={{
//                             '& .MuiOutlinedInput-root': {
//                                 borderRadius: 2
//                             }
//                         }}
//                     />
//                 </DialogContent>

//                 <DialogActions sx={{
//                     px: 3,
//                     py: 2,
//                     borderTop: 1,
//                     borderColor: 'divider',
//                     background: 'rgba(0,0,0,0.02)'
//                 }}>
//                     <Button
//                         onClick={() => {
//                             setOpenAddDialog(false);
//                             setFilesAdd([]);
//                         }}
//                         variant="outlined"
//                         color="inherit"
//                         sx={{
//                             borderRadius: '8px',
//                             textTransform: 'none',
//                             px: 3,
//                             py: 1,
//                             fontWeight: '500'
//                         }}
//                     >
//                         Annuler
//                     </Button>

//                     <Button
//                         onClick={handleAddService}
//                         variant="contained"
//                         color="primary"
//                         disabled={isUploading}
//                         sx={{
//                             borderRadius: '8px',
//                             textTransform: 'none',
//                             px: 3,
//                             py: 1,
//                             boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
//                             fontWeight: '500',
//                             '&:hover': {
//                                 boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)'
//                             }
//                         }}
//                     >
//                         {isUploading ? (
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                 <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
//                                 Enregistrement...
//                             </Box>
//                         ) : "Enregistrer"}
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             <Footer />
//         </>
//     );
// };

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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    CircularProgress,
    Chip,
    Avatar,
    useTheme,
    Tooltip, Snackbar, Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faTags } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import {
    fetchServices,
    ajouterServiceThunk,
    modifierServiceThunk,
    archiverServiceThunk, activerServiceThunk
} from "../../features/ServiceSlice";
import Swal from "sweetalert2";
import ImageService from "./ImageService";
import { MaterialReactTable } from 'material-react-table';
import DescriptionModal from "./DescriptionModal";

// Register FilePond plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const ListeServicesAdmin = () => {
    const [filtreEtat, setFiltreEtat] = useState("TOUS");
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newService, setNewService] = useState({ nom: "", description: "", image: null });
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState(null);
    const [filesAdd, setFilesAdd] = useState([]);
    const [filesEdit, setFilesEdit] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState(null);
    const [DescriptionModalOpen, setDescriptionModalOpen] = useState(false);
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { services, loading } = useSelector((state) => state.service);
    const theme = useTheme();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });
    const handleDescriptionClick = (Description) => {
        setSelectedDescription(Description);
        setDescriptionModalOpen(true);
    };

    const serverOptions = {
        process: {
            url: 'https://api.cloudinary.com/v1_1/dkhjej8yx/image/upload',
            method: 'POST',
            withCredentials: false,
            headers: {},
            timeout: 7000,
            onload: (response) => {
                const data = JSON.parse(response);
                setIsUploading(false);
                return data.secure_url;
            },
            onerror: (error) => {
                console.error('Erreur de téléchargement:', error);
                setIsUploading(false);
                Swal.fire("Erreur", "Erreur lors du téléchargement de l'image", "error");
                return error;
            },
            ondata: (formData) => {
                formData.append('upload_preset', 'DomiService');
                return formData;
            }
        }
    };

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    const handleEdit = (row) => {
        setServiceToEdit({ ...row.original });

        if (row.original.image) {
            setFilesEdit([
                {
                    source: row.original.image,
                    options: {
                        type: 'remote',
                        file: {
                            name: 'image-service.jpg',
                            size: 12345,
                            type: 'image/jpeg'
                        },
                        metadata: {
                            poster: row.original.image
                        }
                    }
                }
            ]);
        } else {
            setFilesEdit([]);
        }

        setEditDialogOpen(true);
    };

    const handleArchiver = async (row) => {
        const confirm = await Swal.fire({
            title: "Confirmer l’archivage",
            text: `Êtes-vous sûr de vouloir archiver le service "${row.original.nom}" ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Oui, archiver",
            cancelButtonText: "Annuler"
        });

        if (confirm.isConfirmed) {
            try {

                await dispatch(archiverServiceThunk(row.original.id)).unwrap();

                Swal.fire(
                    "Service archivé",
                    `Le service "${row.original.nom}" a été archivé avec succès.`,
                    "success"
                );
            } catch (error) {
                const message =
                    error?.message || "Impossible d'archiver ce service en raison d'une erreur inattendue.";

                Swal.fire(
                    "Erreur d'archivage",
                    message,
                    "error"
                );
            }
        }
    };


    const handleReactiver = async (row) => {
        const confirm = await Swal.fire({
            title: "Confirmer la réactivation",
            text: `Voulez-vous réactiver le service "${row.original.nom}" ? Il sera de nouveau disponible.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Oui, réactiver",
            cancelButtonText: "Annuler"
        });

        if (confirm.isConfirmed) {
            await dispatch(activerServiceThunk(row.original.id));
            Swal.fire(
                "Service réactivé",
                `Le service "${row.original.nom}" est maintenant actif.`,
                "success"
            );
        }
    };

    const handleAddService = async () => {
        if (!newService.nom) {
            setSnackbar({ open: true, message: "Le nom du service est obligatoire", severity: "error" });
            return;
        }

        const data = {
            nom: newService.nom,
            description: newService.description,
            image: newService.image
        };

        try {
            await dispatch(ajouterServiceThunk(data)).unwrap();
            setSnackbar({ open: true, message: "Le service a été ajouté.", severity: "success" });
            setOpenAddDialog(false);
            setNewService({ nom: "", description: "", image: null });
            setFilesAdd([]);
        } catch (err) {
            setSnackbar({ open: true, message: err, severity: "error" });
        }
    };

    const handleUpdateService = async () => {
        if (!serviceToEdit.nom) {
            setSnackbar({ open: true, message: "Le nom du service est obligatoire", severity: "error" });
            return;
        }

        const { id, nom, description, image } = serviceToEdit;
        const data = { nom, description, image };

        try {
            await dispatch(modifierServiceThunk({ id, data })).unwrap();
            setSnackbar({ open: true, message: "Le service a été mis à jour.", severity: "success" });
            setEditDialogOpen(false);
            setServiceToEdit(null);
            setFilesEdit([]);
        } catch (err) {
            setSnackbar({ open: true, message: err, severity: "error" });
        }
    };


    const rowsFiltres = services.filter((s) =>
        filtreEtat === "TOUS" ? true : filtreEtat === "Archive" ? s.etatArchive : !s.etatArchive
    );

    // Configuration des colonnes pour MaterialReactTable
    const columns = useMemo(
        () => [

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
                        {row.original.image ? (
                            <Avatar
                                src={row.original.image}
                                alt={row.original.nom}
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
                header: 'Nom Service',
                size: 200,
            },
            {
                accessorKey: 'description',
                header: 'Description',
                size: 400,
                Cell: ({ row, cell }) => (
                    <Tooltip title="Cliquez pour voir la description complet" arrow>
                        <Typography
                            variant="body2"
                            onClick={() => handleDescriptionClick(row.original)}
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                cursor: 'pointer'
                            }}
                        >
                            {cell.getValue()}
                        </Typography>
                    </Tooltip>
                )
            }
            ,
            {
                accessorKey: 'etatArchive',
                header: 'État',
                size: 100,
                Cell: ({ cell }) => (
                    <Chip
                        label={cell.getValue() ? "Archivé" : "Actif"}
                        color={cell.getValue() ? "default" : "success"}
                        variant={cell.getValue() ? "outlined" : "filled"}
                        size="small"
                    />
                )
            },
            {
                id: 'actions',
                header: 'Actions',
                size: 120,
                Cell: ({ row }) => (
                    <Box display="flex" gap={1}>
                        <Tooltip title={row.original.etatArchive ? "Service archivé" : "Modifier le service"}>
                            <span> {/* Wrapper <span> pour que Tooltip fonctionne avec un bouton désactivé */}
                                <IconButton
                                    color="primary"
                                    onClick={() => handleEdit(row)}
                                    size="small"
                                    disabled={row.original.etatArchive} // Désactive si archivé
                                    sx={{
                                        backgroundColor: row.original.etatArchive ? 'grey.300' : theme.palette.primary.light,
                                        '&:hover': {
                                            backgroundColor: row.original.etatArchive ? 'grey.300' : theme.palette.primary.main
                                        }
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>

                        {row.original.etatArchive ? (
                            <IconButton
                                color="success"
                                onClick={() => handleReactiver(row)}
                                size="small"
                                sx={{
                                    backgroundColor: theme.palette.success.light,
                                    '&:hover': { backgroundColor: theme.palette.success.main }
                                }}
                            >
                                <ArchiveIcon fontSize="small" />
                            </IconButton>
                        ) : (
                            <IconButton
                                color="warning"
                                onClick={() => handleArchiver(row)}
                                size="small"
                                sx={{
                                    backgroundColor: theme.palette.warning.light,
                                    '&:hover': { backgroundColor: theme.palette.warning.main }
                                }}
                            >
                                <ArchiveIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                ),
            }

        ],
        [services]
    );

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
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
                                icon={faTags}
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
                                Gestion des Services
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ajouter, modifier et archiver les services
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenAddDialog(true)}
                        sx={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            px: 3,
                            py: 1.2,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            fontSize: '0.95rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            '&:hover': {
                                backgroundColor: '#115293',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                            }
                        }}
                    >
                        Nouveau Service
                    </Button>
                </Box>

                <Box sx={{ mb: 3, width: 500 }}>
                    <FormControl fullWidth>
                        <InputLabel id="filtre-etat-label">Filtrer par État</InputLabel>
                        <Select
                            labelId="filtre-etat-label"
                            value={filtreEtat}
                            label="Filtrer par État"
                            onChange={(e) => setFiltreEtat(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="TOUS">Tous les services</MenuItem>
                            <MenuItem value="Archive">Services archivés</MenuItem>
                            <MenuItem value="NonArchive">Services actifs</MenuItem>
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
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                            <CircularProgress sx={{ color: 'primary.main' }} />
                            <Typography variant="body1" sx={{ ml: 2 }}>
                                Chargement des services...
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
                            <FontAwesomeIcon icon={faTags} style={{ fontSize: 48, marginBottom: 16 }} />
                            <Typography variant="h6" gutterBottom>
                                Aucun service trouvé
                            </Typography>
                            <Typography variant="body2">
                                {filtreEtat === "Archive"
                                    ? "Aucun service archivé"
                                    : "Commencez par ajouter un service"
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
                            enableStickyHeader
                            enableFullScreenToggle={false}
                            enableDensityToggle={false}
                            enableHiding={false}
                            layoutMode="grid"
                            initialState={{
                                pagination: { pageSize: 10, pageIndex: 0 },
                                density: 'comfortable',
                                sorting: [{ id: 'id', desc: false }]
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
                            localization={{
                                noRecordsToDisplay: 'Aucun service à afficher',
                                of: 'sur',
                                rowsPerPage: 'Lignes par page',
                            }}
                        />
                    )}
                </Paper>
            </Box>

            {/** Modal Modification service */}
            <Dialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
                    color: 'white',
                    py: 2,
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <EditIcon sx={{
                        mr: 1.5,
                        fontSize: '1.8rem',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        p: 0.5
                    }} />
                    <Typography variant="h6" fontWeight="500" sx={{ letterSpacing: '0.5px' }}>
                        Modifier le service
                    </Typography>
                </DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        maxHeight: '70vh',
                        overflow: 'auto'
                    }}
                >
                    {serviceToEdit && (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ImageService
                                service={serviceToEdit}
                                setService={setServiceToEdit}
                            />
                        </Box>
                    )}

                    <TextField
                        label="Nom du service"
                        value={serviceToEdit?.nom || ""}
                        onChange={(e) => setServiceToEdit({ ...serviceToEdit, nom: e.target.value })}
                        fullWidth
                        required
                        variant="outlined"
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />

                    <TextField
                        label="Description"
                        multiline
                        rows={6}
                        value={serviceToEdit?.description || ""}
                        onChange={(e) => setServiceToEdit({ ...serviceToEdit, description: e.target.value })}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{
                    px: 3,
                    py: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    background: 'rgba(0,0,0,0.02)'
                }}>


                    <Button
                        onClick={handleUpdateService}
                        variant="contained"
                        color="primary"
                        disabled={isUploading}
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                            fontWeight: '500',
                            '&:hover': {
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)'
                            }
                        }}
                    >
                        {isUploading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                                Enregistrement...
                            </Box>
                        ) : "Modifier"}
                    </Button>
                    <Button
                        onClick={() => {
                            setEditDialogOpen(false);
                        }}
                        variant="outlined"
                        color="inherit"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            fontWeight: '500'
                        }}
                    >
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Ajout Service */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
                    color: 'white',
                    py: 2,
                    px: 3,
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <AddIcon sx={{
                        mr: 1.5,
                        fontSize: '1.8rem',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        p: 0.5
                    }} />
                    <Typography variant="h6" fontWeight="500" sx={{ letterSpacing: '0.5px' }}>
                        Ajouter un service
                    </Typography>
                </DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        maxHeight: '70vh',
                        overflow: 'auto'
                    }}
                >
                    <Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                            Ajouter une image
                        </Typography>
                        <FilePond
                            files={filesAdd}
                            onupdatefiles={setFilesAdd}
                            allowMultiple={false}
                            maxFiles={1}
                            name="file"
                            labelIdle='Glissez-déposez votre image ou <span class="filepond--label-action">Parcourir</span>'
                            server={serverOptions}
                            onprocessfile={(error, file) => {
                                if (!error) {
                                    setNewService({ ...newService, image: file.serverId });
                                }
                            }}
                            onremovefile={() => {
                                setNewService({ ...newService, image: null });
                            }}
                        />
                        {isUploading && <CircularProgress size={24} sx={{ alignSelf: 'center', mt: 1 }} />}
                    </Box>

                    <TextField
                        label="Nom du service"
                        value={newService.nom}
                        onChange={(e) => setNewService({ ...newService, nom: e.target.value })}
                        fullWidth
                        required
                        variant="outlined"
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />

                    <TextField
                        label="Description"
                        multiline
                        rows={6}
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{
                    px: 3,
                    py: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    background: 'rgba(0,0,0,0.02)'
                }}>


                    <Button
                        onClick={handleAddService}
                        variant="contained"
                        color="primary"
                        disabled={isUploading}
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                            fontWeight: '500',
                            '&:hover': {
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)'
                            }
                        }}
                    >
                        {isUploading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                                Enregistrement...
                            </Box>
                        ) : "Enregistrer"}
                    </Button>
                    <Button
                        onClick={() => {
                            setOpenAddDialog(false);
                            setFilesAdd([]);
                        }}
                        variant="outlined"
                        color="inherit"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            fontWeight: '500'
                        }}
                    >
                        Annuler
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
            {DescriptionModalOpen && (
                <DescriptionModal
                    open={DescriptionModalOpen}
                    onClose={() => setDescriptionModalOpen(false)}
                    DescriptionData={selectedDescription}
                />
            )}
        </>
    );
};

export default ListeServicesAdmin;