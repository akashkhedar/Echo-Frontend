import { createSelector } from "@reduxjs/toolkit";

export const selectFollowerCount = createSelector(
  (state) => state.user?.follower || [],
  (followerArray) => followerArray.length
);
