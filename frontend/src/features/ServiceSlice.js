import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTop5, getServicesNonArchive, getService } from '../services/ServiceDservice';
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
            ;
    }
});

export default serviceSlice.reducer;