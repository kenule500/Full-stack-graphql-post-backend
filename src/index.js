import express from "express";
import { PORT } from "./config/indexConfig.js";
import { ApolloServer } from "apollo-server-express";
import { resolvers, typeDefs } from "./graphql/index.js";
import { connectWithRetry } from "./datatbase/db.js";
import DB from "./models/indexModel.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import AuthMiddleware from "./middlewares/auth.js";
import bodyParser from "body-parser";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(AuthMiddleware);
// Set Express Static Directory
app.use(express.static(join(__dirname, "./uploads")));
app.use(bodyParser.json());

app.use(
  graphqlUploadExpress({
    maxFileSize: 10000000, // Maximum file size in bytes (e.g., 10MB)
    maxFiles: 5,
  })
);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: false,
  context: ({ req }) => {
    let { isAuth, user } = req;
    // console.log("use", user);
    return {
      req,
      user,
      isAuth,
      ...DB,
      __dirname,
    };
  },
});
await server.start();

const startApp = () => {
  connectWithRetry();
  // inject apollo server
  server.applyMiddleware({ app });
  app.listen(PORT, () =>
    console.log(
      `🚀  Suucess: Server started on URL http://localhost:${PORT}${server.graphqlPath}`
    )
  );
};

startApp();
