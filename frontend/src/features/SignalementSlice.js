import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSignales, ajouterSignale,checkSignale } from '../services/SignalementService';


export const fetchSignales = createAsyncThunk(
  'signalement/fetchSignales',
  async () => {
    const res = await getSignales();
    return res;
  }
);
export const checkSignales = createAsyncThunk(
  'signalement/checkSignales',
  async () => {
    const res = await checkSignale();
    return res;
  }
);

export const ajouterSignaleThunk = createAsyncThunk(
  'signalement/ajouterSignale',
  async (data) => {
    const res = await ajouterSignale(data);
    return res;
  }
);

// Slice
const signalementSlice = createSlice({
  name: 'signalement',
  initialState: {
    signales: [],
    signalementsParUtilisateur:[],
    loading: false,
    error: null,
  },
  reducers: {
    resetSignales: (state) => {
      state.signales = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSignales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSignales.fulfilled, (state, action) => {
        state.loading = false;

        state.signales = action.payload;

      })
      .addCase(fetchSignales.rejected, (state, action) => {
        state.loading = false;

        state.error = action.error.message;
      })
      .addCase(ajouterSignaleThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(ajouterSignaleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.signales.push(action.payload); // Ajout dans la liste locale
      })
      .addCase(ajouterSignaleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
       .addCase(checkSignales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSignales.fulfilled, (state, action) => {
        state.loading = false;
          state.signalementsParUtilisateur = action.payload;
      })
      .addCase(checkSignales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
      
      ;
  },
});
export const { resetSignales } = signalementSlice.actions;
export default signalementSlice.reducer;
