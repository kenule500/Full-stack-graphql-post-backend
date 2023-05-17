import { ForbiddenError } from "apollo-server-express";

// Define custom permission check functions based on your application's logic
const isAdmin = (user) => user.role === "admin";
const isEditor = (user) => user.role === "editor";
const isLoggedin = (user) => !!user;

export const isAuthenticated = (next) => (parent, args, context) => {
  if (!isLoggedin(context.user && !context.isAuth !== true)) {
    throw new ForbiddenError(
      "You are not authorized to perform this operation."
    );
  }
  return next(parent, args, context);
};
