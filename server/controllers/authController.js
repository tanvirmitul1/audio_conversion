/* eslint-disable no-undef */
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, mobile_number, address } =
      req.body;

    // Validation
    if (
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !mobile_number ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }

    // Create a new user
    const user = new User({
      first_name,
      last_name,
      email,
      password,
      mobile_number,
      address,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate tokens
    const access = generateAccessToken(user);
    const refresh = generateRefreshToken(user);
    // Optionally, store the refresh token in the database or send it as an HttpOnly cookie
    // user.refreshToken = refreshToken;
    await user.save();

    // Send response
    res.status(200).json({
      message: "Login successful",
      access,
      refresh,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" } // Access token expires in 15 minutes
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // Refresh token expires in 7 days
  );
};
