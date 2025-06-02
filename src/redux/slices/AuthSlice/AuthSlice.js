import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "Auth",
  initialState: {},
  reducers: {
    setUser: (state, action) => {
      return action.payload;
    },
    removeFollowing: (state, action) => {
      const userIdToRemove = action.payload;
      state.following = state.following.filter((id) => id !== userIdToRemove);
    },
    removeFollower: (state, action) => {
      const userIdToRemove = action.payload;
      state.followers = state.follower.filter((id) => id !== userIdToRemove);
    },
  },
});

export const { setUser, removeFollower, removeFollowing } = AuthSlice.actions;
export default AuthSlice.reducer;
