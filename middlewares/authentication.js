const { validateToken } = require("../services/authentication");
function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();    //Here it should be return next not only next because we dont want to execute the further code 
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}
    next();
  };
}
module.exports = {
  checkForAuthenticationCookie,
};
