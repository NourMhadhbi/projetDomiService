import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getTop5, getServicesNonArchive, getService, getServices, ajouterService,
    modifierService,
    archiverService, activerService
} from '../services/ServiceDservice';
//  Récupérer les statistiques
export const getTop5Thunk = createAsyncThunk(
    'service/getTop5',
    async () => {
        const data = await getTop5();
        console.log("Données récupérées dans thunk :", data);
        return data;
    }
);
export const fetchServicesNA = createAsyncThunk(
    'service/getServicesNonArchive',
    async () => {
        const data = await getServicesNonArchive();
        console.log("Données récupérées dans thunk :", data);
        return data;
    }
);
export const fetchService = createAsyncThunk(
    'service/getService',
    async (id) => {
        const data = await getService(id);
        console.log("Données récupérées dans thunk :", data);
        return data;
    }
);
export const fetchServices = createAsyncThunk(
    'service/getServices',
    async () => {
        const data = await getServices();
        console.log("Données récupérées dans thunk :", data);
        return data;
    }
);
export const ajouterServiceThunk = createAsyncThunk(
    'service/ajouter',
    async (data, { rejectWithValue }) => {
        try {
            const res = await ajouterService(data);
            return res;
        } catch (error) {

            const message =
                error.response?.data?.message || error.message || "Erreur lors de l'ajout du service";
            return rejectWithValue(message);
        }
    }
);


export const modifierServiceThunk = createAsyncThunk(
    'service/modifier',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await modifierService({ id, data });
            return res;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || "Erreur lors de la modification du service";
            return rejectWithValue(message);
        }
    }
);


export const archiverServiceThunk = createAsyncThunk(
    'service/archiver',
    async (id) => {
        const res = await archiverService(id);
        return res;
    }
);
export const activerServiceThunk = createAsyncThunk(
    'service/activer',
    async (id) => {
        const res = await activerService(id);
        return res;
    }
);
// SLICE

const serviceSlice = createSlice({
    name: 'service',
    initialState: {
        topServices: [],
        services: [],
        serviceActuel: null,
        service: null,
        loading: false,
        error: null,
    },

    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTop5Thunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTop5Thunk.fulfilled, (state, action) => {
                state.loading = false;
                state.topServices = action.payload;
            })
            .addCase(getTop5Thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchServicesNA.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchServicesNA.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchServicesNA.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchService.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchService.fulfilled, (state, action) => {
                state.loading = false;
                state.service = action.payload;
            })
            .addCase(fetchService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(ajouterServiceThunk.fulfilled, (state, action) => {
                state.services.unshift(action.payload); // ajout en haut de la liste
            })
            .addCase(modifierServiceThunk.fulfilled, (state, action) => {
                const index = state.services.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.services[index] = action.payload;
            })
            .addCase(archiverServiceThunk.fulfilled, (state, action) => {
                const index = state.services.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.services[index] = action.payload;
            })
            .addCase(activerServiceThunk.fulfilled, (state, action) => {
                const index = state.services.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.services[index] = action.payload;
            })
            ;
    }
});

export default serviceSlice.reducer;