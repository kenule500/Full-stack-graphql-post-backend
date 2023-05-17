import jwt from "jsonwebtoken";
import { SECRET } from "../config/indexConfig.js";
import User from "../models/UserModel.js";
import { userTransformer } from "../functions/userFunctions.js";

const AuthMiddleware = async (req, res, next) => {
  const authHeaders = req.get("Authorization");

  if (!authHeaders) {
    req.isAuth = false;
    return next();
  }

  let token = authHeaders.split(" ")[1];
  if (!token || token == "") {
    req.isAuth = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, SECRET);
  } catch (error) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  let authUser = await User.findOne({ username: decodedToken.username });
  authUser.id = authUser._id;
  authUser = userTransformer(authUser);
  if (!authUser) {
    req.isAuth = false;
    return next();
  }
  req.user = authUser;
  req.isAuth = true;
  return next();
};

export default AuthMiddleware;
