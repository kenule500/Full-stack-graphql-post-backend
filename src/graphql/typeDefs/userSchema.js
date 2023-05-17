import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    authUserProfile: User!
    authenticateUser(username: String!, password: String!): UserOutput!
  }

  extend type Mutation {
    registerUser(input: UserInput): UserOutput!
  }

  input UserInput {
    firstName: String!
    email: String!
    username: String!
    lastName: String!
    password: String!
  }

  type User {
    id: ID!
    firstName: String!
    email: String!
    username: String!
    lastName: String!
    createdAt: String
    updatedAt: String
  }

  type UserOutput {
    user: User!
    token: String!
  }
`;
