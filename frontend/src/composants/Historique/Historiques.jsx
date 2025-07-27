import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Checkbox, IconButton, ListItem, ListItemIcon, ListItemText,
    Menu, MenuItem, Typography, Divider, Button, Paper
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import ListIcon from '@mui/icons-material/List';
import logo from '../../assets/img/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDernierHistorique, deleteHistorique } from '../../features/HistoriqueSlice';
import SearchIcon from '@mui/icons-material/Search';
const Historique = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { data: historiqueData } = useSelector(state => state.historique || {});

    const [selected, setSelected] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuItemId, setMenuItemId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtered, setFiltered] = useState([]);

    useEffect(() => {
        if (isLoggedIn && user?.utilisateurIdCl) {
            dispatch(fetchDernierHistorique({ clientId: user.utilisateurIdCl }));
        }
    }, [dispatch, isLoggedIn, user]);
    /**Nom du prestataire
    
    Prénom du prestataire
    
    Nom de l’entreprise (si pas d’utilisateur)
    
    Nom du service
    
    Date de visite (format français) */
    useEffect(() => {
        if (historiqueData) {
            const filteredData = historiqueData.filter(item => {
                const nom = item.prestataire.entreprise?.nomEntreprise || item.prestataire.utilisateur?.nom || "";
                const prenom = item.prestataire.utilisateur?.prenom || "";
                const service = item.prestataire.service?.nom || "";
                const dateVisite = new Date(item.dateVisite);
                const heure = dateVisite.toISOString().substring(11, 16);
                const dateFr = dateVisite.toLocaleDateString("fr-FR", {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                });
                const fullText = `${nom} ${prenom} ${service} ${new Date(item.dateVisite).toLocaleDateString("fr-FR")}  ${dateFr} ${heure}`.toLowerCase();
                return fullText.includes(searchTerm.toLowerCase());
            });
            setFiltered(filteredData);
        }
    }, [searchTerm, historiqueData]);

    const handleToggle = (id) => {
        setSelected((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleMenuOpen = (event, id) => {
        setAnchorEl(event.currentTarget);
        setMenuItemId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuItemId(null);
    };
    //supprimer les selections
    const handleDeleteOne = async (id) => {
        const item = historiqueData.find((x) => x.id === id);
        if (item) {
            await dispatch(deleteHistorique({
                clientId: item.clientId,
                prestataireId: item.prestataireId,

                dateVisite: new Date(item.dateVisite).toISOString(),
            }
            )).unwrap();
            await dispatch(fetchDernierHistorique({ clientId: user.utilisateurIdCl })).unwrap();
        }

        setSelected((prev) => prev.filter(x => x !== id));
        handleMenuClose();
    };

    const handleDeleteSelected = async () => {
        for (const id of selected) {
            const item = historiqueData.find((x) => x.id === id);
            if (item) {
                await dispatch(deleteHistorique({
                    clientId: item.clientId,
                    prestataireId: item.prestataireId,
                    dateVisite: new Date(item.dateVisite).toISOString(),
                })).unwrap();
            }
        }

        await dispatch(fetchDernierHistorique({ clientId: user.utilisateurIdCl })).unwrap();
        setSelected([]);
    };

    // const handleDeleteOne = async (id) => {
    //     await dispatch(deleteHistorique(id)).unwrap();
    //     setSelected((prev) => prev.filter(x => x !== id));
    //     handleMenuClose();
    // };

    // const handleDeleteSelected = async () => {
    //     for (const id of selected) {
    //         const item = historiqueData.find((x) => x.id === id);
    //         if (item) {
    //             await dispatch(deleteHistorique(item.id)).unwrap();
    //         }
    //     }

    //     await dispatch(fetchDernierHistorique({ clientId: user.utilisateurIdCl })).unwrap();
    //     setSelected([]);
    // };

    const formatDateOnly = (dateStr) => {
        const date = new Date(dateStr);
        const iso = date.toISOString(); // exemple : "2025-07-24T05:18:00.000Z"
        const [year, month, day] = iso.substring(0, 10).split('-');

        // Format : jeudi 24 juillet 2025
        const dateUTC = new Date(`${year}-${month}-${day}T00:00:00Z`);

        return dateUTC.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };
    const groupedByDate = filtered.reduce((acc, item) => {
        const key = formatDateOnly(item.dateVisite);
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#fff', minHeight: '100vh' }}>
            {/* Sidebar Logo */}
            <Box sx={{ position: 'sticky', top: 0, width: '20%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', p: 3 }}>
                <Link to="/accueil" style={{ display: 'block', width: '100%' }}>
                    <img src={logo} alt="logo" style={{ width: '100%', maxWidth: 300, cursor: 'pointer' }} />
                </Link>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, py: 4 }}>
                <Box sx={{ maxWidth: 900, ml: 10, mr: 'auto', px: 2 }}>
                    {/* Bandeau sélection */}
                    {selected.length > 0 && (
                        <Box sx={{
                            position: 'sticky', top: 16, zIndex: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            backgroundColor: '#fff', border: '1px solid #dadce0',
                            borderRadius: 2, px: 2, py: 1, mb: 2,
                            height: 48, boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)'
                        }}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <IconButton size="small" onClick={() => setSelected([])}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                                <Typography fontSize="0.875rem">
                                    {selected.length} sélectionné{selected.length > 1 ? 's' : ''}
                                </Typography>
                            </Box>
                            <Button onClick={handleDeleteSelected} startIcon={<DeleteOutlineIcon />}
                                sx={{
                                    border: '1px solid #d2e3fc', color: '#1a73e8',
                                    fontWeight: 500, textTransform: 'none',
                                    fontSize: '0.85rem', borderRadius: 999,
                                    px: 2, height: 32, '&:hover': { backgroundColor: '#f1f8ff' }
                                }}>
                                Supprimer
                            </Button>
                        </Box>
                    )}

                    {/* Titre "Par date" */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, px: 2, mb: 2 }}>
                        <Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <ListIcon sx={{ fontSize: 20 }} />
                                <Typography fontSize="0.875rem" fontWeight="bold">Par date</Typography>
                            </Box>
                            <Divider sx={{ mt: 1 }} />
                        </Box>
                    </Box>

                    {/* Recherche */}


                    <Box sx={{ mb: 2, position: 'relative', width: '100%', maxWidth: 400 }}>
                        <input
                            type="text"
                            placeholder="Rechercher par nom, spécialité ,heure ou date"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: "8px 36px 8px 12px",  // espace à droite pour l'icône
                                borderRadius: "999px",
                                border: "1px solid #ccc",
                                width: "100%",
                                boxSizing: "border-box",
                            }}
                        />
                        <SearchIcon
                            sx={{
                                position: 'absolute',
                                right: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#888',
                                pointerEvents: 'none'
                            }}
                        />
                    </Box>


                    {/* Affichage par groupe de dates */}
                    {Object.entries(groupedByDate).map(([date, items]) => (
                        <Paper key={date} sx={{ mb: 4, borderRadius: 3, p: 2 }}>
                            <Typography fontSize="1rem" fontWeight={600} sx={{ mb: 1 }}>
                                {date}
                            </Typography>

                            {items.map((item) => {
                                const id = item.id;
                                const prestataire = item.prestataire;
                                const utilisateur = prestataire.utilisateur;
                                const entreprise = prestataire.entreprise;
                                const service = prestataire.service?.nom;
                                const nomAffiche = entreprise
                                    ? entreprise?.nomEntreprise
                                    : `${utilisateur.prenom} ${utilisateur.nom}`


                                const heure = new Date(item.dateVisite).toISOString().substring(11, 16);

                                return (
                                    <ListItem
                                        key={id}
                                        secondaryAction={
                                            <>
                                                <IconButton edge="end" size="small" onClick={(e) => handleMenuOpen(e, id)}>
                                                    <MoreVertIcon fontSize="small" />
                                                </IconButton>
                                                <Menu anchorEl={anchorEl} open={menuItemId === id} onClose={handleMenuClose}>
                                                    <MenuItem onClick={() => handleDeleteOne(id)}>Supprimer de l'historique</MenuItem>
                                                </Menu>
                                            </>
                                        }
                                        sx={{ px: 0.5, py: 0.5 }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Checkbox
                                                    size="small"
                                                    edge="start"
                                                    checked={selected.includes(id)}
                                                    onChange={() => handleToggle(id)}
                                                />
                                                <Typography fontSize="0.85rem" color="text.secondary">{heure}</Typography>
                                            </Box>
                                        </ListItemIcon>
                                        <ListItemText sx={{ ml: 2 }}
                                            primary={<Typography fontWeight={600}>{nomAffiche}</Typography>}
                                            secondary={
                                                <Typography fontSize="0.85rem" color="text.secondary">
                                                    {service}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                );
                            })}
                        </Paper>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default Historique;
