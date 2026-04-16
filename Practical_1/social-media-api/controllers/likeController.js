const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { likes } = require('../utils/mockData');

// @desc Get all likes
// @route GET /api/likes
exports.getLikes = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    count: likes.length,
    data: likes
  });
});

// @desc Create like
// @route POST /api/likes
exports.createLike = asyncHandler(async (req, res, next) => {
  const userId = req.header('X-User-Id');

  if (!userId) {
    return next(new ErrorResponse('Not authorized', 401));
  }

  const newLike = {
    id: (likes.length + 1).toString(),
    post_id: req.body.post_id,
    user_id: userId
  };

  likes.push(newLike);

  res.status(201).json({
    success: true,
    data: newLike
  });
});

// @desc Delete like
// @route DELETE /api/likes/:id
exports.deleteLike = asyncHandler(async (req, res, next) => {
  const like = likes.find(l => l.id === req.params.id);

  if (!like) {
    return next(
      new ErrorResponse(`Like not found with id of ${req.params.id}`, 404)
    );
  }

  const index = likes.findIndex(l => l.id === req.params.id);
  likes.splice(index, 1);

  res.status(200).json({
    success: true,
    data: {}
  });
});