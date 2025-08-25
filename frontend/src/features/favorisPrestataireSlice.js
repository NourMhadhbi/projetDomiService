import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favorisService } from '../services/favorisPrestataireservice';

// Thunks pour les opérations asynchrones
export const ajouterFavori = createAsyncThunk(
  'favoris/ajouterFavori',
  async ({ prestataireId, clientId }, { rejectWithValue }) => {
    try {
      return await favorisService.ajouterFavori(prestataireId, clientId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const marquerNonFavori = createAsyncThunk(
  'favoris/marquerNonFavori',
  async ({ prestataireId, clientId }, { rejectWithValue }) => {
    try {
      return await favorisService.marquerNonFavori(prestataireId, clientId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const supprimerFavori = createAsyncThunk(
  'favoris/supprimerFavori',
  async ({ prestataireId, clientId }, { rejectWithValue }) => {
    try {
      return await favorisService.supprimerFavori(prestataireId, clientId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchFavoris = createAsyncThunk(
  'favoris/fetchFavoris',
  async (clientId, { rejectWithValue }) => {
    try {
      return await favorisService.getFavoris(clientId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchNonFavoris = createAsyncThunk(
  'favoris/fetchNonFavoris',
  async (clientId, { rejectWithValue }) => {
    try {
      return await favorisService.getNonFavoris(clientId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const checkStatutPrestataire = createAsyncThunk(
  'favoris/checkStatutPrestataire',
  async ({ prestataireId, clientId }, { rejectWithValue }) => {
    try {
      return await favorisService.getStatutPrestataire(prestataireId, clientId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Slice
const favorisSlice = createSlice({
  name: 'favoris',
  initialState: {
    favoris: [],
    nonFavoris: [],
    statutPrestataire: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetStatut: (state, action) => {
      const prestataireId = action.payload;
      delete state.statutPrestataire[prestataireId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Ajouter favori
      .addCase(ajouterFavori.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ajouterFavori.fulfilled, (state, action) => {
        state.loading = false;
        const { prestataireId } = action.meta.arg;
        state.statutPrestataire[prestataireId] = 'FAVORI';
      })
      .addCase(ajouterFavori.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Marquer non favori
      .addCase(marquerNonFavori.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(marquerNonFavori.fulfilled, (state, action) => {
        state.loading = false;
        const { prestataireId } = action.meta.arg;
        state.statutPrestataire[prestataireId] = 'NON_FAVORI';
      })
      .addCase(marquerNonFavori.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Supprimer favori
      .addCase(supprimerFavori.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(supprimerFavori.fulfilled, (state, action) => {
        state.loading = false;
        const { prestataireId } = action.meta.arg;
        state.statutPrestataire[prestataireId] = 'AUCUN';
      })
      .addCase(supprimerFavori.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch favoris
      .addCase(fetchFavoris.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoris.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Payload reçue fetchFavoris:', action.payload);
        state.favoris = action.payload;

      })
      .addCase(fetchFavoris.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch non favoris
      .addCase(fetchNonFavoris.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNonFavoris.fulfilled, (state, action) => {
        state.loading = false;
        state.nonFavoris = action.payload;
      })
      .addCase(fetchNonFavoris.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check statut prestataire
      .addCase(checkStatutPrestataire.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkStatutPrestataire.fulfilled, (state, action) => {
        state.loading = false;
        const { prestataireId } = action.meta.arg;
        state.statutPrestataire[prestataireId] = action.payload;
      })
      .addCase(checkStatutPrestataire.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetStatut } = favorisSlice.actions;
export default favorisSlice.reducer;