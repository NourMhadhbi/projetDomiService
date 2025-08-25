import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../features/AuthSlice';
import { useEffect } from 'react';
import {
    Avatar,
    IconButton,
    Menu,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';

const ProfilMenu = ({ user }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // const handleLogout = () => {
    //     dispatch(logout());
    //     handleClose();
    //     navigate('/');
    // };

    // const handleProfil = () => {
    //     handleClose();
    //     navigate('/profil');
    // };

    return (
        <React.Fragment>
            <Tooltip title="Compte utilisateur">
                <IconButton onClick={handleClick} sx={{ p: 0 }}>
                    <Avatar
                        alt={'Utilisateur'}
                        src={user.utilisateur.image}
                        sx={{ width: 40, height: 40 }}
                    />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: { width: 180, paddingY: 0.1, paddingX: 0.1 }
                }}
            >
                <List sx={{ width: '100%' }} component="nav" aria-label="Profil options" dense>
                    <ListItem button onClick={() => navigate('/profil')}>
                        <ListItemText primary="Profil" sx={{ py: 0.25, minHeight: '1px' }} />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem
                        button
                        onClick={() => {
                            dispatch(logout());
                            dispatch(clearNotifications());
                            dispatch(reset());
                            navigate('/accueil');
                        }}
                        sx={{
                            '&:hover': { backgroundColor: '#f0f0f0' }
                        }}
                    >
                        <ListItemText
                            primary="Déconnexion"
                            sx={{ py: 0.25, minHeight: '1px', cursor: "pointer" }}
                        />
                    </ListItem>
                </List>
            </Menu>
        </React.Fragment>
    );
};

export default ProfilMenu;
