
import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Paper, IconButton, Tooltip, Typography, Chip, Rating, useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCommentDots, faThumbsUp, faThumbsDown, faUser, faBuilding, faCalendarAlt,
    faClock
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import AvisModal from './AvisModal';
import CommentModal from './CommentModal';
import {
    updateAvis,
    archiverAvis,
    getAvisByClient,
    getAvisByPrestataire
} from '../../features/AvisSlice';

import { MaterialReactTable } from "material-react-table";

const ListeAvis = () => {
    const [reaction, setReaction] = useState('');
    const dispatch = useDispatch();
    const listeAvis = useSelector((state) => state.avis.listeAvis || []);
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [panelOpen, setPanelOpen] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    const isIntervenant = user?.utilisateur?.role === 'PRESTATAIRE' || user?.utilisateur?.role === 'ENTREPRISE';
    const theme = useTheme();
    const [selectedComment, setSelectedComment] = useState(null);
    const [commentModalOpen, setCommentModalOpen] = useState(false);

    const handleCommentClick = (comment) => {
        setSelectedComment(comment);
        setCommentModalOpen(true);
    };
    const [intervenantModal, setIntervenantModal] = useState(null);

    const [formData, setFormData] = useState({
        id: '', commentaire: '', note: '', aime: false,
        clientId: user?.utilisateurIdCl || null,
        prestataireId: null
    });

    useEffect(() => {
        if (!isLoggedIn || !user?.utilisateur) return;
        if (user.utilisateur.role === 'CLIENT') dispatch(getAvisByClient(user.utilisateurIdCl));
        if (user.utilisateur.role === 'PRESTATAIRE' || user.utilisateur.role === 'ENTREPRISE') dispatch(getAvisByPrestataire(user.utilisateurIdPre));
    }, [isLoggedIn, user, dispatch]);

    const rows = useMemo(() => listeAvis.map((avis) => {
        const client = avis.client?.utilisateur;
        return {
            id: avis.id,
            commentaire: avis.commentaire,
            date: new Date(avis.date).toLocaleString('fr-FR'),
            note: avis.note,
            prestataire: avis.prestataire?.entreprise?.nomEntreprise || `${avis.prestataire?.utilisateur?.prenom ?? ''} ${avis.prestataire?.utilisateur?.nom ?? ''}`,
            nomClient: `${client?.prenom ?? ''} ${client?.nom ?? ''}`,
            contactClient: client?.email || client?.telephone || '',
            adresseClient: `${avis.client?.ville ?? ''}, ${avis.client?.adresse ?? ''}`,
            aime: avis.aime,
            avis,
        }
    }), [listeAvis]);

    const handleEdit = (avis) => {
        setFormData({
            id: avis.id,
            commentaire: avis.commentaire || '',
            note: avis.note || '',
            aime: avis.aime || false,
            clientId: user?.utilisateurIdCl,
            prestataireId: avis.prestataireId || null,
        });
        setReaction(avis.aime === true ? 'like' : avis.aime === false ? 'dislike' : false);
        setIntervenantModal(avis.prestataire || null);
        setPanelOpen(true);
    };

    const handleDelete = async (avis) => {
        const confirm = await Swal.fire({
            title: '',
            html: `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
                <div style="font-size: 50px; color: #dc3545;">
                    <i class="fas fa-trash-alt"></i>
                </div>
                <p style="margin:0; font-weight:bold; font-size: 1.2rem;">Supprimer cet avis ?</p>
                <p style="margin:0; color: #6c757d;">Cette action est irréversible. Veuillez confirmer pour continuer.</p>
            </div>
        `,
            showCancelButton: true,

            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            background: '#f8f9fa',
            focusConfirm: false,
            reverseButtons: false,
            customClass: {
                popup: 'swal-popup-custom'
            }
        });

        if (confirm.isConfirmed) {
            await dispatch(archiverAvis({ id: avis.id })).unwrap();

            Swal.fire({
                title: '',
                html: `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                    <div style="font-size: 50px; color: #198754;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <p style="margin:0; font-weight:bold; font-size: 1.2rem;">Avis supprimé</p>
                    <p style="margin:0; color: #6c757d;">L'avis a été supprimé avec succès.</p>
                </div>
            `,
                confirmButtonText: 'OK',
                confirmButtonColor: '#198754',
                background: '#f0f9ff',
                timer: 10000,
                timerProgressBar: true
            });

            if (isIntervenant) dispatch(getAvisByPrestataire(user.utilisateurIdPre));
            else dispatch(getAvisByClient(user.utilisateurIdCl));
        }
    };


    const handleSave = async () => {

        Swal.fire({
            title: 'Mise à jour...',
            text: 'Veuillez patienter',
            didOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
        });

        try {
            await dispatch(updateAvis(formData)).unwrap();
            Swal.close();

            // Message succès plus professionnel
            Swal.fire({
                title: 'Mise à jour réussie',
                html: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
          
            <p style="margin:0;">L'avis a été mis à jour avec succès.<br>Vous pouvez continuer à gérer vos avis ci-dessous.</p>
        </div>
    `,
                icon: 'success',
                confirmButtonText: 'Continuer',
                confirmButtonColor: '#198754',
                background: '#f0f9ff',
                iconColor: '#198754',
                timer: 10000,
                timerProgressBar: true
            });

            setPanelOpen(false);

            if (isIntervenant) dispatch(getAvisByPrestataire(user.utilisateurIdPre));
            else dispatch(getAvisByClient(user.utilisateurIdCl));

        } catch (err) {
            Swal.close();

            Swal.fire({
                title: '⚠ Oups, une erreur est survenue',
                html: `
            <p>${err.message || 'Impossible de mettre à jour l\'avis pour le moment.'}</p>
            <p>Veuillez réessayer plus tard ou contacter le support si le problème persiste.</p>
        `,
                icon: 'error',
                confirmButtonText: 'Fermer',
                confirmButtonColor: '#d33',
                background: '#fff5f5',
                iconColor: '#c70000',
            });
        }
    };

    // Colonnes MRT
    const columns = useMemo(() => isIntervenant ? [
        {
            header: '#',
            accessorFn: (row, i) => i + 1,
            size: 50,
        },
        {
            accessorKey: 'nomClient',
            header: 'Client',
            Cell: ({ cell }) => (
                <Box display="flex" alignItems="center">
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: 8, color: '#757575' }} />
                    <Typography variant="body2" fontWeight="medium">{cell.getValue()}</Typography>
                </Box>
            ),
            size: 200
        },
        {
            accessorKey: 'contactClient',
            header: 'Contact',
            size: 180,
            Cell: ({ cell }) => (
                <Typography variant="body2" color="textSecondary">
                    {cell.getValue()}
                </Typography>
            )
        },
        {
            accessorKey: 'commentaire',
            header: 'Commentaire',
            Cell: ({ cell, row }) => (
                <Box
                    sx={{
                        p: 1,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        borderLeft: '3px solid',
                        borderLeftColor: theme.palette.primary.main,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: '#e8e8e8',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                    }}
                    onClick={() => handleCommentClick(row.original)}
                >
                    <Tooltip title="Cliquez pour voir le commentaire complet" arrow>
                        <Typography
                            variant="body2"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontStyle: 'italic',
                                lineHeight: 1.4
                            }}
                        >
                            "{cell.getValue()}"
                        </Typography>
                    </Tooltip>
                </Box>
            ),
            size: 300
        },
        {
            accessorKey: 'note',
            header: 'Note',
            Cell: ({ cell }) => (
                <Box display="flex" alignItems="center">
                    {/*on divise par 2 pour adapter 10/10 → 5 precision={0.5} : permet d’afficher des demi-étoiles (⭐½).*/}
                    <Rating value={cell.getValue() / 2} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold', color: theme.palette.primary.dark }}>
                        {cell.getValue()}/10
                    </Typography>
                </Box>
            ),
            size: 200
        },
        {
            accessorKey: 'aime',
            header: 'Réaction',
            Cell: ({ cell }) =>
                cell.getValue() === true ? (
                    <Chip
                        icon={<FontAwesomeIcon icon={faThumbsUp} />}
                        label="Aime"
                        color="success"
                        size="small"
                        variant="outlined"
                    />
                ) : cell.getValue() === false ? (
                    <Chip
                        icon={<FontAwesomeIcon icon={faThumbsDown} />}
                        label="N’aime pas"
                        color="error"
                        size="small"
                        variant="outlined"
                    />
                ) : '—',
            size: 200
        },
        {
            accessorKey: 'date',
            header: 'Date et Heure',
            Cell: ({ cell }) => {
                // Séparer la date et l'heure si nécessaire
                const [datePart, timePart] = cell.getValue().split(' ');

                return (
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <FontAwesomeIcon
                                icon={faCalendarAlt}
                                style={{
                                    color: '#757575',
                                    fontSize: '12px'
                                }}
                            />
                            <Typography variant="body2" color="textSecondary">
                                {datePart}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <FontAwesomeIcon
                                icon={faClock}
                                style={{
                                    color: '#757575',
                                    fontSize: '12px'
                                }}
                            />
                            <Typography variant="body2" color="textSecondary">
                                {timePart}
                            </Typography>
                        </Box>
                    </Box>
                );
            },
            size: 200
        },
    ] : [
        {
            header: '#',
            accessorFn: (row, i) => i + 1,
            size: 50,
        },
        {
            accessorKey: 'prestataire',
            header: 'Prestataire/Entreprise',
            Cell: ({ cell }) => (
                <Box display="flex" alignItems="center">
                    <FontAwesomeIcon
                        icon={user?.utilisateur?.role === 'ENTREPRISE' ? faBuilding : faUser}
                        style={{ marginRight: 8, color: '#757575' }}
                    />
                    <Typography variant="body2" fontWeight="medium">{cell.getValue()}</Typography>
                </Box>
            ),
            size: 200
        },
        {
            accessorKey: 'commentaire',
            header: 'Commentaire',
            Cell: ({ cell, row }) => (
                <Box
                    sx={{
                        p: 1,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        borderLeft: '3px solid',
                        borderLeftColor: theme.palette.primary.main,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: '#e8e8e8',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }
                    }}
                    onClick={() => handleCommentClick(row.original)}
                >
                    <Tooltip title="Cliquez pour voir le commentaire complet" arrow>
                        <Typography
                            variant="body2"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                fontStyle: 'italic',
                                lineHeight: 1.4
                            }}
                        >
                            "{cell.getValue()}"
                        </Typography>
                    </Tooltip>
                </Box>
            ),
            size: 300
        },
        {
            accessorKey: 'note',
            header: 'Note',
            Cell: ({ cell }) => (
                <Box display="flex" alignItems="center">
                    <Rating value={cell.getValue() / 2} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold', color: theme.palette.primary.dark }}>
                        {cell.getValue()}/10
                    </Typography>
                </Box>
            ),
            size: 200
        },
        {
            accessorKey: 'aime',
            header: 'Réaction',
            Cell: ({ cell }) =>
                cell.getValue() === true ? (
                    <Chip
                        icon={<FontAwesomeIcon icon={faThumbsUp} />}
                        label="Aime"
                        color="success"
                        size="small"
                        variant="outlined"
                    />
                ) : cell.getValue() === false ? (
                    <Chip
                        icon={<FontAwesomeIcon icon={faThumbsDown} />}
                        label="N’aime pas"
                        color="error"
                        size="small"
                        variant="outlined"
                    />
                ) : '—',
            size: 200
        },
        {
            accessorKey: 'date',
            header: 'Date et Heure',
            Cell: ({ cell }) => {
                // Séparer la date et l'heure si nécessaire
                const [datePart, timePart] = cell.getValue().split(' ');

                return (
                    <Box>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <FontAwesomeIcon
                                icon={faCalendarAlt}
                                style={{
                                    color: '#757575',
                                    fontSize: '12px'
                                }}
                            />
                            <Typography variant="body2" color="textSecondary">
                                {datePart}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <FontAwesomeIcon
                                icon={faClock}
                                style={{
                                    color: '#757575',
                                    fontSize: '12px'
                                }}
                            />
                            <Typography variant="body2" color="textSecondary">
                                {timePart}
                            </Typography>
                        </Box>
                    </Box>
                );
            },
            size: 200
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            Cell: ({ row }) => (
                <Box display="flex" gap={1}>
                    <Tooltip title="Modifier">
                        <IconButton
                            onClick={() => handleEdit(row.original.avis)}
                            color="primary"
                            size="small"
                            sx={{
                                backgroundColor: '#e3f2fd',
                                color: theme.palette.primary.main,
                                '&:hover': { backgroundColor: '#bbdefb' }
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <IconButton
                            onClick={() => handleDelete(row.original.avis)}
                            color="error"
                            size="small"
                            sx={{
                                backgroundColor: '#ffebee',
                                color: '#f44336',
                                '&:hover': { backgroundColor: '#ffcdd2' }
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
            size: 120,
        }
    ], [isIntervenant, theme, user]);

    return (
        <>
            <Header isClientConnected={isLoggedIn} />
            <Box
                sx={{
                    minHeight: '80vh',
                    width: "100%",
                    maxWidth: "100vw",
                    p: 3,
                    backgroundColor: '#f9fafb',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Box sx={{
                    minHeight: 600,
                    width: '95%',
                    maxWidth: '1800px'
                }}>
                    <Box mb={3} display="flex" alignItems="center" sx={{ width: '100%' }}>
                        <Box
                            sx={{
                                backgroundColor: '#f5f5f5',
                                borderRadius: '50%',
                                p: 1.5,
                                mr: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: `2px solid #ff6b00 `
                            }}
                        >
                            <FontAwesomeIcon icon={faCommentDots} style={{ fontSize: 25, color: "#ff6b00" }} />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a3a6c' }}>
                                Mes Avis
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Consultez et gérez tous vos avis
                            </Typography>
                        </Box>
                    </Box>

                    <Paper
                        elevation={1}
                        sx={{
                            width: '100%',
                            overflow: 'hidden',
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: `1px solid #e0e0e0`
                        }}
                    >
                        <MaterialReactTable
                            columns={columns}
                            data={rows}
                            enableColumnFilters
                            enablePagination
                            enableColumnResizing
                            enableGlobalFilter
                            layoutMode="table"
                            initialState={{
                                pagination: { pageSize: 5, pageIndex: 0 },
                                density: 'comfortable'
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
                                    color: '#424242',
                                    fontSize: '0.95rem',
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
                                    '&:nth-of-type(even)': {
                                        backgroundColor: '#fafafa',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#f1f1f1',
                                    },
                                },
                            }}
                            muiBottomToolbarProps={{
                                sx: {
                                    backgroundColor: '#f5f5f5',
                                    borderTop: '1px solid',
                                    borderColor: '#e0e0e0',
                                },
                            }}
                            displayColumnDefOptions={{
                                'mrt-row-actions': {
                                    header: 'Actions',
                                    size: 120,
                                },
                            }}
                            defaultColumn={{
                                minSize: 40,
                                maxSize: 500,
                            }}
                        />
                    </Paper>
                </Box>
            </Box>
            <Footer />
            <AvisModal
                show={panelOpen}
                onClose={() => setPanelOpen(false)}
                onSubmit={handleSave}
                formData={formData}
                setFormData={setFormData}
                reaction={reaction}
                setReaction={setReaction}
            />
            {commentModalOpen && (
                <CommentModal
                    open={commentModalOpen}
                    onClose={() => setCommentModalOpen(false)}
                    commentData={selectedComment}
                />
            )}
        </>
    );
};

export default ListeAvis;