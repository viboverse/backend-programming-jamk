import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "No token in header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const { id, name } = decoded;
    req.user = { id, name };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorized to access this route" });
  }
};

export default authUser;
