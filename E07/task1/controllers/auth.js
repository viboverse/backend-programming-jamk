import User from "../models/User.js";
import bcrypt from "bcryptjs";

export async function register(req, res) {
  try {
    const { name, email, password, passwordConfirmation } = req.body;

    if (!name || !email || !password || !passwordConfirmation) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== passwordConfirmation) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existEmail = await User.findOne({ email: email });

    if (existEmail) {
      return res.status(400).json({ error: "Email Alrady Exist" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      msg: "User registered successfully",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "ERROR OCCURED!" });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    req.session.userId = user._id.toString();
    req.session.name = user.name;

    res.status(200).json({ message: "Login successful", name: user.name });
  } catch (error) {
    console.log("LOGIN ERROR: ", error);
  }
};

export const logout = (req, res, next) => {
  // DESTROY SESSION
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out" });
    }
    // Delete the cookie from the browser
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
};
