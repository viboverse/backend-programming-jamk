import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Provide both Email & Password" });
    }

    // Fetch user from DB
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: "Wrong Credential" });
    }

    // Check password, cuz was hashed in task 1
    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if (!passwordIsMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });

    res.status(200).json({ msg: "user created", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
}
