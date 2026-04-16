const express = require('express');
const {
    getLikes,
    getLike,
    createLike,
    updateLike,
    deleteLike
} = require('../controllers/likeController');

const router = express.Router();

router.route('/').get(getLikes).post(createLike);

router.route('/:id').get(getLike).put(updateLike).delete(deleteLike);

module.exports = router;