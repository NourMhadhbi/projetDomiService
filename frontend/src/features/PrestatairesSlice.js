import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPrestatairesRecherche, getPrestatairesService, getClientContactPres } from '../services/PrestatairesService';
export const fetchPrestatairesRecherche = createAsyncThunk(
    'prestataires/fetchRecherche',
    async (q, thunkAPI) => {
        try {
            return await getPrestatairesRecherche(q);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Erreur inconnue');
        }
    }
);
export const fetchPrestatairesService = createAsyncThunk(
    'prestataires/fetchService',
    async (id, thunkAPI) => {
        try {
            return await getPrestatairesService(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Erreur inconnue');
        }
    }
);
export const fetchClientsContact = createAsyncThunk(
    'contactPrestataire/fetchClientsContact',
    async (prestataireId, { rejectWithValue }) => {
        try {
            const data = await getClientContactPres(prestataireId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
const prestataireSlice = createSlice({
    name: 'prestataire',
    initialState: {
        clients: [],
        prestataires: [],
        loadingRecherche: false,
        erreurRecherche: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPrestatairesRecherche.pending, (state) => {
                state.loadingRecherche = true;
                state.erreurRecherche = null;
            })
            .addCase(fetchPrestatairesRecherche.fulfilled, (state, action) => {
                state.loadingRecherche = false;
                state.prestataires = action.payload;
            })
            .addCase(fetchPrestatairesRecherche.rejected, (state, action) => {
                state.loadingRecherche = false;
                state.erreurRecherche = action.payload;
            })
            .addCase(fetchPrestatairesService.pending, (state) => {
                state.loadingRecherche = true;
                state.erreurRecherche = null;
            })
            .addCase(fetchPrestatairesService.fulfilled, (state, action) => {
                state.loadingRecherche = false;
                state.prestataires = action.payload;
            })
            .addCase(fetchPrestatairesService.rejected, (state, action) => {
                state.loadingRecherche = false;
                state.erreurRecherche = action.payload;
            }).addCase(fetchClientsContact.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClientsContact.fulfilled, (state, action) => {
                state.clients = action.payload;
                console.log("client succes", state.clients)
                state.loading = false;
            })
            .addCase(fetchClientsContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Erreur de chargement';
                   console.log("client succes",   state.error)
            })
            ;
    },
});

export default prestataireSlice.reducer;