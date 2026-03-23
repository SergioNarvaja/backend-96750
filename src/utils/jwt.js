import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const generateResetToken = (email) => {
  return jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const verifyResetToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};