import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPrestatairesRecherche ,getPrestatairesService} from '../services/PrestatairesService';
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
const prestataireSlice = createSlice({
    name: 'prestataires',
    initialState: {
   
        prestataires:[],
        loadingRecherche: false,
        erreurRecherche: null,
    },
    reducers: {},
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
            })
            ;
    },
});

export default prestataireSlice.reducer;