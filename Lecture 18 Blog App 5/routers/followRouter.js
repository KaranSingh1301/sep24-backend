const express = require("express");
const {
  followUserController,
  getFollowingListController,
  unfollowController,
} = require("../controllers/followController");
const followRouter = express.Router();

followRouter
  .post("/follow-user", followUserController)
  .get("/get-followingList", getFollowingListController)
  .post("/unfollow-user", unfollowController);

module.exports = followRouter;
