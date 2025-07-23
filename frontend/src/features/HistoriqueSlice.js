import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    ajoutHistorique,
    supprimeHistorique,
    getHistorique,
} from '../services/HistoriqueService';

// Création
export const createHistorique = createAsyncThunk(
    'historique/createHistorique',
    async ({ clientId, prestataireId }) => {
        return await ajoutHistorique(clientId, prestataireId);
    }
);



// Nouvelle version deleteHistorique avec un objet complet
export const deleteHistorique = createAsyncThunk(
    'historique/deleteHistorique',
    async ({ clientId, prestataireId, dateVisite }) => {
        return await supprimeHistorique({ clientId, prestataireId, dateVisite });
    }
);
// Récupération (dernière visite)
export const fetchDernierHistorique = createAsyncThunk(
    'historique/fetchDernierHistorique',
    async ({ clientId }) => {
        return await getHistorique(clientId);
    }
);
const historiqueSlice = createSlice({
    name: 'historique',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createHistorique.pending, (state) => {
                state.loading = true;
            })
            .addCase(createHistorique.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(createHistorique.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(deleteHistorique.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteHistorique.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteHistorique.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(fetchDernierHistorique.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDernierHistorique.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchDernierHistorique.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default historiqueSlice.reducer;
