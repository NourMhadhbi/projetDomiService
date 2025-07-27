import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import NotificationService from '../services/Notificationservice';

export const fetchNotifications = createAsyncThunk(
    'notification/fetchNotifications',
    async ({ id, role }, thunkAPI) => {
        try {
            const data = await NotificationService.fetchNotifications(id, role);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Erreur lors du chargement des notifications");
        }
    }
);
export const markNotificationAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (id, thunkAPI) => {
        try {
            const data = await NotificationService.markAsRead(id);
            return { id };
        } catch (error) {
            return thunkAPI.rejectWithValue("Erreur lors de la mise à jour de la notification");
        }
    }
);
const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        liste: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearNotifications: (state) => {
            state.liste = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.liste = action.payload;
                state.loading = false;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.liste.findIndex(notif => notif.id === action.payload.id);
                if (index !== -1) {
                    state.liste[index].estLue = true;
                }
            })
            .addCase(markNotificationAsRead.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
