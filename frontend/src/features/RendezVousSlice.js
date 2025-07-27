import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
    ajoutRendezvous,
    modifierRendezVous,
    supprimerRendezVous,
    fetchRendezVousByClient,
    // fetchRendezVousByEntreprise,
    fetchRendezVousById,
    // fetchRendezVousByPrestataire,
    terminerRendezVous,
    annulerRendezVous,
    confirmerRendezVous,
    fetchRendezVousByIntervenant
} from '../services/RendezVousservice';

// Thunks asynchrones
export const createRendezVous = createAsyncThunk(
    'rendezVous/createRendezVous',
    async (rendezVous) => await ajoutRendezvous(rendezVous)
);

export const updateRendezVous = createAsyncThunk(
    'rendezVous/updateRendezVous',
    async (rendezVous) => await modifierRendezVous(rendezVous)
);

export const deleteRendezVous = createAsyncThunk(
    'rendezVous/deleteRendezVous',
    async (rendezVous) => await supprimerRendezVous(rendezVous)
);

export const confirmRendezVous = createAsyncThunk(
    'rendezVous/confirmRendezVous',
    async (rendezVous) => await confirmerRendezVous(rendezVous)
);

export const cancelRendezVous = createAsyncThunk(
    'rendezVous/cancelRendezVous',
    async (rendezVous) => await annulerRendezVous(rendezVous)
);

export const finishRendezVous = createAsyncThunk(
    'rendezVous/finishRendezVous',
    async (rendezVous) => await terminerRendezVous(rendezVous)
);

export const fetchByClient = createAsyncThunk(
    'rendezVous/fetchByClient',
    async (clientId) => await fetchRendezVousByClient(clientId)
);

// export const fetchByPrestataire = createAsyncThunk(
//     'rendezVous/fetchByPrestataire',
//     async (prestataireId) => await fetchRendezVousByPrestataire(prestataireId)
// );

// export const fetchByEntreprise = createAsyncThunk(
//     'rendezVous/fetchByEntreprise',
//     async (entrepriseId) => await fetchRendezVousByEntreprise(entrepriseId)
// );
export const fetchByIntervenant = createAsyncThunk(
    'rendezVous/fetchByIntervenant',
    async (id) => await fetchRendezVousByIntervenant(id)
);

export const fetchById = createAsyncThunk(
    'rendezVous/fetchById',
    async (id) => await fetchRendezVousById(id)
);


// Slice
const rendezVousSlice = createSlice({
    name: 'rendezVous',
    initialState: {
        listeRendezVous: [],
        rendezVousActuel: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Ajouter
            .addCase(createRendezVous.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRendezVous.fulfilled, (state, action) => {
                state.loading = false;
                state.listeRendezVous.push(action.payload);

            })
            .addCase(createRendezVous.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Modifier
            .addCase(updateRendezVous.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRendezVous.fulfilled, (state, action) => {
                state.loading = false;
                state.listeRendezVous = state.listeRendezVous.map(rdv =>
                    rdv.id === action.payload.id ? action.payload : rdv
                );
            })
            .addCase(updateRendezVous.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Supprimer
            .addCase(deleteRendezVous.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRendezVous.fulfilled, (state, action) => {
                state.loading = false;
                /*
                state.listeRendezVous est un tableau d’objets rendez-vous.

.filter(...) crée un nouveau tableau contenant uniquement les éléments qui respectent la condition.

La condition ici : r.id !== action.meta.arg.id

On garde tous les rendez-vous dont l’id n’est PAS égal à action.meta.arg.id.

Donc on élimine celui qui a cet id précis.
                
                ispatch(deleteRendezVous({ id: 5 }));
action.meta.arg contient l’argument passé à ce thunk ({ id: 5 }).*/
                state.listeRendezVous = state.listeRendezVous.filter(r => r.id !== action.meta.arg.id);
            })
            .addCase(deleteRendezVous.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Confirmer
            .addCase(confirmRendezVous.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmRendezVous.fulfilled, (state, action) => {
                state.loading = false;
                state.listeRendezVous = state.listeRendezVous.map(rdv =>
                    rdv.id === action.payload.id ? action.payload : rdv
                );
            })
            .addCase(confirmRendezVous.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Annuler
            .addCase(cancelRendezVous.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelRendezVous.fulfilled, (state, action) => {
                state.loading = false;
                state.listeRendezVous = state.listeRendezVous.map(rdv =>
                    rdv.id === action.payload.id ? action.payload : rdv
                );
            })
            .addCase(cancelRendezVous.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Terminer
            .addCase(finishRendezVous.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(finishRendezVous.fulfilled, (state, action) => {
                state.loading = false;
                state.listeRendezVous = state.listeRendezVous.map(rdv =>
                    rdv.id === action.payload.id ? action.payload : rdv
                );
            })
            .addCase(finishRendezVous.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch by client
            .addCase(fetchByClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchByClient.fulfilled, (state, action) => {
                state.loading = false;
                state.listeRendezVous = action.payload;
            })
            .addCase(fetchByClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch by prestataire
            // .addCase(fetchByPrestataire.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(fetchByPrestataire.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.listeRendezVous = action.payload;
            // })
            // .addCase(fetchByPrestataire.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message;
            // })

            // Fetch by entreprise
            // .addCase(fetchByEntreprise.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(fetchByEntreprise.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.listeRendezVous = action.payload;
            // })
            // .addCase(fetchByEntreprise.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message;
            // })
            // Fetch by intervenant
            .addCase(fetchByIntervenant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchByIntervenant.fulfilled, (state, action) => {
                state.loading = false;
                state.listeRendezVous = action.payload.rendezVous || [];
            })
            .addCase(fetchByIntervenant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch by id
            .addCase(fetchById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchById.fulfilled, (state, action) => {
                state.loading = false;
                state.rendezVousActuel = action.payload;
            })
            .addCase(fetchById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default rendezVousSlice.reducer;
