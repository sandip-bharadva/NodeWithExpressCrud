const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["token"];

  if (!token) {
    return res.status(403).send({"message":"UnAuthenticated","status" : false});
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    if(req.user.role != 'admin'){
      return res.status(401).send({"message":"UnAuthenticated","status" : false});  
    }
  } catch (err) {
    return res.status(401).send({"message":"Invalid Token","status" : false});
  }
  return next();
};

module.exports = verifyToken;