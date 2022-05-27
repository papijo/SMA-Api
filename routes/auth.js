const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //Encrypt Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Generate New User
    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      profilePicture: req.body.profilePicture,
      coverPicture: req.body.coverPicture,
      desc: req.body.desc,
      city: req.body.city,
      from: req.body.from,
      relationship: req.body.relationship,
    });

    //Save user and return response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User not Found");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json("Wrong Password");
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
