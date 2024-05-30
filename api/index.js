const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const User = require("./models/user");
const Post = require("./models/post");

// for generating the secret key
const generateSecreteKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecreteKey();

mongoose
  .connect(
    "mongodb+srv://bibeknayaju:bibek@cluster0.tax3aie.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("CONNECTED TO MONGODB");
  })
  .catch((error) => {
    console.log("ERROR RIGHT MONGODB CONNECTION", error);
  });

// function to send the email
const sendVerificationEmail = async (email, verificationToken) => {
  // create a nodemailer transport
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "sthaict@gmail.com",
      pass: "tnvjwuqfowyctrnq",
    },
  });

  // compose the email
  const mailOption = {
    from: "sthaict@gmail.com",
    to: email,
    subject: "For verification process demo",
    text: `Please click in the following link to verify your email: http://localhost:8000/verify/${verificationToken}`,
  };

  // send the email
  try {
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.log("ERROR IN SENDING THE EMAIL", error);
    throw error; // Re-throw the error to be caught later
  }
};

// endpoint for the registering the user
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking the existing user
    const exisitingUser = await User.findOne({ email });

    if (exisitingUser) {
      return res.status(400).json({ message: "user already exists brother" });
    }

    // else create new user
    const newUser = new User({ email, name, password });

    // generate the verification token and store it
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // and then save the user
    await newUser.save();

    // send the verification email to the user
    await sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Error in registering the user", error.message);
    res.json({ message: "error in registering" }).status(500);
  }
});

// for verify the email
app.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "invalid token" });
    }

    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "email verified successfully" });
  } catch (error) {
    console.log("error in verification process", error.message);
    res.status(500).json({ message: "email verification failed" });
  }
});

// endpoint for the login purpose
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "invalid email" });
    }

    if (user.password !== password) {
      return res.status(404).json({ message: "invalid password brother" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);
    res.status(200).json({ token });
  } catch (error) {
    console.log("error in login process", error.message);
    res.status(500).json({ message: "error in login purpose" });
  }
});

//endpoint to access all the users except the logged in the user
// this is getting all the user except the logged in user
app.get("/user/:userId", (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    User.find({ _id: { $ne: loggedInUserId } })
      .then((users) => {
        res.status(200).json(users);
        console.log(users);
      })
      .catch((error) => {
        console.log("Error: ", error);
        res.status(500).json("errror");
      });
  } catch (error) {
    res.status(500).json({ message: "error getting the users" });
  }
});

// endpoint of the following the user
app.post("/user/follow", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.log("Error in following the user", error.message);
    res.status(500).json({ message: "Error in the following th user" });
  }
});

// end point to the unfollow the  user
app.post("/user/unfollow", async (req, res) => {
  try {
    const { loggedInUserId, targetUserId } = req.body;

    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.log("Error in unfollowing the user", error.message);
    res.status(500).json({ message: "Error in the unfollowing th user" });
  }
});

// endpoint to the create a new post
app.post("/create-post", async (req, res) => {
  try {
    const { content, userId } = req.body;

    const newPostData = {
      user: userId,
    };
    if (content) {
      newPostData.content = content;
    }

    const newPost = new Post(newPostData);

    await newPost.save();

    res.status(200).json({ message: "post created successfully" });
  } catch (error) {
    console.log("error in the creating the post");
    res.status(500).json({ message: "error in the creating the new post" });
  }
});

// endpoint for the liking the post
app.put("/post/:postId/:userId/like", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    // find the post
    const post = await Post.findById(postId).populate("user", "name");

    // find the post and then like the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: userId },
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "post not found mate" });
    }

    updatedPost.user = post.user;

    res.json(updatedPost);
  } catch (error) {
    console.log("error in the likin the post", error);
    res.status(500).json({ message: "error in the liking the post brother" });
  }
});

// unlike the post by the user
app.put("/post/:postId/:userId/unlike", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    // find the post
    const post = await Post.findById(postId).populate("user", "name");

    // find the post and then like the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: userId },
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "post not found mate" });
    }

    updatedPost.user = post.user;

    res.json(updatedPost);
  } catch (error) {
    console.log("error in the likin the post", error);
    res.status(500).json({ message: "error in the liking the post brother" });
  }
});

// to retrieve all the post
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.log("error in the getting the posts", error);
    res.status(500).json({ message: "error in the gettig the post back" });
  }
});

// for getting th user details
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error while getting the profile" });
  }
});

app.listen(port, () => {
  console.log(`SERVER STARTED ${port}`);
});
