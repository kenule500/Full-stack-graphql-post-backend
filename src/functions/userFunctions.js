import jwt from "jsonwebtoken";
import { SECRET } from "../config/indexConfig.js";
import pkg from "lodash";
const { pick } = pkg;

export const assignToken = async (user) => {
  let token = await jwt.sign(user, SECRET, {
    expiresIn: 60 * 60 * 24,
  });
  return `Bearer ${token}`;
};

export const userTransformer = (user) => {
  return pick(user, [
    "id",
    "username",
    "email",
    "firstName",
    "lastName",
    "createdAt",
    "updatedAt",
  ]);
};
