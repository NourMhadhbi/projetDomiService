import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getStatistiques,
    ajoutAvis,
    modifierAvis,
    archiveAvis,
    getAvisParPrestataire,

    getAvisParId,
    getAvisParClient
} from '../services/Avissevice';



//  Récupérer les statistiques
export const getStatistiquesThunk = createAsyncThunk(
    'avis/getStatistiques',
    async (id) => await getStatistiques(id)
);

// Ajouter un avis
export const createAvis = createAsyncThunk(
    'avis/createAvis',
    async (avis) => await ajoutAvis(avis)
);

// Modifier un avis
export const updateAvis = createAsyncThunk(
    'avis/updateAvis',
    async (avis) => await modifierAvis(avis)
);

// Archiver un avis
export const archiverAvis = createAsyncThunk(
    'avis/archiveAvis',
    async (avis) => await archiveAvis(avis)
);

// Avis par prestataire
export const getAvisByPrestataire = createAsyncThunk(
    'avis/getAvisByPrestataire',
    async (id) => await getAvisParPrestataire(id)
);

//  Avis par entreprise
// export const getAvisByEntreprise = createAsyncThunk(
//     'avis/getAvisByEntreprise',
//     async (id) => await getAvisParEntreprise(id)
// );

//  Avis par ID
export const getAvisById = createAsyncThunk(
    'avis/getAvisById',
    async (id) => await getAvisParId(id)
);

// Avis par client
export const getAvisByClient = createAsyncThunk(
    'avis/getAvisByClient',
    async (clientId) => await getAvisParClient(clientId)
);


// SLICE

const avisSlice = createSlice({
    name: 'avis',
    initialState: {
        statistiques: {},
        listeAvis: [],
        listeAvisP: [],
        avisActuel: null,
        loadingStatistiques: false,
        loadingAvis: false,
        errorStatistiques: null,
        errorAvis: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // GET statistiques 
            .addCase(getStatistiquesThunk.pending, (state) => {
                state.loadingStatistiques = true;
                state.errorStatistiques = null;
            })
            .addCase(getStatistiquesThunk.fulfilled, (state, action) => {
                state.loadingStatistiques = false;
                state.statistiques = action.payload;
            })
            .addCase(getStatistiquesThunk.rejected, (state, action) => {
                state.loadingStatistiques = false;
                state.errorStatistiques = action.error.message;
            })

            // Ajouter un avis 
            .addCase(createAvis.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAvis.fulfilled, (state, action) => {
                state.loading = false;
                if (!Array.isArray(state.listeAvis)) {
                    state.listeAvis = [];
                }
                state.listeAvis.push(action.payload);
            })
            .addCase(createAvis.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Modifier un avis 
            .addCase(updateAvis.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAvis.fulfilled, (state, action) => {
                state.loading = false;
                if (!Array.isArray(state.listeAvis)) {
                    state.listeAvis = [];
                }
                const index = state.listeAvis.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.listeAvis[index] = action.payload;
                }
            })
            .addCase(updateAvis.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Archiver un avis 
            .addCase(archiverAvis.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(archiverAvis.fulfilled, (state, action) => {
                state.loading = false;
                if (!Array.isArray(state.listeAvis)) {
                    state.listeAvis = [];
                }
                const index = state.listeAvis.findIndex(a => a.id === action.payload.id);
                if (index !== -1) {
                    state.listeAvis[index].archive = true;
                }
            })
            .addCase(archiverAvis.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Avis par prestataire 
            .addCase(getAvisByPrestataire.pending, (state) => {
                state.loadingAvis = true;
                state.errorAvis = null;
            })
            .addCase(getAvisByPrestataire.fulfilled, (state, action) => {
                state.loadingAvis = false;
                if (action.payload && Array.isArray(action.payload.avis)) {
                    state.listeAvis = action.payload.avis;
                } else {
                    state.listeAvis = [];
                }
            })
            .addCase(getAvisByPrestataire.rejected, (state, action) => {
                state.loadingAvis = false;
                state.errorAvis = action.error.message;
            })

            // Avis par ID 
            .addCase(getAvisById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAvisById.fulfilled, (state, action) => {
                state.loading = false;
                state.avisActuel = action.payload;
            })
            .addCase(getAvisById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Avis par client
            .addCase(getAvisByClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAvisByClient.fulfilled, (state, action) => {
                state.loading = false;
                // if (Array.isArray(action.payload)) {
                state.listeAvis = action.payload;
                // } else {
                //     console.warn('Payload getAvisByClient attendu comme tableau:', action.payload);
                //     state.listeAvis = [];
                // }
            })
            .addCase(getAvisByClient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default avisSlice.reducer;