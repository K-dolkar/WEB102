const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { followers } = require('../utils/mockData');

// @desc Get followers
// @route GET /api/followers
exports.getFollowers = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    count: followers.length,
    data: followers
  });
});

// @desc Follow user
// @route POST /api/followers
exports.createFollower = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');

  if (!userId) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  const newFollower = {
    id: (followers.length + 1).toString(),
    user_id: req.body.user_id,
    follower_id: userId
  };

  followers.push(newFollower);

  res.status(201).json({
    success: true,
    data: newFollower
  });
});

// @desc Unfollow
// @route DELETE /api/followers/:id
exports.deleteFollower = asyncHandler(async (req, res, next) => {
  const follower = followers.find(f => f.id === req.params.id);

  if (!follower) {
    return next(
      new ErrorResponse(`Follower not found with id of ${req.params.id}`, 404)
    );
  }

  const index = followers.findIndex(f => f.id === req.params.id);
  followers.splice(index, 1);

  res.status(200).json({
    success: true,
    data: {}
  });
});