import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";


// yeh wala initial request maarega jaise hi hum website par pohochenge par iska kaam h unke liye jo pehle se hi logged in h unke liye cookie jaayega accpet ho jaayega aur user ka data dedega uar routing k through mein isse direct /home page mein login kradunga.
// rejectedwithVlaue error ko payload mein daal deta h warna error action.error mein rehta h rejectwithvalue error ko action.payload mein shift krdeta h.
export const fetchUser = createAsyncThunk<object, void, { rejectValue: object }>("auth/fetchUser", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/user/start");

        return res.data;
    } catch (error: any) {
        return rejectWithValue(error.response.data);

    }
});

export const RegisterUser = createAsyncThunk<object, object, { rejectValue: object }>("auth/register", async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/user/register", data);
        return res.data;
    } catch (error: any) {
        console.log("REGISTER ERROR:", error.response?.data);
        return rejectWithValue(error.response.data);

    }
});



interface AuthState {
    isLoading: boolean,
    isAuthenticated: boolean,
    error: null | string | object,
    user: object | null
}

const IntialState: AuthState = {
    isLoading: true,
    isAuthenticated: false,
    error: null,
    user: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState: IntialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
            state.isLoading = true
            state.isAuthenticated = false
            state.error = null
            state.user = null
        }).addCase(fetchUser.fulfilled, (state, action) => {
            state.isLoading = false
            // !!action.payload iska matlb h agar data aaya jo ki object fromat mein aayega toh !{} iska matlab hua -> false aur !!{} false ka ulta -> true. aise kaam krta h yeh. bychance agar backend se object nahi aaya aur null aaya toh isauthencticatd mein false store ho jaayega bcoz !null = > true aur !!null ->false
            state.isAuthenticated = !!action.payload
            state.error = null
            state.user = action.payload

        }).addCase(fetchUser.rejected, (state, action) => {
            state.isLoading = false
            state.isAuthenticated = false

            // action.payload ka type TypeScript mein object | undefined hota h
            // runtime pe undefined kabhi nahi aayega lekin TypeScript ko satisfy karne k liye ?? null lagaya
            state.error = action.payload || "Something Went Wrong"
            state.user = null
        }).addCase(RegisterUser.pending, (state) => {
            state.isLoading = true
            state.isAuthenticated = false
            state.error = null
            state.user = null
        }).addCase(RegisterUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.isAuthenticated = true
            state.error = null
            state.user = action.payload

        }).addCase(RegisterUser.rejected, (state, action) => {
            state.isLoading = false
            state.isAuthenticated = false
            state.error = action.payload || "Something Went Wrong"
            state.user = null
        })
    }

});

export default authSlice.reducer;
