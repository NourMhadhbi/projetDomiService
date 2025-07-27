import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getRepartitionUtili,
  getRendezVousU,
  getClientInter,
  getInscriptionM,
  getConsultationM,
} from '../services/statistiquesAdminservice';

export const fetchRepartitionUtilisateurs = createAsyncThunk(
  'statistique/repartitionUtilisateurs',
  async () => await getRepartitionUtili()
);

export const fetchRendezVousStats = createAsyncThunk(
  'statistique/rendezVous',
  async () => await getRendezVousU()
);

export const fetchClientInteractions = createAsyncThunk(
  'statistique/clientInteractions',
  async () => await getClientInter()
);

export const fetchInscriptionsParMois = createAsyncThunk(
  'statistique/inscriptionsParMois',
  async () => await getInscriptionM()
);

export const fetchConsultationsMensuelles = createAsyncThunk(
  'statistique/consultationsMensuelles',
  async () => await getConsultationM()
);

const statistiqueAdminSlice = createSlice({
  name: 'statistique',
  initialState: {
    repartitionUtilisateurs: null,
    rendezVous: null,
    clientInteractions: null,
    inscriptionsParMois: [],
    consultationsMensuelles: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Répartition utilisateurs
      .addCase(fetchRepartitionUtilisateurs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRepartitionUtilisateurs.fulfilled, (state, action) => {
        state.repartitionUtilisateurs = action.payload;
        state.loading = false;
      })
      .addCase(fetchRepartitionUtilisateurs.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // Rendez-vous
      .addCase(fetchRendezVousStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRendezVousStats.fulfilled, (state, action) => {
        state.rendezVous = action.payload;
        state.loading = false;
      })
      .addCase(fetchRendezVousStats.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // Interactions
      .addCase(fetchClientInteractions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClientInteractions.fulfilled, (state, action) => {
        state.clientInteractions = action.payload;
        state.loading = false;
      })
      .addCase(fetchClientInteractions.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // Inscriptions par mois
      .addCase(fetchInscriptionsParMois.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInscriptionsParMois.fulfilled, (state, action) => {
        state.inscriptionsParMois = action.payload;
        state.loading = false;
      })
      .addCase(fetchInscriptionsParMois.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // Consultations mensuelles
      .addCase(fetchConsultationsMensuelles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConsultationsMensuelles.fulfilled, (state, action) => {
        state.consultationsMensuelles = action.payload;
        state.loading = false;
      })
      .addCase(fetchConsultationsMensuelles.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default statistiqueAdminSlice.reducer;
