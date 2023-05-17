import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllPosts(page: Int, limit: Int): PostPaginator!
    getAllMyPosts(page: Int, limit: Int, user_id: ID): PostPaginator!
    getPostById(id: ID!): Post!
  }

  extend type Mutation {
    createPost(input: PostInput!): Post!
    updatePostByID(input: PostInput!, id: ID!): Post!
    deletePostByID(id: ID!): PostNotification!
  }

  input PostInput {
    title: String
    content: String
    featureImage: String
  }

  type Post {
    id: ID
    title: String!
    content: String!
    featureImage: String
    author: User!
    createdAt: String
    updatedAt: String
  }

  type PostNotification {
    id: ID!
    message: String!
    success: Boolean!
  }

  type PostPaginator {
    posts: [Post!]!
    paginator: Paginator!
  }

  type Paginator {
    slNo: Int
    prev: Int
    next: Int
    perPage: Int
    totalPosts: Int
    totalPages: Int
    currentPage: Int
    hasPrevPage: Boolean
    hasNextPage: Boolean
  }
`;
