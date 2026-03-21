import User from "../models/User.js";

export const register = async (req, res) => {
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
};
