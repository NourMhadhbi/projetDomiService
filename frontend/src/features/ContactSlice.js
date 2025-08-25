
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { envoyerContact } from '../services/ContactMessageservice';


export const envoyerContactAsync = createAsyncThunk(
  'contact/envoyerContact',
  async (contactData, thunkAPI) => {
    try {
      const response = await envoyerContact(contactData);
      return response.data; 
    } catch (error) {
  
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'envoi du message'
      );
    }
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetContactState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(envoyerContactAsync.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(envoyerContactAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(envoyerContactAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetContactState } = contactSlice.actions;

export default contactSlice.reducer;
