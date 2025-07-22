import React, { useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, ListItemText, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const notifications = [
    { id: 1, title: "Rendez-vous confirmé", description: "Votre RDV du 20 juillet est validé." },
    { id: 2, title: "Message reçu", description: "Un client vous a envoyé un message." },
    { id: 3, title: "Plomberie urgente", description: "Nouvelle intervention ajoutée." },
];

const NotificationMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon sx={{ color: '#1a3a6c' }} />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 300,
                        maxHeight: 400,
                        mt: 1.5,
                        borderRadius: 2,
                    },
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem disabled><strong>Notifications</strong></MenuItem>
                <Divider />
                {notifications.map((notif) => (
                    <MenuItem key={notif.id} onClick={handleClose}>
                        <ListItemText
                            primary={notif.title}
                            secondary={notif.description}
                            primaryTypographyProps={{ fontWeight: 'bold' }}
                            secondaryTypographyProps={{ fontSize: '0.85rem' }}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default NotificationMenu;
