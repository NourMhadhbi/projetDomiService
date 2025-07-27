import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    ListItemText,
    Divider,
    Typography,
    Box
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationAsRead } from '../../features/NotificationSlice';

const NotificationMenu = () => {
    const dispatch = useDispatch();
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

    const handleNotificationClick = (notifId) => {
        dispatch(markNotificationAsRead(notifId)); // API pour maj estLue
        handleClose();
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
                            onClick={() => handleNotificationClick(notif.id)}
                            sx={{
                                alignItems: 'flex-start',
                                whiteSpace: 'normal',
                            }}
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
            </Menu>
        </>
    );
};

export default NotificationMenu;
