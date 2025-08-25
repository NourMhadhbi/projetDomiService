import React, { useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    IconButton,
    Box,
    Typography
} from '@mui/material';
import { BsList } from 'react-icons/bs';
import { useNavigate, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SideMenu = ({ color = '#1a3a6c' }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const user = useSelector((state) => state.auth.user);

    // Récupération du rôle
    const role =
        user?.utilisateur?.role === 'ADMIN'
            ? 'ADMIN'
            : user?.role || null;

    const toggleDrawer = (state) => () => {
        setOpen(state);
    };

    const list = () => (
        <Box
            sx={{
                width: 280,
                height: '100%',
                paddingTop: 2,
                color: 'white',
                background: `linear-gradient(rgba(2, 29, 72, 0.9)), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2075') center / cover no-repeat`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Typography variant="h6" sx={{ px: 2, mb: 1, color: 'white' }}>
                Mon Espace
            </Typography>
            <Divider sx={{ borderColor: 'rgba(243, 234, 234, 0.93)' }} />
            <List>
                {role === 'ADMIN' && (
                    <>
                        <ListItem button component={NavLink} to="/admin/utilisateurs" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Gérer les utilisateurs" sx={{ color: 'white' }} />
                        </ListItem>
                        <ListItem button component={NavLink} to="/admin/services" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Gérer les services" sx={{ color: 'white' }} />
                        </ListItem>
                        <ListItem button component={NavLink} to="/admin/signales" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Voir les signalements" sx={{ color: 'white' }} />
                        </ListItem>
                    </>
                )}

                {user.utilisateur.role === 'CLIENT' && (
                    <>
                        <ListItem button component={NavLink} to="/mes-rendez-vous" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Mes rendez-vous" sx={{ color: 'white', fontWeight: 'bold' }} />
                        </ListItem>

                        <ListItem
                            button
                            onClick={() => {
                                window.open('/historique', '_blank');
                                toggleDrawer(false)();
                            }}
                        >
                            <ListItemText primary="Historique" sx={{ color: 'white', cursor: 'pointer' }} />
                        </ListItem>

                        <ListItem button component={NavLink} to="/carnet-de-contacts" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Carnet de contacts (Favoris)" sx={{ color: 'white' }} />
                        </ListItem>

                        <ListItem button component={NavLink} to="/intervenants-bloques" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Intervenants bloqués" sx={{ color: 'white' }} />
                        </ListItem>

                        <ListItem button component={NavLink} to="/intervenants-signales" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Intervenants signalés" sx={{ color: 'white' }} />
                        </ListItem>

                        <ListItem button component={NavLink} to="/mes-avis" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Mes avis" sx={{ color: 'white' }} />
                        </ListItem>
                    </>
                )}

                {(user.utilisateur.role === 'PRESTATAIRE' || user.utilisateur.role === 'ENTREPRISE') && (
                    <>
                        <ListItem button component={NavLink} to="/mes-rendez-vous" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Mes rendez-vous" sx={{ color: 'white', fontWeight: 'bold' }} />
                        </ListItem>
                        <ListItem button component={NavLink} to="/mes-avis" onClick={toggleDrawer(false)}>
                            <ListItemText primary="Mes avis" sx={{ color: 'white' }} />
                        </ListItem>
                        <ListItem button component={NavLink} to={`/prestataires/contact/${user.utilisateur.id}`} onClick={toggleDrawer(false)}>
                            <ListItemText primary="Clients contactés" sx={{ color: 'white' }} />
                        </ListItem>
                    </>
                )}

            </List>
        </Box>
    );

    return (
        <>
            <IconButton
                color="primary"
                onClick={toggleDrawer(true)}
                sx={{
                    color: '#1a3a6c',
                    fontWeight: 600,
                    fontSize: '16px',
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                }}
                aria-label="Ouvrir le menu"
            >
                <BsList size={28} />
                Menu
            </IconButton>
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                {list()}
            </Drawer>
        </>
    );
};

export default SideMenu;
