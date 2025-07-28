import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getClientsRecherche } from '../services/Clientservice';
export const fetchclientsRecherche = createAsyncThunk(
    'clients/fetchRecherche',
    async (q, thunkAPI) => {
        try {
            return await getClientsRecherche(q);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || 'Erreur inconnue');
        }
    }
);

const clientSlice = createSlice({
    name: 'clients',
    initialState: {

        clients: [],
        loadingRecherche: false,
        erreurRecherche: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchclientsRecherche.pending, (state) => {
                state.loadingRecherche = true;
                state.erreurRecherche = null;
            })
            .addCase(fetchclientsRecherche.fulfilled, (state, action) => {
                state.loadingRecherche = false;
                state.clients = action.payload;
            })
            .addCase(fetchclientsRecherche.rejected, (state, action) => {
                state.loadingRecherche = false;
                state.erreurRecherche = action.payload;
            });
    },
});

export default clientSlice.reducer;