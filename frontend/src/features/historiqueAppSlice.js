import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { enregistrerConsultation } from '../services/historiqueAppservice';

export const enregistrerHistoriqueApp = createAsyncThunk(
  'historiqueApp/enregistrer',
  async (utilisateurId) => await enregistrerConsultation(utilisateurId)
);

const historiqueAppSlice = createSlice({
  name: 'historiqueApp',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(enregistrerHistoriqueApp.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(enregistrerHistoriqueApp.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(enregistrerHistoriqueApp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default historiqueAppSlice.reducer;
