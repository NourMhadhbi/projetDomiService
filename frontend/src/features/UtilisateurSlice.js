import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIntervenant, getIntervenantbyId, getPrestatairesProches, getUtilisateurs, activerCompte, desactiverCompte, getTousPrestataires } from '../services/Utilisateurservice';
export const fetchIntervenant = createAsyncThunk(
    'utilisateur/fetchIntervenant',
    async () => await getIntervenant()
);
export const fetchTousPrestataires = createAsyncThunk(
    'utilisateur/fetchTousPrestataires',
    async () => await getTousPrestataires()
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
export const fetchUtilisateursParRole = createAsyncThunk(
    'utilisateur/fetchUtilisateursParRole',
    async (role = 'TOUS', { rejectWithValue }) => {
        try {
            const data = await getUtilisateurs(role);
            return { role, data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Erreur API');
        }
    }
);

export const activerCompteThunk = createAsyncThunk(
    'utilisateur/activerCompte',
    async (id, thunkAPI) => {
        try {
            return await activerCompte(id);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

export const desactiverCompteThunk = createAsyncThunk(
    'utilisateur/desactiverCompte',
    async ({ id, raison }, thunkAPI) => {
        try {
            return await desactiverCompte(id, raison);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);
const intervenantSlice = createSlice({
    name: 'utilisateur',
    initialState: {
        intervenants: [],
        intervenantP: [],
        intervenantsFetched: false,
        utilisateursParRole: [],
        roleActif: 'TOUS',
        intervenant: null,
        loading: false,
        success: null,
        utilisateur: null,
        error: null
    },

    reducers: {
        clearUtilisateurState: (state) => {
            state.success = null;
            state.error = null;
            state.utilisateur = null;
        }
    },
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
            .addCase(fetchTousPrestataires.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTousPrestataires.fulfilled, (state, action) => {
                state.loading = false;
                state.intervenants = action.payload;
            })
            .addCase(fetchTousPrestataires.rejected, (state, action) => {
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
                  state.intervenantsFetched = true;
            })
            .addCase(fetchUtilisateursParRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUtilisateursParRole.fulfilled, (state, action) => {
                state.loading = false;
                state.utilisateursParRole = action.payload.data;
                state.roleActif = action.payload.role;
            })
            .addCase(fetchUtilisateursParRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            .addCase(activerCompteThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(activerCompteThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.utilisateur = action.payload;
                state.success = "Compte activé avec succès.";
            })
            .addCase(activerCompteThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Désactivation
            .addCase(desactiverCompteThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(desactiverCompteThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.utilisateur = action.payload;
                state.success = "Compte désactivé avec succès.";
            })
            .addCase(desactiverCompteThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });




    },

});
export const { clearUtilisateurState } = intervenantSlice.actions;
export default intervenantSlice.reducer;
