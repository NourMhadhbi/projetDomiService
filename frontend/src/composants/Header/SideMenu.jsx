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
const SideMenu = ({ color = '#1a3a6c' }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const toggleDrawer = (state) => () => {
        setOpen(state);
    };

    const list = () => (
        <Box
            sx={{
                width: 280,
                height: '100%',
                paddingTop: 2,
                color: 'white', // texte blanc
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
                <ListItem button onClick={() => navigate('/mes-rendez-vous')}>
                    <ListItemText primary="Mes rendez-vous" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }} />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Historique" sx={{ color: 'white' }} />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Carnet de contacts (Intervenants favoris)" sx={{ color: 'white' }} />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Intervenants bloqués(non favoris)" sx={{ color: 'white' }} />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Intervenants signalés" sx={{ color: 'white' }} />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Mes avis" sx={{ color: 'white' }} />
                </ListItem>
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
            <Drawer
                anchor="right"
                open={open}
                onClose={toggleDrawer(false)}
            >
                {list()}
            </Drawer>
        </>
    );
};

export default SideMenu;
