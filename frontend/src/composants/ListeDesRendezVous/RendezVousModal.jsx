import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    IconButton,
    Box,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

export default function RendezVousModal({
    open,
    onClose,
    onSave,
    eventData,
    intervenant,
    setEventData,

}) {


    const handleChange = (key, value) => {
        setEventData(prev => ({ ...prev, [key]: value }));
        // setEventData?.(prev => ({ ...prev, [key]: value }));
    };
    console.log("intervenant", intervenant)
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>

            <Box sx={{ bgcolor: '#FFEFD5', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                    {'Modifier un rendez-vous'}
                </Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent dividers sx={{ pt: 3 }}>
                <TextField
                    label="Nom & Prénom de l’intervenant"
                    fullWidth
                    value={
                        intervenant?.entreprise?.nomEntreprise
                            ? intervenant.entreprise.nomEntreprise
                            : intervenant?.utilisateur.nom + " " + intervenant?.utilisateur.prenom || ''
                    }
                    onChange={e => handleChange('intervenant', e.target.value)}
                    margin="normal"
                    InputProps={{ readOnly: false }} // Toujours modifiable
                />
                <TextField
                    label="Raison du rendez-vous"
                    fullWidth
                    value={eventData?.raison}
                    onChange={e => handleChange('raison', e.target.value)}
                    margin="normal"

                />

                <TextField
                    label="Lieu d’intervention"
                    fullWidth
                    value={eventData?.lieuDintervention}
                    onChange={e => handleChange('lieuDintervention', e.target.value)}
                    margin="normal"

                />

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Date"
                            type="date"
                            fullWidth
                            value={eventData?.date}
                            onChange={e => handleChange('date', e.target.value)}
                            margin="normal"
                            InputProps={{ readOnly: false }}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Heure"
                            type="time"
                            fullWidth
                            value={eventData?.heure}
                            onChange={e => handleChange('heure', e.target.value)}
                            margin="normal"

                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>


            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, bgcolor: '#f9f9f9', borderTop: '1px solid #eee' }}>
                <Box sx={{ flex: 1 }} />

                <Button
                    onClick={onClose}
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        borderColor: '#d32f2f',
                        color: '#d32f2f',
                        '&:hover': {
                            backgroundColor: '#d32f2f',
                            color: '#fff',
                            borderColor: '#d32f2f',
                        }
                    }}
                >
                    Annuler
                </Button>

                <Button
                    // onClick={onSave}
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        borderRadius: 2,
                        px: 2.5,
                        py: 1,
                        ml: 2,
                        borderColor: '#244b8a',
                        color: '#244b8a',
                        '&:hover': {
                            backgroundColor: '#244b8a',
                            color: '#fff',
                            borderColor: '#244b8a',
                        }
                    }}
                >
                    Modifier
                </Button>

            </DialogActions>
        </Dialog>
    );
}
