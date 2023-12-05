const router = require("express").Router();
const users = require("../db/queries/users");
const bcrypt = require("bcrypt");

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Login details are incorrect." });

  users.getUserByEmail(email).then((user) => {
    if (!user)
      return res.status(400).json({ message: "Login details are incorrect." });

    bcrypt.compare(password, user.hashed_password, (err, result) => {
      // return the userObject when the password is correct
      if (result) {
        // set the cookie
        req.session.userId = user.id;
        return res.json({
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
        });
      }

      if (err) {
        return res.status(500).json({ message: err });
      }

      return res.status(400).json({ message: "Login details are incorrect." });
    });
  });
});

router.post("/logout", (req, res) => {
  req.session = null;
  return res.status(200).end();
});

module.exports = router;
