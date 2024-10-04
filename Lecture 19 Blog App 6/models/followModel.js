const { LIMIT } = require("../privateConstants");
const followSchema = require("../schemas/followSchema");
const userSchema = require("../schemas/userSchema");

const followUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check if already following
      const followAlreadyDb = await followSchema.findOne({
        followerUserId,
        followingUserId,
      });

      if (followAlreadyDb) {
        return reject("Already following the user.");
      }

      const followObj = new followSchema({
        followerUserId,
        followingUserId,
        creationDateTime: Date.now(),
      });
      const followDb = await followObj.save();
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getFollowingList = ({ followerUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //   const followingListDb = await followSchema
      //     .find({
      //       followerUserId: followerUserId,
      //     })
      //     .populate("followingUserId");

      const followingListDb = await followSchema.aggregate([
        { $match: { followerUserId: followerUserId } },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      const followingUserIdsList = followingListDb.map(
        (follow) => follow.followingUserId
      );

      const followingUSerDetails = await userSchema.find({
        _id: { $in: followingUserIdsList },
      });

      console.log(followingListDb);
      console.log(followingUserIdsList);
      console.log(followingUSerDetails);

      resolve(followingUSerDetails.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

const getFollowerList = ({ followingUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followerListDb = await followSchema.aggregate([
        { $match: { followingUserId: followingUserId } },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      const followerUserIdsList = followerListDb.map(
        (follow) => follow.followerUserId
      );

      const followerUserDetails = await userSchema.find({
        _id: { $in: followerUserIdsList },
      });

      console.log(followerListDb);
      console.log(followerUserIdsList);
      console.log(followerUserDetails);

      resolve(followerUserDetails.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

const unfollowUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followDb = await followSchema.findOneAndDelete({
        followerUserId,
        followingUserId,
      });
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  followUser,
  getFollowingList,
  unfollowUser,
  getFollowerList,
};
