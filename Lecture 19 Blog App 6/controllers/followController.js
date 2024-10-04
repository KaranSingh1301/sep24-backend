const {
  followUser,
  getFollowingList,
  unfollowUser,
  getFollowerList,
} = require("../models/followModel");
const User = require("../models/userModel");

const followUserController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  try {
    await User.findUserWithKey({ key: followerUserId });
    await User.findUserWithKey({ key: followingUserId });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }

  try {
    const followDb = await followUser({ followerUserId, followingUserId });

    return res.send({
      status: 201,
      message: "follow successfull",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const getFollowingListController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  try {
    const followingListDb = await getFollowingList({ followerUserId, SKIP });
    if (followingListDb.length === 0) {
      return res.send({
        status: 204,
        message: "No following found",
      });
    }
    return res.send({
      status: 200,
      message: "Read success",
      data: followingListDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const getFollowerListController = async (req, res) => {
  const followingUserId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  try {
    const followerListDb = await getFollowerList({ followingUserId, SKIP });
    if (followerListDb.length === 0) {
      return res.send({
        status: 204,
        message: "No following found",
      });
    }
    return res.send({
      status: 200,
      message: "Read success",
      data: followerListDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const unfollowController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  try {
    const followDb = await unfollowUser({ followerUserId, followingUserId });

    return res.send({
      status: 200,
      message: "Unfollow successfull",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = {
  followUserController,
  getFollowingListController,
  unfollowController,
  getFollowerListController,
};

//userA---->userB
//test1--->test
//test1--->test2
//test1--->test3
//test1--->test4
//test1--->test5

//test-->test1
//test2--->test1
