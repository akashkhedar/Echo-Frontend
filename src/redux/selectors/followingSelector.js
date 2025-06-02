import { createSelector } from "@reduxjs/toolkit";

export const selectFollowingCount = createSelector(
  (state) => state.user?.following || [],
  (followingArray) => followingArray.length
);
