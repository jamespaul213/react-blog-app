import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../Api/supaBaseClient";

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunk for registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return thunkAPI.rejectWithValue(error.message);
    return data.user;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      supabase.auth.signOut();
      state.user = null;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Registration
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
     // Login
    //   .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
    //   .addCase(loginUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
    //   .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});


export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;