const router = require("express").Router();
const users = require("../db/queries/users");
const bcrypt = require("bcrypt");

// User accesses the profile page
router.get("/", (req, res) => {
  const userId = req.session.userId;

  if (!userId)
    return res.status(401).json({ message: "Login to view profile" });
  users
    .getUserUsername(userId)
    .then((data) => {
      data
        ? res.json(data)
        : res.status(404).json({ message: "User not found" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    });
});

// Register a new user
router.post("/", (req, res) => {
  const { email, username, password } = req.body;
  if (password.trim().length < 4)
    return res
      .status(400)
      .json({ message: "Password must be at least 4 in length" });
      
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      users
        .createUser(email, username, hash)
        .then((user) => {
          req.session.userId = user.id;
          return res.json(user);
        })
        .catch((err) => {
          if (err.code === "23505") {
            return res.status(400).json({
              message: "An account with this email address already exists.",
            });
          } else {
            console.error(err);
            return res.status(500).json({ message: "Unable to create user" });
          }
        });
    });
  });
});

module.exports = router;
