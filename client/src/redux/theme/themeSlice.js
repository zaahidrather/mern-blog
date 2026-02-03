import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: 'light'
}

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        themeToggle: ((state) => {
            state.mode = (state.mode == 'light' ? 'dark' : 'light')
        })
    }

})

export const { themeToggle } = themeSlice.actions;
export default themeSlice.reducer;