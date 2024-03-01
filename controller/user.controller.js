const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const empModel = require("../models/user.model");
// const transporter = require("./../models/emailConfig");

exports.userRegistration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, password_confirmation, tc } = req.body;

    const user = await empModel.findOne({ email: email })
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password !== password_confirmation) {
      return res.status(400).json({ message: "Password and Confirm Password doesn't match" });
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    const newUserDetails = {
      name: name,
      email: email,
      password: hashPassword,
      tc: tc
    }
    const success = await empModel.create(newUserDetails);
    const saved_user = await empModel.findOne({ email: email })
    const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
    res.status(201).json({ message: "Success saving data", "token": token });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({
      message: "Error saving data",
      error: err
    });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await empModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "You are not a Registered User" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email or Password is not Valid" });
    }

    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });
    return res.status(200).json({ message: "Login Success", token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      message: "Error logging in",
      error: error
    });
  }
};

exports.loggedUser = (req, res) => {
  return res.status(200).json({ message: "user details retrieved succesfully", "user": req.user });
};

exports.changeUserPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;

    const salt = await bcrypt.genSalt(10)
    const newHashPassword = await bcrypt.hash(password, salt)
    await empModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      message: "Error changing password",
      error: error
    });
  }
};

exports.sendUserPasswordResetEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await empModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Email doesn't exist" });
    }

    const secret = user._id + process.env.JWT_SECRET_KEY
    const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
    const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
    console.log(link);
    // // Send Email
    // let info = await transporter.sendMail({
    //   from: process.env.EMAIL_FROM,
    //   to: user.email,
    //   subject: "Password Reset Link",
    //   html: `<a href=${link}>Click Here</a> to Reset Your Password`
    // })
    return res.status(200).json({ message: "Password Reset Email Sent. Please Check Your Email" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return res.status(500).json({ message: "Error sending password reset email", error: error });
  }
};

exports.userPasswordReset = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, token } = req.params;
    const { password } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const new_secret = user._id + process.env.JWT_SECRET_KEY;
    jwt.verify(token, new_secret);

    const salt = await bcrypt.genSalt(10);
    const newHashPassword = await bcrypt.hash(password, salt);
    await empModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } });

    return res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Error resetting password", error: error });
  }
};