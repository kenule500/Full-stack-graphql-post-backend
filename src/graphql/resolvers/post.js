import { ApolloError } from "apollo-server-express";
import { isAuthenticated } from "../../directives/auth.directive.js";
import { PostRules } from "../../validators/post.js";

const PostLabels = {
  docs: "posts",
  limit: "perPage",
  nextPage: "next",
  prevPage: "prev",
  meta: "paginator",
  page: "currentPage",
  pagingCounter: "slNo",
  totalDocs: "totalPosts",
  totalPages: "totalPages",
};

export default {
  Query: {
    getAllPosts: isAuthenticated(async (_, { page, limit }, { Post }) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PostLabels,
        sort: {
          createdAt: -1,
        },
        populate: "author",
      };
      let posts = await Post.paginate({}, options);
      // let posts = await Post.find().populate("author", "-password");
      return posts;
    }),

    getAllMyPosts: isAuthenticated(
      async (_, { page, limit }, { Post, user }) => {
        const options = {
          page: page || 1,
          limit: limit || 10,
          customLabels: PostLabels,
          sort: {
            createdAt: -1,
          },
          populate: "author",
        };
        let posts = await Post.paginate({ author: user.id }, options);
        // let posts = await Post.find().populate("author", "-password");
        return posts;
      }
    ),

    getPostById: isAuthenticated(async (_, { id }, { Post }) => {
      try {
        let post = await Post.findById(id).populate("author", "-password");
        if (!post) throw new Error("post not found");
        return post;
      } catch (error) {
        throw new ApolloError(error.message, 400);
      }
    }),
  },

  Mutation: {
    createPost: isAuthenticated(async (_, { input }, { Post, user }, info) => {
      try {
        await PostRules.validate(input, { abortEarly: false });
        const post = await Post.create({ ...input, author: user.id });
        await post.populate("author");
        return post;
      } catch (error) {
        if (error.errors) throw new ApolloError(error.errors, 404);
      }
    }),

    updatePostByID: isAuthenticated(
      async (_, { input, id }, { Post, user }, info) => {
        try {
          let post = await Post.findOneAndUpdate(
            { _id: id, author: user.id },
            { ...input },
            { new: true }
          );
          if (!post) throw new Error("unable to edit post");
          return post;
        } catch (error) {
          throw new ApolloError(error.message, 400);
        }
      }
    ),

    deletePostByID: isAuthenticated(async (_, { id }, { Post, user }, info) => {
      try {
        let result = await Post.findOnedAndDelete({ _id: id, author: user.id });
        if (!result) throw new Error("unable to delete post");
        return {
          id: result.id,
          message: "Your post is deleted",
          success: true,
        };
      } catch (error) {
        throw new ApolloError(error.message, 400);
      }
    }),
  },
};
