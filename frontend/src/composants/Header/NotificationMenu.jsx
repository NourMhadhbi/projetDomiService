import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    ListItemText,
    Divider,
    Typography,
    Box,
    Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationAsRead } from '../../features/NotificationSlice';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
const NotificationMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const notifications = useSelector((state) => state.notification.liste);
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    // Nombre de non lues
    const unreadCount = notifications.filter(n => !n.estLue).length;

    useEffect(() => {
        if (isLoggedIn && user?.utilisateur?.id && user?.utilisateur?.role) {
            dispatch(fetchNotifications({
                id: user.utilisateur.id,
                role: user.utilisateur.role
            }));
        }
    }, [dispatch, isLoggedIn, user]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };



    const handleSignupClick = () => {
        handleClose();
        navigate('/inscription');
    };

    const handleNotificationClick = (notif) => {
        dispatch(markNotificationAsRead(notif.id));
        handleClose();
        const contenu = notif.contenu.toLowerCase();

        if (user?.utilisateur?.role === "PRESTATAIRE" && (contenu.includes("rendezvous") || contenu.includes("rendez-vous"))) {
            navigate('/calendrier');
            return;
        }

        if (user?.utilisateur?.role === "CLIENT" && (contenu.includes("rendezvous") || contenu.includes("rendez-vous"))) {
            navigate('/mes-rendez-vous');
            return;
        }

        if (contenu.includes("avis")) {
            navigate('/mes-avis');
            return;
        }
    };

    // Styles pour la partie non connectée
    const loginContentWrapper = {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        mb: 2
    };

    const iconContainer = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f3ff',
        borderRadius: '50%',
        padding: '12px',
        marginRight: '16px'
    };

    const textContainer = {
        flex: 1
    };

    const titleStyle = {
        fontWeight: 600,
        color: '#2d3748',
        marginBottom: '4px'
    };

    const descriptionStyle = {
        color: '#718096',
        fontSize: '0.875rem'
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon sx={{ color: '#1a3a6c' }} />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 380,
                        maxHeight: 500,
                        mt: 1.5,
                        borderRadius: 2,
                        overflowY: 'auto',
                    },
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {isLoggedIn ? (
                    <>
                        <MenuItem disabled>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Notifications
                            </Typography>
                        </MenuItem>
                        <Divider />
                        {notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <MenuItem
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    sx={{ alignItems: 'flex-start', whiteSpace: 'normal' }}
                                >
                                    <Box flexGrow={1}>
                                        <Typography variant="body2" fontWeight="bold">
                                            {notif.contenu}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'gray' }}>
                                            {new Date(notif.dateEnvoi).toLocaleString('fr-FR', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </Typography>
                                    </Box>
                                    <FiberManualRecordIcon
                                        sx={{
                                            fontSize: 12,
                                            color: notif.estLue ? 'gray' : 'red',
                                            ml: 1,
                                            mt: 0.5
                                        }}
                                    />
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>
                                <ListItemText primary="Aucune notification" />
                            </MenuItem>
                        )}
                    </>
                ) : (
                    <Box sx={{ p: 2 }}>
                        <Box sx={loginContentWrapper}>
                            <Box sx={iconContainer}>
                                <LockIcon sx={{ color: '#1a3a6c' }} />
                            </Box>
                            <Box sx={textContainer}>
                                <Typography variant="subtitle1" sx={titleStyle}>
                                    Connectez-vous
                                </Typography>
                                <Typography variant="body2" sx={descriptionStyle}>
                                    Pour accéder à vos notifications personnalisées
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            fullWidth
                            variant="contained"
                            component={NavLink}
                            to="/login"
                            startIcon={<AccountCircleIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #1a3a6c 0%, #1a3a6c 100%)',
                                borderRadius: 2,
                                py: 1,
                                mb: 1,
                                textDecoration: 'none', 
                                color: 'white', 
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1a3a6c 0%, #1a3a6c 100%)',
                                },
                                '&.active': { color: 'white' } 
                            }}
                        >
                            Se connecter
                        </Button>


                    </Box>
                )}
            </Menu>
        </>
    );
};

export default NotificationMenu;