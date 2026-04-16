// USERS
const users = [
  {
    id: 1,
    username: "karma",
    full_name: "Karma Dorji",
    email: "karma@example.com",
    bio: "Travel photographer",
    created_at: "2023-01-15"
  },
  {
    id: 2,
    username: "tashi",
    full_name: "Tashi Wangchuk",
    email: "tashi@example.com",
    bio: "Food lover",
    created_at: "2023-02-10"
  }
];

// POSTS
const posts = [
  {
    id: 1,
    user_id: 1,
    caption: "Beautiful sunset 🌅",
    image_url: "https://example.com/post1.jpg",
    created_at: "2023-03-01"
  },
  {
    id: 2,
    user_id: 2,
    caption: "Delicious ema datshi 😋",
    image_url: "https://example.com/post2.jpg",
    created_at: "2023-03-05"
  }
];

// COMMENTS
const comments = [
  {
    id: 1,
    post_id: 1,
    user_id: 2,
    text: "Amazing view!",
    created_at: "2023-03-02"
  },
  {
    id: 2,
    post_id: 2,
    user_id: 1,
    text: "Looks tasty!",
    created_at: "2023-03-06"
  }
];

// LIKES
const likes = [
  {
    id: 1,
    post_id: 1,
    user_id: 2
  },
  {
    id: 2,
    post_id: 2,
    user_id: 1
  }
];

// FOLLOWERS
const followers = [
  {
    id: 1,
    user_id: 1,
    follower_id: 2
  },
  {
    id: 2,
    user_id: 2,
    follower_id: 1
  }
];

// EXPORT ALL
module.exports = {
  users,
  posts,
  comments,
  likes,
  followers
};