import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIntervenant, getIntervenantbyId, getPrestatairesProches } from '../services/Utilisateurservice';
export const fetchIntervenant = createAsyncThunk(
    'utilisateur/fetchIntervenant',
    async () => await getIntervenant()
);
export const fetchIntervenantbyId = createAsyncThunk(
    'utilisateur/fetchIntervenantbyId',
    async (id) => {
        return await getIntervenantbyId(id);
    }
);
export const fetchPrestatairesProches = createAsyncThunk(
    'prestatairesProches/fetchPrestatairesProches',
    async (clientId, { rejectWithValue }) => {
        try {
            const data = await getPrestatairesProches(clientId);
            return data;
        } catch (error) {
            console.error("Erreur API Prestataires proches :", error);
            return rejectWithValue(error.response?.data?.message || "Erreur API");
        }
    }
);

const intervenantSlice = createSlice({
    name: 'utilisateur',
    initialState: {
        intervenants: [],
        intervenantP: [],
        intervenantsFetched: false,
        intervenant: null,
        loading: false,
        error: null
    },
  
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchIntervenant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIntervenant.fulfilled, (state, action) => {
                state.loading = false;
                state.intervenants = action.payload;
            })
            .addCase(fetchIntervenant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchIntervenantbyId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIntervenantbyId.fulfilled, (state, action) => {
                state.loading = false;
                state.intervenant = action.payload;

            })
            .addCase(fetchIntervenantbyId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchPrestatairesProches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPrestatairesProches.fulfilled, (state, action) => {
                state.loading = false;
                const isSame = JSON.stringify(state.intervenants) === JSON.stringify(action.payload);
                if (!isSame) {
                    state.intervenants = action.payload;
                }
                state.intervenantsFetched = true;
            })
            .addCase(fetchPrestatairesProches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });


    },

});

export default intervenantSlice.reducer;
