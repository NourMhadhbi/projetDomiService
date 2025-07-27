import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { signup, signin } from "../services/Authservice";
export const register = createAsyncThunk(
    "auth/register",
    async (user, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await signup(user);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    });
export const login = createAsyncThunk(
    "auth/login",
    async (user, thunkAPI) => {
        try {
            const res = await signin(user);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue();
        }
    });
export const logout = createAsyncThunk("auth/logout", () => {
    localStorage.clear();
});

// export const fetchUserFromToken = createAsyncThunk(
//     'auth/fetchUserFromToken',
//     async (_, thunkAPI) => {
//         try {
//             const token = localStorage.getItem('CC_Token');
//             if (!token) return thunkAPI.rejectWithValue('No token found');

//             const user = await getUserFromToken(token);
//             return user;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(
//                 error.response?.data || error.message || 'Failed to fetch user'
//             );
//         }
//     }
// );
export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: JSON.parse(localStorage.getItem("CC_User") || "null"),
        isLoading: false,
        isSuccess: false,
        isError: false,
        errorMessage: "",
        isLoggedIn: !!localStorage.getItem("CC_Token"),
    },

    reducers: {
        // Reducer comes here
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.errorMessage = ""
            state.isLoggedIn = false
        }
    },
    extraReducers: (builder) => {

        builder
            //insertion user
            .addCase(register.pending, (state, action) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
                state.status = null;
                state.isSuccess = true
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true
                state.status = action.payload;
                state.user = null
            })
            .addCase(login.pending, (state, action) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isLoggedIn = true;

                let user = null;

                if (action.payload.user) {
                    user = action.payload.user;
                } else if (action.payload.utilisateur?.utilisateur) {
                    user = action.payload.utilisateur.utilisateur;
                }

                if (user) {
                    state.user = user;
                    localStorage.setItem("CC_User", JSON.stringify(user));
                } else {
                    state.user = null;
                }

                localStorage.setItem("CC_Token", action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
            })

            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false;
                state.user = null;
            });
        // .addCase(fetchUserFromToken.pending, (state) => {
        //     state.isLoading = true;
        //     state.isError = false;
        // })
        // .addCase(fetchUserFromToken.fulfilled, (state, action) => {
        //     state.isLoading = false;
        //     state.user = action.payload.user;
        //     state.isLoggedIn = true;
        // })
        // .addCase(fetchUserFromToken.rejected, (state) => {
        //     state.isLoading = false;
        //     state.user = null;
        //     state.isLoggedIn = false;
        //     localStorage.removeItem('CC_Token');
        // });
    }
}
)
export const { reset } = authSlice.actions
export default authSlice.reducer;
