const JWT = require("jsonwebtoken");
const secret = "$uperM@n@123";

function createTokenforUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const token = JWT.sign(payload, secret);
  return token;
}
function validateToken(token) {
  try {
    const payload = JWT.verify(token, secret);
    return payload;
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
module.exports = {
  createTokenforUser,
  validateToken,
};
