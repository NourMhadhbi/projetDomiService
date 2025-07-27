import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    ajoutHistorique,
    supprimeHistorique,
    getHistorique,
    getPopulaireP,
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
// export const deleteHistorique = createAsyncThunk(
//   'historique/deleteHistorique',
//   async (id) => {
//     await supprimeHistorique({ id });
//     return id; // renvoie juste l'id pour mise à jour
//   }
// );
// Récupération (dernière visite)
export const fetchDernierHistorique = createAsyncThunk(
    'historique/fetchDernierHistorique',
    async ({ clientId }) => {
        return await getHistorique(clientId);
    }
);
export const fetchPopulaireP = createAsyncThunk(
    'historique/fetchPopulaireP',
    async () => {
        return await getPopulaireP();
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
            })
            .addCase(fetchPopulaireP.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPopulaireP.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchPopulaireP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default historiqueSlice.reducer;
