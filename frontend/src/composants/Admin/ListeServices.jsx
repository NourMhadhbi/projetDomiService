import React, { useEffect, useState } from "react";
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
    IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import { DataGrid } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchServices,
    ajouterServiceThunk,
    modifierServiceThunk,
    archiverServiceThunk
} from "../../features/ServiceSlice";
import Swal from "sweetalert2";

const ListeServicesAdmin = () => {
    const [filtreEtat, setFiltreEtat] = useState("TOUS");
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newService, setNewService] = useState({ nom: "", description: "", image: null });
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState(null);
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { services, loading } = useSelector((state) => state.service);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    const handleEdit = (row) => {
        setServiceToEdit({ ...row });
        setEditDialogOpen(true);
    };

    const handleArchiver = async (row) => {
        const confirm = await Swal.fire({
            title: "Archiver ?",
            text: `Archiver le service "${row.nom}" ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Oui, archiver"
        });

        if (confirm.isConfirmed) {
            await dispatch(archiverServiceThunk(row.id));
            Swal.fire("Archivé", "Le service a été archivé.", "success");
        }
    };

    const handleAddService = async () => {
        const data = {
            nom: newService.nom,
            description: newService.description
        };

        if (newService.image) {
            data.image = newService.image;
        }

        await dispatch(ajouterServiceThunk(data));
        Swal.fire("Ajouté", "Le service a été ajouté.", "success");
        setOpenAddDialog(false);
        setNewService({ nom: "", description: "", image: null });
    };

    const getColonnes = () => {
        const base = [
            { field: "id", headerName: "ID", width: 80 },
            {
                field: "image",
                headerName: "Image",
                flex: 1,
                renderCell: ({ row }) => (
                    <img
                        src={row.image}
                        alt={row.nom}
                        style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}

                    />
                )
            },
            { field: "nom", headerName: "Nom Service", flex: 1 },
            { field: "description", headerName: "Description", flex: 2 },
            {
                field: "etatArchive",
                headerName: "État",
                flex: 1,
                renderCell: ({ row }) => (
                    <Typography color={row.etatArchive ? "error" : "success.main"}>
                        {row.etatArchive ? "Archivé" : "Actif"}
                    </Typography>
                )
            }
        ];

        const actionColumn = {
            field: "action",
            headerName: "Actions",
            flex: 1,
            renderCell: ({ row }) => (
                <Box display="flex" gap={1}>
                    <IconButton color="primary" onClick={() => handleEdit(row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="warning" onClick={() => handleArchiver(row)}>
                        <ArchiveIcon />
                    </IconButton>
                </Box>
            )
        };

        return [...base, actionColumn];
    };

    const rowsFiltres = services.filter((s) =>
        filtreEtat === "TOUS" ? true : filtreEtat === "Archive" ? s.etatArchive : !s.etatArchive
    );

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <Box className="container mt-4" sx={{ minHeight: 500, width: "95%", maxWidth: "100vw" }}>
                <Box mb={3} display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <FontAwesomeIcon icon={faList} style={{ fontSize: 35, color: "#ff6b00", marginRight: 10 }} />
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1a3a6c" }}>
                                Liste des services
                            </Typography>
                            <Box sx={{ height: 4, width: "80px", backgroundColor: "#ff6b00", borderRadius: 2, mt: 1 }} />
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenAddDialog(true)}
                        sx={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            paddingX: 2.5,
                            paddingY: 1,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            fontSize: '0.95rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            '&:hover': {
                                backgroundColor: '#115293'
                            }
                        }}
                    >
                        Ajouter un service
                    </Button>
                </Box>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="filtre-etat-label">Filtrer par État</InputLabel>
                    <Select
                        labelId="filtre-etat-label"
                        value={filtreEtat}
                        label="Filtrer par État"
                        onChange={(e) => setFiltreEtat(e.target.value)}
                    >
                        <MenuItem value="TOUS">Tous</MenuItem>
                        <MenuItem value="Archive">Archivé</MenuItem>
                        <MenuItem value="NonArchive">Actif</MenuItem>
                    </Select>
                </FormControl>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                    <div style={{ width: "100%", overflow: "auto" }}>
                        <div style={{ minWidth: "1200px", height: "600px" }}>
                            <DataGrid
                                rows={rowsFiltres}
                                columns={getColonnes()}
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                rowsPerPageOptions={[10, 20, 50]}
                                pagination
                                disableRowSelectionOnClick
                            />
                        </div>
                    </div>
                </Paper>
            </Box>
            {/** Modal Ajout service */}

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Modifier le service</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                    <TextField
                        label="Nom du service"
                        value={serviceToEdit?.nom || ""}
                        onChange={(e) => setServiceToEdit({ ...serviceToEdit, nom: e.target.value })}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Description"
                        multiline
                        rows={4}
                        value={serviceToEdit?.description || ""}
                        onChange={(e) => setServiceToEdit({ ...serviceToEdit, description: e.target.value })}
                        fullWidth
                    />
                    <Button variant="outlined" component="label">
                        Modifier l’image
                        <input
                            type="file"
                            hidden
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setServiceToEdit({ ...serviceToEdit, image: reader.result });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </Button>
                    {serviceToEdit?.image && (
                        <Typography variant="body2" color="textSecondary">Image sélectionnée</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} variant="outlined"
                        color="inherit"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 3,
                            py: 1
                        }}>Annuler</Button>
                    <Button
                        onClick={async () => {
                            const { id, nom, description, image } = serviceToEdit;
                            const data = { nom, description, image };
                            await dispatch(modifierServiceThunk({ id, data }));
                            setEditDialogOpen(false);
                            Swal.fire("Modifié", "Le service a été mis à jour.", "success");
                        }}
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            boxShadow: '0px 2px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Modal Ajout Service */}
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Ajouter un nouveau service</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                    <TextField
                        label="Nom du service"
                        value={newService.nom}
                        onChange={(e) => setNewService({ ...newService, nom: e.target.value })}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Description"
                        multiline
                        rows={4}
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        fullWidth
                    />
                    <Button variant="outlined" component="label">
                        Choisir une image
                        <input
                            type="file"
                            hidden
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setNewService({ ...newService, image: reader.result });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </Button>
                    {newService.image && (
                        <Typography variant="body2">Image sélectionnée</Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setOpenAddDialog(false)}
                        variant="outlined"
                        color="inherit"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 3,
                            py: 1
                        }}
                    >
                        Annuler
                    </Button>

                    <Button
                        onClick={handleAddService}
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 3,
                            py: 1,
                            boxShadow: '0px 2px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </>
    );
};

export default ListeServicesAdmin;
