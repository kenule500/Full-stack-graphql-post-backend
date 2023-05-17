import { parse, join } from "path";
import { createWriteStream } from "fs";
import GraphqlUpload from "graphql-upload/GraphQLUpload.mjs";
import { URL } from "url";

export default {
  Upload: GraphqlUpload,

  Mutation: {
    imageUploader: async (_, { file }, { __dirname }) => {
      const { createReadStream, filename } = await file;
      console.log(file);

      const { ext, name } = parse(filename);
      const sanitizedFilename = name
        .replace(/([^a-z0-9 ]+)/gi, "-")
        .replace(" ", "_");

      const serverFilePath = join(
        __dirname,
        `../uploads/${sanitizedFilename}-${Date.now()}${ext}`
      );

      const readStream = createReadStream();
      const writeStream = createWriteStream(serverFilePath);

      await new Promise((resolve, reject) => {
        readStream.on("error", reject);
        writeStream.on("error", reject);
        writeStream.on("finish", resolve);
        readStream.pipe(writeStream);
      });

      const serverFileUrl = `http://localhost:4000/uploads/${sanitizedFilename}-${Date.now()}${ext}`;

      return serverFileUrl.toString();
    },
  },
};
