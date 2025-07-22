import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIntervenant, getIntervenantbyId } from '../services/Utilisateurservice';
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
const intervenantSlice = createSlice({
    name: 'intervenant',
    initialState: {
        intervenants: [],
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
            });
    }
});

export default intervenantSlice.reducer;
