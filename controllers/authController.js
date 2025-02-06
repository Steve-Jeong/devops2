import Auth from "../models/authModel.js";
import bcrypt from "bcryptjs";
import chalk from "chalk";

export const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) throw new Error("username is required 1");
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
      console.log("hashedPassword : ", hashedPassword);
    } else {
      throw new Error("password is required 2");
    }
    const user = await Auth.create({
      username,
      password: hashedPassword,
    });
    console.log(user);
    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log("sign up error : ", error);
    if (error.code == 11000) {
      console.log("username already exists 3");
    }
    if (!error.code && error.errors?.username) {
      console.log("username is required 4");
    }
    if (!error.code && error.errors?.password) {
      console.log("password is required 5");
    }
    res.status(400).json({
      status: "fail",
    });
  }
};

export const listAllUsers = async (req, res) => {
  try {
    const users = await Auth.find();
    console.log(users);
    res.status(200).json({
      users,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Auth.findOne({ username });
    if (!user) {
      console.log("user do not exist");
      return res.status(401).json({
        status: "fail",
      });
    }
    console.log("found user : ", user);
    const passwordVerified = await bcrypt.compare(password, user.password);
    console.log("passwordVerified : ", passwordVerified);
    if (passwordVerified) {
      req.session.username = username;
      req.session.theme = {
        // express-session에 다른 변수도 넣을 수 있다.
        theme: "dark",
        font: "d2coding",
      };

      console.log("login user : ", req.session.username);
      console.log("theme : ", req.session.theme);
      return res.status(200).json({
        status: "success",
        user: req.session.username,
      });
    } else {
      console.log("incorrect password");
      return res.status(400).json({
        status: "fail",
        message: "incorrect password",
      });
    }
  } catch (e) {
    console.log("login catch error : ", e);
    res.status(400).json({
      status: "fail",
    });
  }
};

export const logout = (req, res) => {
  console.log(chalk.red(`username is ${req.session.username}`));
  if (req.session.username) {
    console.log(`${req.session.username} is logged out`);
    req.session.username = null;
    res.status(200).json({
      status: "success",
      message: "successfully logged out",
    });
  } else {
    console.log(chalk.cyan("The user was not logged in"));
    res.status(400).json({
      status: "fail",
      message: "user is not logged in",
    });
  }
};

export const whoami = (req, res) => {
  if (req.session.username) {
    console.log(chalk.magenta(`username is ${req.session.username}`));
    res.status(200).json({
      status: "success",
      user: req.session.username,
    });
  } else {
    console.log(chalk.magenta("user is not logged in"));
    res.status(400).json({
      status: "fail",
      message: "user is not logged in",
    });
  }
};
