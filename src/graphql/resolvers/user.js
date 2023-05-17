import { ApolloError } from "apollo-server-express";
import bcrypt from "bcryptjs";
import { assignToken, userTransformer } from "../../functions/userFunctions.js";
import {
  UserAuthenticationRules,
  UserRegisterationRules,
} from "../../validators/user.js";
import { isAuthenticated } from "../../directives/auth.directive.js";

export default {
  Query: {
    authUserProfile: isAuthenticated(async (_, {}, { user, User }) => {
      const result = await User.findOne({ _id: user.id });
      return result;
    }),

    authenticateUser: async (_, { username, password }, { User }) => {
      try {
        await UserAuthenticationRules.validate(
          { username, password },
          { abortEarly: false }
        );
        let user = await User.findOne({
          username,
        });
        if (!user) throw new Error("Username not found");

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid Credentials");

        user.id = user._id;
        user = userTransformer(user);
        let token = await assignToken(user);
        return {
          user,
          token,
        };
      } catch (error) {
        if (error.errors) throw new ApolloError(error.errors, 404);
        throw new ApolloError(error.message, 404);
      }
    },
  },

  Mutation: {
    registerUser: async (_, { input }, { User }) => {
      try {
        await UserRegisterationRules.validate(input, {
          abortEarly: false,
        });
        let { username, email } = input;

        let user;
        user = await User.findOne({ username });
        if (user) throw new Error("Username already taken");

        user = await User.findOne({ email });
        if (user) throw new Error("Email already taken");

        user = new User(input);

        user.password = await bcrypt.hash(input.password, 12);
        let result = await user.save();
        result.id = result._id;
        result = userTransformer(result);
        let token = await assignToken(result);
        return {
          token,
          user: result,
        };
      } catch (error) {
        if (error.errors) throw new ApolloError(error.errors, 404);
        throw new ApolloError(error.message, 404);
      }
    },
  },
};
