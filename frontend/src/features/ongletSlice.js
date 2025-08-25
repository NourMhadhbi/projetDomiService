// src/store/ongletSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    actif: 'services', // valeur par défaut
};

export const ongletSlice = createSlice({
    name: 'onglet',
    initialState,
    reducers: {
        setOnglet: (state, action) => {
            state.actif = action.payload;
        },
    },
});

export const { setOnglet } = ongletSlice.actions;
export default ongletSlice.reducer;

